import React, { useState, useEffect, useContext } from "react";
import TextField from "../../FormGroups/Input";
import { useMutation, useQuery, useLazyQuery } from "@apollo/client";
import { Disclosure, Transition } from "@headlessui/react";
import { toast } from "react-toastify";
import Button from "../../Buttons";
import CommonSelect from "../../Select";
import { FETCH_STATES_QUERY } from "../../../lib/common";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/solid";
import Loader from "../../Loader/Loader";
import { APP_TITLE } from "../../../util/constants";

import {
    GET_BUILDERS,
    CREATE_BUILDER,
    GET_TERRITORY_MANAGERS,
    UPDATE_BUILDER_MEMBERSHIP,
    GET_BUILDER_PROGRAMS,
    GET_BUILDER_USERS
} from "../../../lib/builders";
import UsersBuilders from "./UsersBuilders";
import ProgramBuilders from "./ProgramBuilders";
import { InputDecimal } from "../../InputDecimal/InputDecimal"
import { AuthContext } from "../../../contexts/auth";

const CreateBuilder = ({
    archieved,
    edit,
    user,
    fillColumns,
    callBack,
    openWhat,
    openAbout,
    searchString,
    resetState,
    refetch,
    loading,
    setUser
}) => {
    /* React State Starts */
    const [fields, setFields] = useState(user);
    const [active, setActive] = useState("about");
    const [show, setShow] = useState(false);
    const [state, setState] = useState([]);
    const [allowedStates, setAllowedStates] = useState([]);
    const [memberShipTier, setMemberShipTier] = useState();
    const [stateError, setStateError] = useState();
    const [tmError, setTmError] = useState();
    const [allowedStateError, setAllowedStateError] = useState();
    const [tm, setTm] = useState([]);

    const { data: states } = useQuery(FETCH_STATES_QUERY);
    const { data: territoryManagers } = useQuery(GET_TERRITORY_MANAGERS);

    const [getBuilderPrograms, { data: builderProgramData, loading: getBuilderProgramsLoading }] = useLazyQuery(
        GET_BUILDER_PROGRAMS,
        {
            notifyOnNetworkStatusChange: false,
            variables: {
                id: user?.id,
            },
            onCompleted() {
                const organizationPrograms = { ...user, ...builderProgramData?.organization }
                setUser(organizationPrograms)
            },
            fetchPolicy: "network-only",
            nextFetchPolicy: "network-only",
        }
    );

    const [getBuilderUser, { data: builderUserData, loading: getBuilderUserLoading }] = useLazyQuery(
        GET_BUILDER_USERS,
        {
            notifyOnNetworkStatusChange: false,
            variables: {
                id: user?.id,
            },
            onCompleted() {
                const organizationUsers = { ...user, ...builderUserData?.organization }
                setUser(organizationUsers)
            },
            fetchPolicy: "network-only",
            nextFetchPolicy: "network-only",
        }
    );


    const { type, organizationNode } = useContext(AuthContext);


    const handleTerritoryManagersForSelect = (items) => {
        let objectToSend = {};

        let values = items?.map((item) => {
            let parentObject = {};
            let object = {};
            object.name = item?.node?.fullName;
            object.id = item?.node?.id;
            parentObject.node = object;
            return parentObject;
        });

        objectToSend.edges = values;
        return objectToSend;
    };

    const MEMBER_TIERS = {
        edges: [
            { node: { name: "None", id: "NONE" } },
            { node: { name: "Tier 1", id: "Tier_1" } },
            { node: { name: "Tier 2", id: "Tier_2" } },
            { node: { name: "Tier 3", id: "Tier_3" } },
            { node: { name: "Founder", id: "FOUNDER" } },
        ],
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFields({
            ...fields,
            [name]: value,
        });
    };

    function capitalizeFirstLetter(string) {
        return string?.charAt(0)?.toUpperCase() + string?.slice(1);
    }

    function removeUnderscore(string) {
        return string?.replace("_", " ")
    }

    const stateshandler = (e) => {
        const values = {
            value: e?.value,
            label: e?.label,
        };
        setState(values);
    };

    useEffect(() => {
        if (!state?.value) {
            setStateError(true)
        }
        else {
            setStateError(false)
        }
    }, [state])

    const setMemberTierHandler = (e) => {
        const values = {
            value: e?.value,
            label: e?.label,
        };
        setMemberShipTier(values);
    };

    useEffect(() => {
        if (!tm?.value) {
            setTmError(true)
        }
        else {
            setTmError(false)
        }
    }, [tm])

    const TMHandler = (e) => {
        const values = {
            value: e?.value,
            label: e?.label,
        };
        setTm(values);
    };

    const allowedStatesHandler = (e) => {
        const values = e.map((item) => {
            let object = {};
            object.value = item?.value;
            object.label = item?.label;

            return object;
        });
        setAllowedStates(values);
    };

    useEffect(() => {
        if (allowedStates?.length === 0) {
            setAllowedStateError(true)
        }
        else {
            setAllowedStateError(false)
        }
    }, [allowedStates])



    const activeHandler = (item) => {
        if (item !== active) {
            setActive(item);
            setShow(true);
        } else {
            resetState();
            setShow(!show);
        }
    };

    useEffect(() => {
        if (openWhat) {
            setActive(openWhat)
            setShow(true)
        }
    }, [openWhat])

    /* Handle Changes Ends */

    useEffect(() => {

        //This Use-Effect fills the Data
        if (edit === true) {
            setFields({
                ...user,
                annual_dues: user?.thisYearsDue?.annual_dues,
                prorated_amount: user?.thisYearsDue?.prorated_amount,
            });
            setState({
                value: user?.state?.id,
                label: user?.state?.name,
            });
            setTm({
                value: user?.territoryManagers?.edges[0]?.node?.id,
                label: user?.territoryManagers?.edges[0]?.node?.fullName,
            });
            let states = user?.approved_states?.edges?.map((item) => {
                let object = {};
                object.value = item?.node?.id;
                object.label = item?.node?.name;

                return object;
            });
            setMemberShipTier({
                value: user?.member_tier,
                label: capitalizeFirstLetter(removeUnderscore(user?.member_tier?.toLowerCase())),
            });
            setAllowedStates(states);
        }
        //eslint-disable-next-line
    }, [user, edit]);


    useEffect(() => {
        if (edit === false) {
            setFields({
                name: searchString === "" ? "" : searchString,
            });
            setState({})
        }
        // eslint-disable-next-line
    }, [searchString]);

    useEffect(() => {
        //fills the data inside the column
        if (openAbout === true && show === false) {
            setActive("about");
            setShow(true);
        }

        // eslint-disable-next-line
    }, [fillColumns, openAbout]);

    useEffect(() => {
        if (searchString?.length > 0 && edit === false) {
            setActive("about");
            setShow(true);
        }
        // eslint-disable-next-line
    }, [searchString, edit]);

    const [createOrganization, { loading: createBuilderLoading }] = useMutation(
        CREATE_BUILDER,
        {
            variables: {
                organization_type: "BUILDERS",
                name: fields?.name,
                abbreviation: fields?.abbreviation,
                code: fields?.code,
                state_id: parseInt(state?.value),
                city: fields?.city,
                address: fields?.address,
                address2: fields?.address2,
                zip_postal: fields?.zip_postal,
                territoryManagers: type === "TERRITORY_MANAGER" ? [organizationNode?.id] : [],
            },
            update(cache, result) {
                const data = cache.readQuery({
                    query: GET_BUILDERS,
                });

                delete Object.assign(result.data, {
                    node: result.data["createOrganization"],
                })["createOrganization"];

                cache.writeQuery({
                    query: GET_BUILDERS,
                    data: {
                        organizations: {
                            edges: [result.data, ...data.organizations.edges],
                        },
                    },
                });
                callBack(result?.data?.node);
                toast.success("Builder saved!");
                setActive("assignments");
            },
        }
    );

    const handleDuesObjectCreation = () => {
        let object = {};
        let insideObject = {};
        if (user?.thisYearsDue !== null) {
            insideObject.annual_dues = parseFloat(fields?.annual_dues);
            insideObject.prorated_amount = parseFloat(fields?.prorated_amount);
            insideObject.year = parseInt(new Date().getFullYear());
            insideObject.id = user?.thisYearsDue?.id;
            object.update = [insideObject];
        } else {
            insideObject.annual_dues = parseFloat(fields?.annual_dues);
            insideObject.prorated_amount = parseFloat(fields?.prorated_amount);
            insideObject.year = parseInt(new Date().getFullYear());
            object.create = [insideObject];
        }
        return object;
    };

    const [updateOrganization, { loading: updateBuilderLoading }] = useMutation(
        UPDATE_BUILDER_MEMBERSHIP,
        {
            variables: {
                organization_type: "BUILDERS",
                id: fields?.id,
                name: fields?.name,
                abbreviation: fields?.abbreviation,
                code: fields?.code,
                state_id: parseInt(state?.value),
                city: fields?.city,
                previousEarnedToDate: parseFloat(fields?.previousEarnedToDate),
                address: fields?.address,
                address2: fields?.address2,
                zip_postal: fields?.zip_postal,
                territoryManagers: tm?.value ? [tm?.value] : [],
                approved_states: allowedStates?.map((item) =>
                    parseInt(item?.value)
                ),
                member_tier: memberShipTier?.value,
                dues: handleDuesObjectCreation(),
            },
            update(cache, result) {
                const data = cache.readQuery({
                    query: GET_BUILDERS,
                });

                delete Object.assign(result.data, {
                    node: result.data["updateOrganization"],
                })["updateOrganization"];

                cache.writeQuery({
                    query: GET_BUILDERS,
                    data: {
                        organizations: {
                            edges: [
                                result.data,
                                ...data.organizations.edges.filter(
                                    (u) => u.node.id !== result?.data?.node?.id
                                ),
                            ],
                        },
                    },
                });
                toast.success("Builder saved!");
                callBack(result?.data?.node);
            },
        }
    );

    const renderAbout = () => {
        return (
            <div
                className="grid bg-white  rounded-lg rounded-t-none grid-cols-6 overflow-hidden "
                style={{ minHeight: "50vmin" }}
            >
                {loading ? (
                    <div className="col-span-6 flex items-center justify-center">
                        <Loader />
                    </div>
                ) : (
                    <div className="col-span-6 inset-0 flex flex-col">
                        <div className="flex  w-full  scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400 ">
                            <div className="w-full scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400">
                                <div className="grid grid-cols-6 col-span-6 2xl:col-span-4">
                                    <TextField
                                        flex
                                        parentClass="col-span-6 sm:col-span-6 border-b py-3"
                                        id="name"
                                        label="Company Name"
                                        onChange={handleChange}
                                        value={fields?.name ? fields?.name : ""}
                                        name="name"
                                        placeholder="Company Name"
                                        type="text"
                                        disabled={archieved}
                                    />
                                    <TextField
                                        flex
                                        parentClass="col-span-6 sm:col-span-6 border-b py-3"
                                        id="abbreviation"
                                        label="Abbreviated Name"
                                        onChange={handleChange}
                                        value={
                                            fields?.abbreviation ? fields?.abbreviation : ""
                                        }
                                        name="abbreviation"
                                        placeholder="Abbreviated Name"
                                        type="text"
                                        disabled={
                                            type !== "ADMIN"
                                        }
                                    />
                                    <TextField
                                        flex
                                        parentClass="col-span-6 sm:col-span-6 border-b py-3"
                                        id="code"
                                        label={APP_TITLE + " Code"}
                                        onChange={handleChange}
                                        value={fields?.code ? fields?.code : ""}
                                        disabled={
                                            type !== "ADMIN"
                                        }
                                        name="code"
                                        placeholder={APP_TITLE + " Code"}
                                        type="text"
                                        width="w-28"
                                    />
                                    <div className="border-b col-span-6 px-4   sm:grid sm:grid-cols-3 gap-5 items-start justify-between sm:items-center w-full ">
                                        <TextField
                                            width="w-full"
                                            label="Address"
                                            onChange={
                                                handleChange
                                            }
                                            parentClass="sm:grid sm:grid-cols-2 items-center col-span-2 py-3 "
                                            inputClass="ml-1"
                                            id="address"
                                            value={fields?.address ? fields?.address : ""}
                                            name="address"
                                            placeholder="Address Line 1"
                                            type="text"
                                            disabled={archieved}
                                        />
                                        <TextField
                                            width="w-full"
                                            onChange={
                                                handleChange
                                            }
                                            value={fields?.address2 ? fields?.address2 : ""}
                                            parentClass="grid mt-2 sm:mt-0 grid-cols-1 col-span-1 items-center py-3 "
                                            id="address2"
                                            name="address2"
                                            placeholder="Unit 123"
                                            disabled={archieved}
                                            type="text"
                                        />
                                    </div>
                                    <TextField
                                        flex
                                        width="w-full"
                                        label="City"
                                        onChange={handleChange}
                                        parentClass="col-span-6 sm:col-span-6 border-b py-3"
                                        id="city"
                                        value={fields?.city ? fields?.city : ""}
                                        name="city"
                                        placeholder="City"
                                        type="text"
                                        disabled={archieved}
                                    />
                                    <div className="border-b col-span-6 px-4   sm:grid sm:grid-cols-3 items-start justify-between py-3 sm:items-center w-full ">
                                        <div className="sm:grid sm:grid-cols-3 col-span-3 items-center">
                                            <label className="block text-md font-medium text-secondary">
                                                State/Province
                                            </label>
                                            <div className="flex items-center">
                                                <CommonSelect
                                                    error={
                                                        stateError
                                                    }
                                                    value={{
                                                        label:
                                                            state?.label,
                                                        value:
                                                            state?.value,
                                                    }}
                                                    edit={edit}
                                                    options={
                                                        states &&
                                                        states.states
                                                    }
                                                    className=" w-72"
                                                    placeHolder="State"
                                                    menuPlacement={
                                                        "top"
                                                    }
                                                    onChange={(
                                                        e
                                                    ) =>
                                                        stateshandler(
                                                            e
                                                        )
                                                    }
                                                />
                                                {stateError ? (
                                                    <p className="self-end ml-1  text-xs text-brickRed font-medium">
                                                        Select a
                                                        state
                                                    </p>
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>
                                    <TextField
                                        flex
                                        width="w-32"
                                        parentClass="col-span-4 sm:col-span-6 border-b py-3"
                                        onChange={handleChange}
                                        value={
                                            fields?.zip_postal ? fields?.zip_postal : ""
                                        }
                                        id="zip_postal"
                                        label="Zip / Postal"
                                        name="zip_postal"
                                        placeholder="90210"
                                        disabled={archieved}
                                        type="text"
                                    />
                                </div>
                            </div>
                        </div>

                        {fillColumns ? (
                            <div className="py-2 pr-5 flex flex-col items-end justify-end  border-gray-400">
                                <Button
                                    disabled={stateError}
                                    color="primary"
                                    title={
                                        edit
                                            ? updateBuilderLoading
                                                ? "Saving Updates"
                                                : "Save Updates"
                                            : createBuilderLoading
                                                ? "Saving"
                                                : "Save"
                                    }
                                    onClick={
                                        edit === true
                                            ? updateOrganization
                                            : createOrganization
                                    }
                                />
                            </div>
                        ) : null}
                    </div>
                )}
            </div>
        )
    }

    const accordians = () => {
        return fillColumns ? (
            <div className="flex flex-col">
                <Disclosure as="div">
                    <Disclosure.Button
                        className={`bg-white w-full  focus:outline-none ${active === "about" && show
                            ? "rounded-lg rounded-b-none"
                            : "rounded-lg"
                            }`}
                    >
                        <div
                            style={{ maxHeight: "68px" }}
                            className={`flex flex-col md:flex-row py-4 px-4 justify-between items-center ${active === "about" && show
                                ? "border-b-2 border-gray-400"
                                : ""
                                }`}
                            onClick={() => activeHandler("about")}
                        >
                            <div className=" font-title  text-center h2">
                                {fields && fields.name
                                    ? "About: " + fields.name
                                    : "About"}
                            </div>

                            {active === "about" && show ? (
                                <ChevronUpIcon className="h-10 w-10 text-secondary" />
                            ) : (
                                <ChevronDownIcon className="h-10 w-10 text-secondary" />
                            )}
                        </div>
                    </Disclosure.Button>
                    <Transition
                        show={active === "about" && show}
                        enter="transition duration-100 ease-out"
                        enterFrom="transform scale-95 opacity-0"
                        enterTo="transform scale-100 opacity-100"
                        leave="transition duration-150 ease-out"
                        leaveFrom="transform scale-100 opacity-100"
                        leaveTo="transform scale-95 opacity-0"
                    >
                        <Disclosure.Panel static>
                            {renderAbout()}
                        </Disclosure.Panel>
                    </Transition>
                </Disclosure>
                {edit === true && type === "ADMIN" ? (
                    <Disclosure as="div" className="mt-5">
                        <Disclosure.Button
                            className={`bg-white w-full  focus:outline-none ${active === "assignments" && show
                                ? "rounded-lg rounded-b-none"
                                : "rounded-lg"
                                }`}
                        >
                            <div
                                style={{ maxHeight: "68px" }}
                                className={`flex flex-col md:flex-row py-4 px-4 justify-between items-center ${active === "assignments" && show
                                    ? "border-b-2 border-gray-400"
                                    : ""
                                    }`}
                                onClick={() => activeHandler("assignments")}
                            >
                                <div className=" font-title  text-center h2">
                                    {active === "assignments" && show
                                        ? "Membership: " + fields?.name
                                        : "Membership"}
                                </div>
                                {active === "assignments" && show ? (
                                    <ChevronUpIcon className="h-10 w-10 text-secondary" />
                                ) : (
                                    <ChevronDownIcon className="h-10 w-10 text-secondary" />
                                )}
                            </div>
                        </Disclosure.Button>
                        <Transition
                            show={active === "assignments" && show}
                            enter="transition duration-100 ease-out"
                            enterFrom="transform scale-95 opacity-0"
                            enterTo="transform scale-100 opacity-100"
                            leave="transition duration-150 ease-out"
                            leaveFrom="transform scale-100 opacity-100"
                            leaveTo="transform scale-95 opacity-0"
                        >
                            <Disclosure.Panel static>
                                <div className="grid bg-white  rounded-lg rounded-t-none grid-cols-6 overflow-hidden">
                                    {loading ? (
                                        <div className="col-span-6 flex items-center justify-center">
                                            <Loader />
                                        </div>
                                    ) : (
                                        <div className="col-span-6 inset-0 flex flex-col">
                                            <div className="flex  w-full  scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400 ">
                                                <div className="w-full scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400">
                                                    <div className="grid grid-cols-3 col-span-6 2xl:col-span-4">
                                                        <div className="border-r col-span-2">
                                                            <p className="font-title py-2 px-4 col-span-1 text-secondary font-bold text-md ">
                                                                {APP_TITLE} Assignments
                                                            </p>
                                                            <div className="border-b col-span-1 px-4   sm:grid sm:grid-cols-2 items-start justify-between py-3 sm:items-center w-full ">
                                                                <div className="sm:grid sm:grid-cols-2 col-span-2 items-start">
                                                                    <label className="block text-md font-medium text-secondary mt-2">
                                                                        Territory
                                                                        Manager
                                                                    </label>
                                                                    <div className="flex flex-col">
                                                                        <CommonSelect
                                                                            error={
                                                                                tmError
                                                                            }
                                                                            value={
                                                                                tm
                                                                            }
                                                                            edit={
                                                                                edit
                                                                            }
                                                                            options={handleTerritoryManagersForSelect(
                                                                                territoryManagers
                                                                                    ?.users
                                                                                    ?.edges
                                                                            )}
                                                                            from="territory"
                                                                            placeHolder="Territory Manager"
                                                                            menuPlacement={
                                                                                "bottom"
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                TMHandler(
                                                                                    e
                                                                                )
                                                                            }
                                                                        />
                                                                        {tmError ? (
                                                                            <p className="self-end ml-1  text-xs text-brickRed font-medium">
                                                                                Territory
                                                                                Manager
                                                                                is
                                                                                required
                                                                            </p>
                                                                        ) : null}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="border-b col-span-1 px-4   sm:grid sm:grid-cols-2 items-start justify-between py-3 sm:items-center w-full ">
                                                                <div className="sm:grid sm:grid-cols-2 col-span-2 items-start">
                                                                    <label className="block text-md font-medium text-secondary mt-2">
                                                                        Builder
                                                                        Operating
                                                                        State(s)
                                                                    </label>
                                                                    <div className="flex flex-col">
                                                                        <CommonSelect
                                                                            error={
                                                                                allowedStateError
                                                                            }
                                                                            value={
                                                                                allowedStates
                                                                            }
                                                                            edit={
                                                                                edit
                                                                            }
                                                                            options={
                                                                                states &&
                                                                                states.states
                                                                            }
                                                                            isMulti
                                                                            placeHolder="State"
                                                                            menuPlacement={
                                                                                "bottom"
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                allowedStatesHandler(
                                                                                    e
                                                                                )
                                                                            }
                                                                        />
                                                                        {allowedStateError ? (
                                                                            <p className="self-end ml-1  text-xs text-brickRed font-medium">
                                                                                Allowed
                                                                                state
                                                                                selection
                                                                                is
                                                                                required
                                                                            </p>
                                                                        ) : null}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="border-b col-span-1 px-4   sm:grid sm:grid-cols-2 items-start justify-between py-3 sm:items-center w-full ">
                                                                <div className="sm:grid sm:grid-cols-2 col-span-2 items-start">
                                                                    <label className="block text-md font-medium text-secondary mt-2">
                                                                        Original Earned to date - Total
                                                                    </label>
                                                                    <div className="relative">
                                                                        <InputDecimal
                                                                            className="w-32 block input-no-error focus:outline-none pl-4 shadow-sm sm:text-sm rounded-md"
                                                                            onChangeFunction={
                                                                                handleChange
                                                                            }
                                                                            value={
                                                                                typeof fields?.previousEarnedToDate ===
                                                                                    "number"
                                                                                    ? fields?.previousEarnedToDate?.toFixed(2)
                                                                                    : fields?.previousEarnedToDate
                                                                            }
                                                                            id="previousEarnedToDate"
                                                                            label="Original Earned to date - Total"
                                                                            name="previousEarnedToDate"
                                                                            placeholder="3000.00"
                                                                            disabled={
                                                                                archieved
                                                                            }
                                                                        />
                                                                        <span
                                                                            className="absolute inset-y-0 left-0 bottom-1 pl-2 flex items-center text-sm text-secondary pointer-events-none"
                                                                            style={{ paddingTop: "3px" }}
                                                                        >
                                                                            $
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="">
                                                            <p className="font-title py-2 px-4 col-span-1 text-secondary font-bold text-md ">
                                                                Members
                                                            </p>
                                                            <div className="border-b col-span-1 px-4   sm:grid sm:grid-cols-2 items-start justify-between py-3 sm:items-center w-full ">
                                                                <div className="sm:grid sm:grid-cols-2 col-span-2 items-center">
                                                                    <label className="block text-md font-medium text-secondary">
                                                                        Member
                                                                        Tier
                                                                    </label>
                                                                    <CommonSelect
                                                                        value={
                                                                            memberShipTier
                                                                        }
                                                                        edit={
                                                                            edit
                                                                        }
                                                                        options={
                                                                            MEMBER_TIERS
                                                                        }
                                                                        className="w-44"
                                                                        placeHolder="Member Tier"
                                                                        menuPlacement={
                                                                            "bottom"
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            setMemberTierHandler(
                                                                                e
                                                                            )
                                                                        }
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="border-b col-span-1 px-4   sm:grid sm:grid-cols-2 items-start justify-between py-3 sm:items-center w-full ">
                                                                <div className="sm:grid sm:grid-cols-2 col-span-2 items-start">
                                                                    <label className="block text-md font-medium text-secondary mt-2">
                                                                        Annual Dues
                                                                    </label>
                                                                    <div className="relative">
                                                                        <InputDecimal
                                                                            className="w-32 block input-no-error focus:outline-none pl-4 shadow-sm sm:text-sm rounded-md"
                                                                            onChangeFunction={
                                                                                handleChange
                                                                            }
                                                                            value={
                                                                                typeof fields?.annual_dues ===
                                                                                    "number"
                                                                                    ? fields?.annual_dues?.toFixed(2)
                                                                                    : fields?.annual_dues
                                                                            }
                                                                            id="annual_dues"
                                                                            name="annual_dues"
                                                                            placeholder="200.00"
                                                                            disabled={
                                                                                archieved
                                                                            }
                                                                        />
                                                                        <span
                                                                            className="absolute inset-y-0 left-0 bottom-1 pl-2 flex items-center text-sm text-secondary pointer-events-none"
                                                                            style={{ paddingTop: "3px" }}
                                                                        >
                                                                            $
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="border-b col-span-1 px-4   sm:grid sm:grid-cols-2 items-start justify-between py-3 sm:items-center w-full ">
                                                                <div className="sm:grid sm:grid-cols-2 col-span-2 items-start">

                                                                    <label className="block text-md font-medium text-secondary mt-2">
                                                                        Pro-Rated for this Year
                                                                    </label>
                                                                    <div className="relative">
                                                                        <InputDecimal
                                                                            className="w-32 block input-no-error focus:outline-none pl-4 shadow-sm sm:text-sm rounded-md"
                                                                            onChangeFunction={
                                                                                handleChange
                                                                            }
                                                                            value={
                                                                                typeof fields?.prorated_amount ===
                                                                                    "number"
                                                                                    ? fields?.prorated_amount?.toFixed(2)
                                                                                    : fields?.prorated_amount
                                                                            }
                                                                            id="prorated_amount"
                                                                            name="prorated_amount"
                                                                            placeholder="3000.00"
                                                                            disabled={
                                                                                archieved
                                                                            }
                                                                        />
                                                                        <span
                                                                            className="absolute inset-y-0 left-0 bottom-1 pl-2 flex items-center text-sm text-secondary pointer-events-none"
                                                                            style={{ paddingTop: "3px" }}
                                                                        >
                                                                            $
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {fillColumns ? (
                                                <div className="py-2 pr-5 flex flex-col items-end justify-end border-t">
                                                    <Button
                                                        disabled={
                                                            tmError ||
                                                            allowedStateError
                                                        }
                                                        color="primary"
                                                        title={
                                                            edit
                                                                ? "Save Updates"
                                                                : "Save"
                                                        }
                                                        onClick={
                                                            edit === true
                                                                ? () => {
                                                                    updateOrganization();
                                                                    setActive(
                                                                        "products"
                                                                    );
                                                                }
                                                                : createOrganization
                                                        }
                                                    />
                                                </div>
                                            ) : null}
                                        </div>
                                    )}
                                </div>
                            </Disclosure.Panel>
                        </Transition>
                    </Disclosure>
                ) : null}
                {edit === true && type === "ADMIN" ? (
                    <Disclosure as="div" className="mt-5">
                        <Disclosure.Button
                            className={`bg-white w-full  focus:outline-none ${active === "programs" && show
                                ? "rounded-lg rounded-b-none"
                                : "rounded-lg"
                                }`}
                        >
                            <div
                                style={{ maxHeight: "68px" }}
                                className={`flex flex-col px-4 md:flex-row justify-between items-center ${active === "programs" && show
                                    ? "border-b-2 border-gray-400"
                                    : ""
                                    }`}
                                onClick={() => {
                                    activeHandler("programs")
                                    getBuilderPrograms()
                                }}
                            >
                                <div className=" font-title py-4  text-center h2">
                                    {active === "programs" && show
                                        ? "Programs: " + fields?.name
                                        : "Programs"}
                                </div>
                                {active === "programs" && show ? (
                                    <ChevronUpIcon className="h-10 w-10 text-secondary" />
                                ) : (
                                    <ChevronDownIcon className="h-10 w-10 text-secondary" />
                                )}
                            </div>
                        </Disclosure.Button>
                        <Transition
                            show={active === "programs" && show}
                            enter="transition duration-100 ease-out"
                            enterFrom="transform scale-95 opacity-0"
                            enterTo="transform scale-100 opacity-100"
                            leave="transition duration-150 ease-out"
                            leaveFrom="transform scale-100 opacity-100"
                            leaveTo="transform scale-95 opacity-0"
                        >
                            <Disclosure.Panel static>
                                <div className="grid bg-white  rounded-lg rounded-t-none grid-cols-6 overflow-hidden ">
                                    <div className="col-span-6 inset-0 flex flex-col">
                                        <div className="flex  w-full  scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400 ">
                                            <div className="w-full scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400">
                                                <div className="">
                                                    <div className="overflow-hidden">
                                                        {getBuilderProgramsLoading ? (
                                                            <div className="col-span-6 flex items-center justify-center">
                                                                <Loader />
                                                            </div>
                                                        ) : (
                                                            <div className="flex flex-col   overflow-hidden">
                                                                <ProgramBuilders
                                                                    refetch={(
                                                                        id
                                                                    ) =>
                                                                        refetch(
                                                                            id
                                                                        )
                                                                    }
                                                                    user={user}
                                                                    callBack={(
                                                                        result
                                                                    ) =>
                                                                        callBack(
                                                                            result
                                                                        )
                                                                    }
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Disclosure.Panel>
                        </Transition>
                    </Disclosure>
                ) : null}

                {edit === true ? (
                    <Disclosure as="div" className="mt-5">
                        <Disclosure.Button
                            className={`bg-white w-full  focus:outline-none ${active === "user" && show
                                ? "rounded-lg rounded-b-none"
                                : "rounded-lg"
                                }`}
                        >
                            <div
                                style={{ maxHeight: "68px" }}
                                className={`flex flex-col px-4 md:flex-row justify-between items-center ${active === "user" && show
                                    ? "border-b-2 border-gray-400"
                                    : ""
                                    }`}
                                onClick={() => {
                                    activeHandler("user")
                                    getBuilderUser()
                                }}
                            >
                                <div className="flex items-center gap-2">
                                    <div className=" font-title py-4 text-center h2">
                                        {active === "user" && show
                                            ? "Users: " + fields?.name
                                            : "Users"}
                                    </div>
                                </div>

                                {active === "user" && show ? (
                                    <ChevronUpIcon className="h-10 w-10 text-secondary" />
                                ) : (
                                    <ChevronDownIcon className="h-10 w-10 text-secondary" />
                                )}
                            </div>
                        </Disclosure.Button>
                        <Transition
                            show={active === "user" && show}
                            enter="transition duration-100 ease-out"
                            enterFrom="transform scale-95 opacity-0"
                            enterTo="transform scale-100 opacity-100"
                            leave="transition duration-150 ease-out"
                            leaveFrom="transform scale-100 opacity-100"
                            leaveTo="transform scale-95 opacity-0"
                        >
                            <Disclosure.Panel static>
                                <div className="grid bg-white  rounded-lg rounded-t-none grid-cols-6 overflow-hidden">
                                    {getBuilderUserLoading ? (
                                        <div className="col-span-6 flex items-center justify-center">
                                            <Loader />
                                        </div>
                                    ) : (
                                        <UsersBuilders
                                            refetch={(id) => refetch(id)}
                                            user={user}
                                            callBack={(result) =>
                                                callBack(result)
                                            }
                                            openWhat={openWhat}
                                            setUser={(node) => setUser(node)}
                                        />
                                    )}
                                </div>
                            </Disclosure.Panel>
                        </Transition>
                    </Disclosure>
                ) : null}
            </div>
        ) : null;
    };

    return accordians();
};

export default CreateBuilder;
