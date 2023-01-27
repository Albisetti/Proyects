import React, {
    useRef,
    useEffect,
    useState,
    Fragment,
    useContext,
} from "react";
import { Popover } from "@headlessui/react";
import { Transition } from "@headlessui/react";
import { Link, useLocation } from "react-router-dom";

import { APP_LOGO } from "../../util/constants";
import packageJson from "../../../package.json";
import { toast } from "react-toastify";
import { AuthContext } from "../../contexts/auth";
import Loader from "../Loader/Loader";
import { VALID_USER_TYPES } from "../../util/constants";

const UserHeader = ({ token, handleLogin }) => {
    const {
        userData,
        impersonator,
        stopImpersonating,
        type,
        setForcingImpersonation,
    } = useContext(AuthContext);

    if (impersonator !== null) {
        let impersonationFeedback = `You are currently working as ${userData.first_name} ${userData.last_name}`;
        if (localStorage.getItem("currentOrganization") !== "undefined") {
            impersonationFeedback = `You are currently working as ${userData.first_name} ${userData.last_name} (${localStorage.getItem("currentOrganization")})`;
        }

        return (
            <div className="text-right text-gray-500">
                <p>{impersonationFeedback}</p>

                <div
                    className="font-bold cursor-pointer text-secondary"
                    onClick={stopImpersonating}
                >
                    Stop Working As
                </div>
            </div>
        );
    }

    /*
     * If we aren't impersonating but we are an admin, then display the Impersonate link in the
     * navigation area.  Clicking this will initiate an impersonation flow that allows selection of
     * ANY user type.
     */
    if (!impersonator && token && type === "ADMIN") {
        return (
            <>
                <div
                    className="font-title text-secondary focus:outline-none px-4 cursor-pointer"
                    onClick={() => setForcingImpersonation(VALID_USER_TYPES)}
                >
                    Work As
                </div>
                <Link
                    to="/login"
                    onClick={() => handleLogin()}
                    className=" font-title text-secondary focus:outline-none px-4 cursor-pointer"
                >
                    {token ? "Logout" : "Login"}
                </Link>
            </>
        );
    }

    return (
        <>
            <Link
                to="/login"
                onClick={() => handleLogin()}
                className=" font-title text-secondary focus:outline-none px-4 cursor-pointer"
            >
                {token ? "Logout" : "Login"}
            </Link>
        </>
    );
};

const Header1 = (props) => {
    const [whoCanAccess, setWhoCanAccess] = useState();
    const userNavigation = [
        { name: "Your Profile", href: "#" },
        { name: "log out", href: "#" },
    ];
    const focusSearch = useRef();
    function classNames(...classes) {
        return classes.filter(Boolean).join(" ");
    }

    const location = useLocation();
    let { type, setType, hideHeader } = useContext(AuthContext);

    useEffect(() => {
        if (type === "ADMIN") {
            setWhoCanAccess("ADMIN");
        } else if (type === "BUILDERS" || type === "TERRITORY_MANAGER") {
            setWhoCanAccess("OTHER");
        }
    }, [type]);

    const token = localStorage.getItem("token");

    useEffect(() => {
        clearCache();
        // eslint-disable-next-line
    }, [location.pathname]);

    useEffect(() => {
        if (
            type === "BUILDERS" &&
            props?.location?.pathname === "/reporting/bundles"
        ) {
            setHoverActive("bundles");
        }
    }, [type, props?.location]);

    const clearCache = () => {
        fetch("/meta.json", {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        })
            .then((response) => response.json())
            .then((meta) => {
                const latestVersionDate = meta.buildDate;
                const currentVersionDate = packageJson.buildDate;

                const shouldForceRefresh = buildDateGreaterThan(
                    latestVersionDate,
                    currentVersionDate
                );
                if (shouldForceRefresh) {
                    refreshCacheAndReload();
                } else {
                }
            });
    };

    const refreshCacheAndReload = () => {
        if (caches) {
            // Service worker cache should be cleared with caches.delete()
            caches.keys().then(async function (names) {
                await Promise.all(names.map((name) => caches.delete(name)));
            });
            // });
        }
        window.location.reload(true);
    };

    const buildDateGreaterThan = (latestDate, currentDate) => {
        const momLatestDateTime = latestDate;
        const momCurrentDateTime = currentDate;
        if (momLatestDateTime > momCurrentDateTime) {
            return true;
        } else {
            return false;
        }
    };

    // useEffect(() => {
    //   if(props.location && props.location.state && props.location.state.tab !== "") {
    //     setSubsActive(props.location && props.location.state && props.location.state.tab);
    //   }
    //   // eslint-disable-next-line
    // }, [props.location.state])

    useEffect(() => {
        if (props?.location?.pathname === "/") {
            setSubsActive("");
            setHoverActive("");
        }
    }, [props.location]);

    useEffect(() => {
        const handleUserKeyPress = (event) => {
            if (event.target.nodeName !== "INPUT") {
                const { keyCode } = event;
                if (keyCode === 191) {
                    const currentEl = focusSearch.current;
                    if (currentEl) {
                        currentEl.focus();
                    }
                }
            }
        };
        window.addEventListener("keydown", handleUserKeyPress);
        return () => {
            window.removeEventListener("keydown", handleUserKeyPress);
        };
    });

    //Subnav starts

    const [active, setActive] = useState(true);
    const [activeTab, setActiveTab] = useState("");
    const [hoverActive, setHoverActive] = useState("");
    const [subsActive, setSubsActive] = useState("");

    const activeHandler = (tab) => {
        setHoverActive(tab);
    };

    const changeActive = (tab) => {
        setActive(true);
        setActiveTab(tab);
    };

    const handleLogin = () => {
        if (token) {
            removeToken();
        }
        // else {
        //   props?.history?.push("/login")
        // }
    };

    const removeToken = () => {
        localStorage.removeItem("token");
        toast.success("Logout Successful!");
        window.location.href = "/";
        setType("");
    };

    const claimsTabs = [
        {
            name: "Create Claim",
            href: "/claims/createclaim",
            current: "createclaim",
            whoCanAccess: "ADMIN",
        },
        {
            name: "Claim Workflow",
            href: "/claims/factoryworkflow",
            current: "factoryworkflow",
            whoCanAccess: "ADMIN",
        },
        {
            name: "Claim History",
            href: "/claims/claimhistory",
            current: "claimhistory",
            whoCanAccess: "ADMIN",
        },
        {
            name: "Conversion Revenue",
            href: "/claims/conversionrevenue",
            current: "conversionrevenue",
            whoCanAccess: "ADMIN",
        },
        {
            name: "Close Period",
            href: "/claims/closeperiod",
            current: "closeperiod",
            whoCanAccess: "ADMIN",
        },
    ];

    const reportingTabs = [
        {
            name: "Manage Bundles",
            href: "/reporting/bundles",
            current: "bundles",
            whoCanAccess: "OTHER",
        },
        {
            name: "Manage Addresses",
            href: "/reporting/addresses",
            current: "addresses",
            whoCanAccess: "OTHER",
        },
        {
            name: "Assign Products",
            href: "/reporting/assignment",
            current: "assignment",
            whoCanAccess: "OTHER",
        },
        {
            name: "Assign Proof Points",
            href: "/reporting/proofpointassignment",
            current: "proofpoint",
            whoCanAccess: "OTHER",
        },
        {
            name: "Prepare Rebates",
            href: "/reporting/prepare",
            current: "prepare",
            whoCanAccess: "OTHER",
        },
    ];

    const profileTabs = [
        {
            name: "Builders",
            href: "/profiles/builders",
            current: "builders",
            whoCanAccess: "OTHER",
        },
        {
            name: "Subcontractor/Distributor/Provider",
            href: "/profiles/subcontractors",
            current: "subcontractors",
            whoCanAccess: "OTHER",
        },
        {
            name: "Admins & Executives",
            href: "/profiles/admin",
            current: "admin",
            whoCanAccess: "ADMIN",
        },
        {
            name: "Manufacturers & Suppliers",
            href: "/profiles/suppliers",
            current: "suppliers",
            whoCanAccess: "ADMIN",
        },
        {
            name: "Territory Managers",
            href: "/profiles/territoryManagers",
            current: "territoryManagers",
            whoCanAccess: "OTHER",
        },
    ];

    const builderProfileTabs = [
        {
            name: type === "BUILDERS" ? "My Profile" : "Builders",
            href:
                type === "BUILDERS"
                    ? {
                        pathname: "/profiles/builders",
                        state: { open: "user" },
                    }
                    : "/profiles/builders",
            current: "builders",
            whoCanAccess: "OTHER",
        },
        {
            name: type === "BUILDERS" ? "My Company" : "Builders",
            href:
                type === "BUILDERS"
                    ? {
                        pathname: "/profiles/builders",
                        state: { open: "about" },
                    }
                    : "/profiles/builders",
            current: "buildersCompany",
            whoCanAccess: "BUILDERS",
        },
        {
            name: "Subcontractor/Distributor/Provider",
            href: "/profiles/subcontractors",
            current: "subcontractors",
            whoCanAccess: "OTHER",
        },
    ];

    const resourcesTabs = [
        {
            name: "Training & Events",
            href: "/resources",
            current: "training",
            whoCanAccess: "OTHER",
        },
    ];

    const programTabs = [
        {
            name: type === "BUILDERS" ? "All Programs" : "All Programs",
            href: "/portal/programs",
            current: "portalPrograms",
            whoCanAccess: "OTHER",
        },
        {
            name:
                type === "BUILDERS"
                    ? "My Programs"
                    : type === "TERRITORY_MANAGER"
                        ? "Builder Programs"
                        : "All Programs",
            href: "/builderprograms",
            current: "builderprograms",
            whoCanAccess: "OTHER",
        },
    ];

    const adminProgramsTabs = [
        {
            name: type === "BUILDERS" ? "My Programs" : "All Programs",
            href: "/portal/programs",
            current: "programs",
            whoCanAccess: "OTHER",
        },
        {
            name: "Manage Programs",
            href: "/programs",
            current: "portalPrograms",
            whoCanAccess: "ADMIN",
        },
    ];

    const ProgramHeaderPartNotForAdmin = () => {
        return (
            <Popover
                className="relative group"
                onMouseEnter={() => changeActive("programs")}
                onMouseLeave={() => setActive(false)}
            >
                {() => (
                    <>
                        <Popover.Button
                            className={` relative font-title bg-white rounded-md inline-flex items-center text-base font-medium group-hover:text-darkGray focus:outline-none  ${hoverActive === "programs"
                                ? "text-darkGray"
                                : "text-secondary"
                                }`}
                        >
                            <span className="pb-1">Programs</span>
                            <span
                                className={`absolute border-b-2 transition-all border-darkGray w-0 group-hover:w-full bottom-0 ${hoverActive === "programs"
                                    ? "w-full border-b-2"
                                    : ""
                                    }`}
                            ></span>
                        </Popover.Button>

                        <Transition
                            show={active && activeTab === "programs"}
                            as={Fragment}
                            enter="transition ease-out duration-200"
                            enterFrom="opacity-0 translate-y-1"
                            enterTo="opacity-100 translate-y-0"
                            leave="transition ease-in duration-150"
                            leaveFrom="opacity-100 translate-y-0"
                            leaveTo="opacity-0 translate-y-1"
                        >
                            <Popover.Panel
                                static
                                className="absolute z-50  mt-1 transform px-2 w-screen  sm:px-0 lg:ml-0 lg:left-1/2 lg:-translate-x-1/2"
                                style={{
                                    maxWidth: "250px",
                                }}
                            >
                                <div className="rounded-lg shadow-2xl ring-1 ring-black ring-opacity-5 overflow-hidden text-lg mx-2">
                                    <div className="relative grid bg-white ">
                                        {programTabs.map((item) => (
                                            <Link
                                                key={item.name}
                                                onClick={() => {
                                                    setSubsActive(item.current);
                                                    activeHandler("programs");
                                                }}
                                                to={item.href}
                                                className={classNames(
                                                    item.current === subsActive
                                                        ? "text-darkGray bg-white border-l-4 border-l-gold  px-5 py-4"
                                                        : " text-white bg-darkGray ",
                                                    "whitespace-nowrap flex px-5 py-4 font-medium text-md"
                                                )}
                                            >
                                                <span
                                                    className={`box py-1 ${item.current ===
                                                        subsActive
                                                        ? "border-b-2 border-darkGray"
                                                        : "subnav-white"
                                                        }`}
                                                >
                                                    {item.name}
                                                </span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </Popover.Panel>
                        </Transition>
                    </>
                )}
            </Popover>
        );
    };

    const programHeaderPartAdmin = () => {
        return (
            <Popover
                className="relative group"
                onMouseEnter={() => changeActive("programs")}
                onMouseLeave={() => setActive(false)}
            >
                {() => (
                    <>
                        <Popover.Button
                            className={` relative font-title bg-white rounded-md inline-flex items-center text-base font-medium group-hover:text-darkGray focus:outline-none  ${hoverActive === "programs"
                                ? "text-darkGray"
                                : "text-secondary"
                                }`}
                        >
                            <span className="pb-1">Programs</span>
                            <span
                                className={`absolute border-b-2 transition-all border-darkGray w-0 group-hover:w-full bottom-0 ${hoverActive === "programs"
                                    ? "w-full border-b-2"
                                    : ""
                                    }`}
                            ></span>
                        </Popover.Button>
                        <Transition
                            show={active && activeTab === "programs"}
                            as={Fragment}
                            enter="transition ease-out duration-200"
                            enterFrom="opacity-0 translate-y-1"
                            enterTo="opacity-100 translate-y-0"
                            leave="transition ease-in duration-150"
                            leaveFrom="opacity-100 translate-y-0"
                            leaveTo="opacity-0 translate-y-1"
                        >
                            <Popover.Panel
                                static
                                className="absolute z-50  mt-1 transform px-2 w-screen  sm:px-0 lg:ml-0 lg:left-1/2 lg:-translate-x-1/2"
                                style={{
                                    maxWidth: "250px",
                                }}
                            >
                                <div className="rounded-lg shadow-2xl ring-1 ring-black ring-opacity-5 overflow-hidden text-lg mx-2">
                                    <div className="relative grid bg-white ">
                                        {adminProgramsTabs.map((item) => (
                                            <Link
                                                key={item.name}
                                                onClick={() => {
                                                    setSubsActive(item.current);
                                                    activeHandler("programs");
                                                }}
                                                to={item.href}
                                                className={classNames(
                                                    item.current === subsActive
                                                        ? "text-darkGray bg-white border-l-4 border-l-gold  px-5 py-4"
                                                        : " text-white bg-darkGray ",
                                                    "whitespace-nowrap flex px-5 py-4 font-medium text-md"
                                                )}
                                            >
                                                <span
                                                    className={`box py-1 ${item.current ===
                                                        subsActive
                                                        ? "border-b-2 border-darkGray"
                                                        : "subnav-white"
                                                        }`}
                                                >
                                                    {item.name}
                                                </span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </Popover.Panel>
                        </Transition>
                    </>
                )}
            </Popover>
        );
    };

    const renderRebates = () => {
        return (
            <Popover
                className="relative group"
                onMouseEnter={() => changeActive("reporting")}
                onMouseLeave={() => setActive(false)}
            >
                {() => (
                    <>
                        <Popover.Button
                            className={` relative font-title bg-white rounded-md inline-flex items-center text-base font-medium group-hover:text-darkGray focus:outline-none  ${hoverActive === "reporting"
                                ? "text-darkGray"
                                : "text-secondary"
                                }`}
                        >
                            <span className="pb-1">Rebates</span>
                            <span
                                className={`absolute border-b-2 transition-all border-darkGray w-0 group-hover:w-full bottom-0 ${hoverActive === "reporting"
                                    ? "w-full border-b-2"
                                    : ""
                                    }`}
                            ></span>
                        </Popover.Button>

                        <Transition
                            show={active && activeTab === "reporting"}
                            as={Fragment}
                            enter="transition ease-out duration-200"
                            enterFrom="opacity-0 translate-y-1"
                            enterTo="opacity-100 translate-y-0"
                            leave="transition ease-in duration-150"
                            leaveFrom="opacity-100 translate-y-0"
                            leaveTo="opacity-0 translate-y-1"
                        >
                            <Popover.Panel
                                static
                                className="absolute z-50  mt-1 transform px-2 w-screen  sm:px-0 lg:ml-0 lg:left-1/2 lg:-translate-x-1/2"
                                style={{
                                    maxWidth: "250px",
                                }}
                            >
                                <div className="rounded-lg shadow-2xl ring-1 ring-black ring-opacity-5 overflow-hidden text-lg mx-2">
                                    <div className="relative grid bg-white ">
                                        {reportingTabs.map(
                                            (
                                                item
                                                // eslint-disable-next-line
                                            ) => {
                                                if (
                                                    (item?.whoCanAccess ===
                                                        whoCanAccess ||
                                                        whoCanAccess ===
                                                        "ADMIN") &&
                                                    (item?.current !==
                                                        "bundles" ||
                                                        type !== "BUILDERS")
                                                ) {
                                                    return (
                                                        <Link
                                                            key={item.name}
                                                            onClick={() => {
                                                                setSubsActive(
                                                                    item.current
                                                                );
                                                                activeHandler(
                                                                    "reporting"
                                                                );
                                                            }}
                                                            to={item.href}
                                                            className={classNames(
                                                                item.current ===
                                                                    subsActive
                                                                    ? "text-darkGray bg-white border-l-4 border-l-gold  px-5 py-4"
                                                                    : " text-white bg-darkGray ",
                                                                "whitespace-nowrap flex px-5 py-4 font-medium text-md"
                                                            )}
                                                        >
                                                            <span
                                                                className={`box py-1 ${item.current ===
                                                                    subsActive
                                                                    ? "border-b-2 border-darkGray"
                                                                    : "subnav-white"
                                                                    }`}
                                                            >
                                                                {item.name}
                                                            </span>
                                                        </Link>
                                                    );
                                                }
                                            }
                                        )}
                                    </div>
                                </div>
                            </Popover.Panel>
                        </Transition>
                    </>
                )}
            </Popover>
        );
    };

    return (
        <div className="mb-5">
            <Popover
                as="header"
                className={({ open }) =>
                    classNames(
                        open ? "fixed inset-0 z-40 overflow-y-auto" : "",
                        "bg-white shadow-sm lg:static lg:overflow-y-visible"
                    )
                }
            >
                {({ open }) => (
                    <>
                        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-32">
                            <div className="relative justify-between items-center flex lg:gap-8 py-4">
                                <div className="flex md:absolute md:left-0 md:inset-y-0 lg:static ">
                                    <div className="flex-shrink-0 flex items-center">
                                        <a href="/">
                                            <img
                                                className="block h-12 w-auto"
                                                src={APP_LOGO}
                                                alt="Workflow"
                                            />
                                        </a>
                                    </div>
                                </div>
                                {token && whoCanAccess && !hideHeader ? (
                                    <div className="">
                                        <nav className=" h-full border-opacity-25">
                                            <div className="max-w-8xl h-full mx-auto ">
                                                <div className="relative h-full flex flex-col items-end justify-center ">
                                                    <div className="flex items-end justify-center ">
                                                        <div className="hidden lg:block ">
                                                            <div className="flex  cursor-pointer">
                                                                <Popover.Group
                                                                    as="nav"
                                                                    className="hidden md:flex space-x-10 text-xl"
                                                                >
                                                                    <Popover
                                                                        className="group relative"
                                                                        onMouseEnter={() =>
                                                                            changeActive(
                                                                                "profile"
                                                                            )
                                                                        }
                                                                        onMouseLeave={() =>
                                                                            setActive(
                                                                                false
                                                                            )
                                                                        }
                                                                    >
                                                                        {() => (
                                                                            <>
                                                                                <Popover.Button
                                                                                    className={` relative font-title bg-white rounded-md inline-flex items-center text-base font-medium group-hover:text-darkGray focus:outline-none  ${hoverActive ===
                                                                                        "profile"
                                                                                        ? "text-darkGray"
                                                                                        : "text-secondary"
                                                                                        }`}
                                                                                >
                                                                                    <span className="pb-1">
                                                                                        Profiles
                                                                                    </span>
                                                                                    <span
                                                                                        className={`absolute border-b-2 transition-all border-darkGray w-0 group-hover:w-full bottom-0 ${hoverActive ===
                                                                                            "profile"
                                                                                            ? "w-full border-b-2"
                                                                                            : ""
                                                                                            }`}
                                                                                    ></span>
                                                                                </Popover.Button>

                                                                                <Transition
                                                                                    show={
                                                                                        active &&
                                                                                        activeTab ===
                                                                                        "profile"
                                                                                    }
                                                                                    as={
                                                                                        Fragment
                                                                                    }
                                                                                    enter="transition ease-out duration-200"
                                                                                    enterFrom="opacity-0 translate-y-1"
                                                                                    enterTo="opacity-100 translate-y-0"
                                                                                    leave="transition ease-in duration-150"
                                                                                    leaveFrom="opacity-100 translate-y-0"
                                                                                    leaveTo="opacity-0 translate-y-1"
                                                                                >
                                                                                    <Popover.Panel
                                                                                        static
                                                                                        className="absolute z-50  mt-1 transform px-2 w-screen  sm:px-0 lg:ml-0 lg:left-1/2 lg:-translate-x-1/2"
                                                                                        style={{
                                                                                            maxWidth:
                                                                                                "350px",
                                                                                        }}
                                                                                    >
                                                                                        <div className="rounded-lg shadow-2xl ring-1 ring-black ring-opacity-5 overflow-hidden text-lg mx-2">
                                                                                            <div className="relative grid bg-white ">
                                                                                                {type ===
                                                                                                    "BUILDERS"
                                                                                                    ? builderProfileTabs.map(
                                                                                                        (
                                                                                                            item
                                                                                                        ) => (
                                                                                                            <Link
                                                                                                                key={
                                                                                                                    item.name
                                                                                                                }
                                                                                                                onClick={() => {
                                                                                                                    setSubsActive(
                                                                                                                        item.current
                                                                                                                    );
                                                                                                                    activeHandler(
                                                                                                                        "profile"
                                                                                                                    );
                                                                                                                }}
                                                                                                                to={
                                                                                                                    item.href
                                                                                                                }
                                                                                                                className={classNames(
                                                                                                                    item.current ===
                                                                                                                        subsActive
                                                                                                                        ? "text-darkGray bg-white border-l-4 border-l-gold  px-5 py-4"
                                                                                                                        : " text-white bg-darkGray ",
                                                                                                                    "whitespace-nowrap flex px-5 py-4 font-medium text-md"
                                                                                                                )}
                                                                                                            >
                                                                                                                <span
                                                                                                                    className={`box py-1 ${item.current ===
                                                                                                                        subsActive
                                                                                                                        ? "border-b-2 border-darkGray"
                                                                                                                        : "subnav-white"
                                                                                                                        }`}
                                                                                                                >
                                                                                                                    {
                                                                                                                        item.name
                                                                                                                    }
                                                                                                                </span>
                                                                                                            </Link>
                                                                                                        )
                                                                                                    )
                                                                                                    : profileTabs.map(
                                                                                                        (
                                                                                                            item
                                                                                                        ) =>
                                                                                                            (item?.whoCanAccess ===
                                                                                                                whoCanAccess ||
                                                                                                                whoCanAccess ===
                                                                                                                "ADMIN") &&
                                                                                                                type !==
                                                                                                                "BUILDERS" ? (
                                                                                                                <Link
                                                                                                                    key={
                                                                                                                        item.name
                                                                                                                    }
                                                                                                                    onClick={() => {
                                                                                                                        setSubsActive(
                                                                                                                            item.current
                                                                                                                        );
                                                                                                                        activeHandler(
                                                                                                                            "profile"
                                                                                                                        );
                                                                                                                    }}
                                                                                                                    to={
                                                                                                                        item.href
                                                                                                                    }
                                                                                                                    className={classNames(
                                                                                                                        item.current ===
                                                                                                                            subsActive
                                                                                                                            ? "text-darkGray bg-white border-l-4 border-l-gold  px-5 py-4"
                                                                                                                            : " text-white bg-darkGray ",
                                                                                                                        "whitespace-nowrap flex px-5 py-4 font-medium text-md"
                                                                                                                    )}
                                                                                                                >
                                                                                                                    <span
                                                                                                                        className={`box py-1 ${item.current ===
                                                                                                                            subsActive
                                                                                                                            ? "border-b-2 border-darkGray"
                                                                                                                            : "subnav-white"
                                                                                                                            }`}
                                                                                                                    >
                                                                                                                        {
                                                                                                                            item.name
                                                                                                                        }
                                                                                                                    </span>
                                                                                                                </Link>
                                                                                                            ) : null
                                                                                                    )}
                                                                                            </div>
                                                                                        </div>
                                                                                    </Popover.Panel>
                                                                                </Transition>
                                                                            </>
                                                                        )}
                                                                    </Popover>
                                                                    {whoCanAccess ===
                                                                        "OTHER" &&
                                                                        type ===
                                                                        "BUILDERS" ? (
                                                                        <Popover
                                                                            className="relative group"
                                                                            onMouseEnter={() =>
                                                                                changeActive(
                                                                                    "bundles"
                                                                                )
                                                                            }
                                                                            onMouseLeave={() =>
                                                                                setActive(
                                                                                    false
                                                                                )
                                                                            }
                                                                        >
                                                                            {() => (
                                                                                <>
                                                                                    <Popover.Button
                                                                                        className={` relative font-title bg-white rounded-md inline-flex items-center text-base font-medium group-hover:text-darkGray focus:outline-none  ${hoverActive ===
                                                                                            "bundles"
                                                                                            ? "text-darkGray"
                                                                                            : "text-secondary"
                                                                                            }`}
                                                                                    >
                                                                                        <Link
                                                                                            to="/reporting/bundles"
                                                                                            className="pb-1"
                                                                                            onClick={() => {
                                                                                                setSubsActive(
                                                                                                    "bundles"
                                                                                                );
                                                                                                activeHandler(
                                                                                                    "bundles"
                                                                                                );
                                                                                            }}
                                                                                        >
                                                                                            Bundles
                                                                                        </Link>
                                                                                        <span
                                                                                            className={`absolute border-b-2 transition-all border-darkGray w-0 group-hover:w-full bottom-0 ${hoverActive ===
                                                                                                "bundles"
                                                                                                ? "w-full border-b-2"
                                                                                                : ""
                                                                                                }`}
                                                                                        ></span>
                                                                                    </Popover.Button>
                                                                                </>
                                                                            )}
                                                                        </Popover>
                                                                    ) : null}
                                                                    {whoCanAccess ===
                                                                        "OTHER" &&
                                                                        (type ===
                                                                            "TERRITORY_MANAGER" ||
                                                                            type ===
                                                                            "BUILDERS")
                                                                        ? renderRebates()
                                                                        : null}

                                                                    {whoCanAccess ===
                                                                        "OTHER" &&
                                                                        (type ===
                                                                            "TERRITORY_MANAGER" ||
                                                                            type ===
                                                                            "BUILDERS")
                                                                        ? ProgramHeaderPartNotForAdmin()
                                                                        : null}
                                                                    {(whoCanAccess ===
                                                                        "ADMIN" ||
                                                                        whoCanAccess ===
                                                                        "OTHER") &&
                                                                        type !==
                                                                        "TERRITORY_MANAGER" &&
                                                                        type !==
                                                                        "BUILDERS"
                                                                        ? programHeaderPartAdmin()
                                                                        : null}

                                                                    {whoCanAccess ===
                                                                        "ADMIN" ? (
                                                                        <Popover
                                                                            className="relative group"
                                                                            onMouseEnter={() =>
                                                                                changeActive(
                                                                                    "claims"
                                                                                )
                                                                            }
                                                                            onMouseLeave={() =>
                                                                                setActive(
                                                                                    false
                                                                                )
                                                                            }
                                                                        >
                                                                            {() => (
                                                                                <>
                                                                                    <Popover.Button
                                                                                        className={` relative font-title bg-white rounded-md inline-flex items-center text-base font-medium group-hover:text-darkGray focus:outline-none  ${hoverActive ===
                                                                                            "claims"
                                                                                            ? "text-darkGray"
                                                                                            : "text-secondary"
                                                                                            }`}
                                                                                    >
                                                                                        <span className="pb-1">
                                                                                            Claims
                                                                                        </span>
                                                                                        <span
                                                                                            className={`absolute border-b-2 transition-all border-darkGray w-0 group-hover:w-full bottom-0 ${hoverActive ===
                                                                                                "claims"
                                                                                                ? "w-full border-b-2"
                                                                                                : ""
                                                                                                }`}
                                                                                        ></span>
                                                                                    </Popover.Button>

                                                                                    <Transition
                                                                                        show={
                                                                                            active &&
                                                                                            activeTab ===
                                                                                            "claims"
                                                                                        }
                                                                                        as={
                                                                                            Fragment
                                                                                        }
                                                                                        enter="transition ease-out duration-200"
                                                                                        enterFrom="opacity-0 translate-y-1"
                                                                                        enterTo="opacity-100 translate-y-0"
                                                                                        leave="transition ease-in duration-150"
                                                                                        leaveFrom="opacity-100 translate-y-0"
                                                                                        leaveTo="opacity-0 translate-y-1"
                                                                                    >
                                                                                        <Popover.Panel
                                                                                            static
                                                                                            className="absolute z-50  mt-1 transform px-2 w-screen  sm:px-0 lg:ml-0 lg:left-1/2 lg:-translate-x-1/2"
                                                                                            style={{
                                                                                                maxWidth:
                                                                                                    "250px",
                                                                                            }}
                                                                                        >
                                                                                            <div className="rounded-lg shadow-2xl ring-1 ring-black ring-opacity-5 overflow-hidden text-lg mx-2">
                                                                                                <div className="relative grid bg-white ">
                                                                                                    {claimsTabs.map(
                                                                                                        (
                                                                                                            item
                                                                                                        ) => (
                                                                                                            <Link
                                                                                                                key={
                                                                                                                    item.name
                                                                                                                }
                                                                                                                onClick={() => {
                                                                                                                    setSubsActive(
                                                                                                                        item.current
                                                                                                                    );
                                                                                                                    activeHandler(
                                                                                                                        "claims"
                                                                                                                    );
                                                                                                                }}
                                                                                                                to={
                                                                                                                    item.href
                                                                                                                }
                                                                                                                className={classNames(
                                                                                                                    item.current ===
                                                                                                                        subsActive
                                                                                                                        ? "text-darkGray bg-white border-l-4 border-l-gold  px-5 py-4"
                                                                                                                        : " text-white bg-darkGray ",
                                                                                                                    "whitespace-nowrap flex px-5 py-4 font-medium text-md"
                                                                                                                )}
                                                                                                            >
                                                                                                                <span
                                                                                                                    className={`box py-1 ${item.current ===
                                                                                                                        subsActive
                                                                                                                        ? "border-b-2 border-darkGray"
                                                                                                                        : "subnav-white"
                                                                                                                        }`}
                                                                                                                >
                                                                                                                    {
                                                                                                                        item.name
                                                                                                                    }
                                                                                                                </span>
                                                                                                            </Link>
                                                                                                        )
                                                                                                    )}
                                                                                                </div>
                                                                                            </div>
                                                                                        </Popover.Panel>
                                                                                    </Transition>
                                                                                </>
                                                                            )}
                                                                        </Popover>
                                                                    ) : null}

                                                                    {(whoCanAccess ===
                                                                        "ADMIN" ||
                                                                        whoCanAccess ===
                                                                        "OTHER") &&
                                                                        type !==
                                                                        "TERRITORY_MANAGER" &&
                                                                        type !==
                                                                        "BUILDERS"
                                                                        ? renderRebates()
                                                                        : null}

                                                                    <Popover
                                                                        className="relative group"
                                                                        onMouseEnter={() =>
                                                                            changeActive(
                                                                                "resources"
                                                                            )
                                                                        }
                                                                        onMouseLeave={() =>
                                                                            setActive(
                                                                                false
                                                                            )
                                                                        }
                                                                    >
                                                                        {() => (
                                                                            <>
                                                                                <Popover.Button
                                                                                    className={` relative font-title bg-white rounded-md inline-flex items-center text-base font-medium group-hover:text-darkGray focus:outline-none  ${hoverActive ===
                                                                                        "resources"
                                                                                        ? "text-darkGray"
                                                                                        : "text-secondary"
                                                                                        }`}
                                                                                >
                                                                                    <span className="pb-1">
                                                                                        Resources
                                                                                    </span>
                                                                                    <span
                                                                                        className={`absolute border-b-2 transition-all border-darkGray w-0 group-hover:w-full bottom-0 ${hoverActive ===
                                                                                            "resources"
                                                                                            ? "w-full border-b-2"
                                                                                            : ""
                                                                                            }`}
                                                                                    ></span>
                                                                                </Popover.Button>

                                                                                <Transition
                                                                                    show={
                                                                                        active &&
                                                                                        activeTab ===
                                                                                        "resources"
                                                                                    }
                                                                                    as={
                                                                                        Fragment
                                                                                    }
                                                                                    enter="transition ease-out duration-200"
                                                                                    enterFrom="opacity-0 translate-y-1"
                                                                                    enterTo="opacity-100 translate-y-0"
                                                                                    leave="transition ease-in duration-150"
                                                                                    leaveFrom="opacity-100 translate-y-0"
                                                                                    leaveTo="opacity-0 translate-y-1"
                                                                                >
                                                                                    <Popover.Panel
                                                                                        static
                                                                                        className="absolute z-50  mt-1 transform px-2 w-screen  sm:px-0 lg:ml-0 lg:left-1/2 lg:-translate-x-1/2"
                                                                                        style={{
                                                                                            maxWidth:
                                                                                                "250px",
                                                                                        }}
                                                                                    >
                                                                                        <div className="rounded-lg shadow-2xl ring-1 ring-black ring-opacity-5 overflow-hidden text-lg mx-2">
                                                                                            <div className="relative grid bg-white ">
                                                                                                {resourcesTabs.map(
                                                                                                    (
                                                                                                        item
                                                                                                    ) =>
                                                                                                        item?.whoCanAccess ===
                                                                                                            whoCanAccess ||
                                                                                                            whoCanAccess ===
                                                                                                            "ADMIN" ||
                                                                                                            whoCanAccess ===
                                                                                                            "OTHER" ? (
                                                                                                            <Link
                                                                                                                key={
                                                                                                                    item.name
                                                                                                                }
                                                                                                                onClick={() => {
                                                                                                                    setSubsActive(
                                                                                                                        item.current
                                                                                                                    );
                                                                                                                    activeHandler(
                                                                                                                        "resources"
                                                                                                                    );
                                                                                                                }}
                                                                                                                to={
                                                                                                                    item.href
                                                                                                                }
                                                                                                                className={classNames(
                                                                                                                    item.current ===
                                                                                                                        subsActive
                                                                                                                        ? "text-darkGray bg-white border-l-4 border-l-gold  px-5 py-4"
                                                                                                                        : " text-white bg-darkGray ",
                                                                                                                    "whitespace-nowrap flex px-5 py-4 font-medium text-md"
                                                                                                                )}
                                                                                                            >
                                                                                                                <span
                                                                                                                    className={`box py-1 ${item.current ===
                                                                                                                        subsActive
                                                                                                                        ? "border-b-2 border-darkGray"
                                                                                                                        : "subnav-white"
                                                                                                                        }`}
                                                                                                                >
                                                                                                                    {
                                                                                                                        item.name
                                                                                                                    }
                                                                                                                </span>
                                                                                                            </Link>
                                                                                                        ) : null
                                                                                                )}
                                                                                            </div>
                                                                                        </div>
                                                                                    </Popover.Panel>
                                                                                </Transition>
                                                                            </>
                                                                        )}
                                                                    </Popover>
                                                                    <Popover
                                                                        className="relative group"
                                                                        onMouseEnter={() =>
                                                                            changeActive(
                                                                                "analytics"
                                                                            )
                                                                        }
                                                                        onMouseLeave={() =>
                                                                            setActive(
                                                                                false
                                                                            )
                                                                        }
                                                                    >
                                                                        {() => (
                                                                            <>
                                                                                <Popover.Button
                                                                                    className={` relative font-title bg-white rounded-md inline-flex items-center text-base font-medium group-hover:text-darkGray focus:outline-none  ${hoverActive ===
                                                                                        "analytics"
                                                                                        ? "text-darkGray"
                                                                                        : "text-secondary"
                                                                                        }`}
                                                                                >
                                                                                    <Link
                                                                                        to="/reporting"
                                                                                        className="pb-1 hidden"
                                                                                        onClick={() => {
                                                                                            setSubsActive(
                                                                                                "analytics"
                                                                                            );
                                                                                            activeHandler(
                                                                                                "analytics"
                                                                                            );
                                                                                        }}
                                                                                    >
                                                                                        Reports
                                                                                    </Link>
                                                                                    <span
                                                                                        className={`absolute border-b-2 transition-all border-darkGray w-0 group-hover:w-full bottom-0 ${hoverActive ===
                                                                                            "analytics"
                                                                                            ? "w-full border-b-2"
                                                                                            : ""
                                                                                            }`}
                                                                                    ></span>
                                                                                </Popover.Button>
                                                                            </>
                                                                        )}
                                                                    </Popover>
                                                                </Popover.Group>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </nav>
                                    </div>
                                ) : token ? (
                                    !hideHeader ? (
                                        <Loader />
                                    ) : null
                                ) : null}

                                {!hideHeader ? (
                                    <div className="hidden lg:flex lg:items-center lg:justify-end px-4">
                                        <UserHeader
                                            token={token}
                                            handleLogin={handleLogin}
                                        />
                                    </div>
                                ) : null}
                            </div>
                        </div>

                        <Popover.Panel
                            as="nav"
                            className="lg:hidden"
                            aria-label="Global"
                        >
                            <div className="border-t border-gray-200 pt-4 pb-3">
                                <div className="mt-3 max-w-3xl mx-auto px-2 space-y-1 sm:px-4">
                                    {userNavigation.map((item) => (
                                        <a
                                            key={item.name}
                                            href={item.href}
                                            className="block rounded-md py-2 px-3 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                                        >
                                            {item.name}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </Popover.Panel>
                    </>
                )}
            </Popover>
        </div>
    );
};

export default Header1;
