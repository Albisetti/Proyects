import React, {
    useState,
    useCallback,
    useRef,
    useEffect,
    useContext,
} from "react";
import { Link } from "react-router-dom";
import Button from "../../../../Buttons";
import Modal from "../../../../Modal";
import { toast } from "react-toastify";
import { useLazyQuery, useMutation } from "@apollo/client";
import {
    FETCH_BUNDLES_QUERY,
    CREATE_BUNDLE,
    FETCH_PRODUCTS_PER_BUNDLE,
    UPDATE_BUNDLE,
    SEARCH_BUNDLES_QUERY,
    DELETE_BUNDLE,
} from "../../../../../lib/bundles";
import { XCircleIcon } from "@heroicons/react/outline";
import { Helmet } from "react-helmet";
import Loader from "../../../../Loader/Loader";
import BundleAccordion from "./BundleAccordion";
import { SEARCH_PRODUCTS } from "../../../../../lib/search";
import { PlusCircleIcon } from "@heroicons/react/solid";
import HelperModal from "../../../../Modal/HelperModal";
import {
    useDebounce,
    useMandatoryImpersonation,
} from "../../../../../util/hooks";
import { AuthContext } from "../../../../../contexts/auth";
import { APP_TITLE } from "../../../../../util/constants";

const Bundles = () => {
    const [showModal, setShowModal] = useState(false);
    const [accordianData, setAccordianData] = useState([]);
    const [accordianDataClickData, setAccordianDataClickData] = useState([]);
    const [active, setActive] = useState("");
    const [bundleName, setBundleName] = useState();
    const [name, setName] = useState();
    const [reset, setReset] = useState(false);
    const [searched, setSearched] = useState(false);
    const programObserver = useRef();
    const [productPerBundle, setProductsPerBundle] = useState([]);
    const [activeProducts, setActiveProducts] = useState([]);
    const [fields, setFields] = useState();
    const [edit, setEdit] = useState(false);
    const [error, setError] = useState();
    const [productNode, setProductNode] = useState();
    const [productSearch, setProductSearch] = useState();
    const [productSearchString, setProductSearchString] = useState("");
    const [deleteBundleId, setDeleteBundleId] = useState("");
    const [showBundleDeleteModal, setShowBundleDeleteModal] = useState(false);
    const [deleteBundleName, setDeleteBundleName] = useState()
    const [editName, setEditName] = useState(false);
    const [editNameField, setEditNameField] = useState();


    const first = 20;

    const { impersonator } = useMandatoryImpersonation({
        allowedUserTypes: ["BUILDERS"],
    });

    const { organizationId, organizationNode } = useContext(AuthContext);

    // eslint-disable-next-line
    const lastProgramElement = useCallback((node) => {
        if (programObserver.current) programObserver.current.disconnect();
        programObserver.current = new IntersectionObserver((entries) => {
            if (
                entries[0].isIntersecting &&
                bundles?.bundles?.pageInfo?.hasNextPage
            ) {
                fetchMoreBundles({
                    variables: {
                        first,
                        after: bundles?.bundles?.pageInfo?.endCursor,
                    },
                });
            }
        });
        if (node) programObserver.current.observe(node);
    });

    const [
        getBundles,
        { data: bundles, loading: bundleLoading, fetchMore: fetchMoreBundles },
    ] = useLazyQuery(FETCH_BUNDLES_QUERY, {
        notifyOnNetworkStatusChange: false,
    });

    const [deleteBundle] = useMutation(DELETE_BUNDLE, {
        variables: {
            id: deleteBundleId
        },
        update(cache, result) {
            const data = cache.readQuery({
                query: FETCH_BUNDLES_QUERY,
            });

            cache.writeQuery({
                query: FETCH_BUNDLES_QUERY,
                data: {
                    bundles: {
                        edges: [...data?.bundles?.edges?.filter(
                            (u) => u.node.id !== deleteBundleId
                        )],
                    },
                },
            });

            setDeleteBundleId("");
            setShowBundleDeleteModal(false)
            toast.success(deleteBundleName + " deleted.");
            setProductsPerBundle([])
            setName("");
            setActive("");
            setBundleName("")
            setDeleteBundleName("")
        }
    })

    const deleteModalContent = () => {
        return (
            <div className="text-gray-500 text-lg font-medium px-4 ">
                Please click Remove to delete the {deleteBundleName} bundle, or click the X to continue making updates.
            </div>
        )
    }

    const deleteBundleModal = () => {
        return (
            <>
                <Modal
                    title="Confirm Delete"
                    submitLabel="Remove"
                    submitLabelColor="brickRed"
                    onClose={() => setShowBundleDeleteModal(false)}
                    IconJSX={<IconJSX />}
                    Content={deleteModalContent()}
                    onSubmit={() => deleteBundle()}
                    show={showBundleDeleteModal}
                />
            </>
        );
    };


    useEffect(() => {
        getBundles();
        // eslint-disable-next-line
    }, [impersonator]);

    const debouncedValue = useDebounce(bundleName, 160);

    useEffect(() => {
        if (searched === true) {
            searchBundles();
        }
        // eslint-disable-next-line
    }, [debouncedValue]);

    const [
        searchBundles,
        { data: searchedBundles, loading: searchBundleLoading },
    ] = useLazyQuery(SEARCH_BUNDLES_QUERY, {
        variables: {
            search: bundleName,
        },
        fetchPolicy: "no-cache",
        notifyOnNetworkStatusChange: false,
        onCompleted: () => { },
    });

    const handleChange = (e) => {
        setBundleName(e.target.value);
        if (bundleName?.length > 1) {
            setSearched(true);
        }
    };

    const [
        getProducts,
        { data: products, loading: productsLoading },
    ] = useLazyQuery(FETCH_PRODUCTS_PER_BUNDLE, {
        variables: {
            id: parseInt(active),
            first: 200000
        },
        fetchPolicy: "no-cache",
        notifyOnNetworkStatusChange: false,
        onCompleted: () => {
            setProductsPerBundle(products.bundle.products.edges);
            setActiveProducts(() =>
                products.bundle.products.edges.map((item) =>
                    parseInt(item.node.id)
                )
            );
            handleFields(products?.bundle?.products?.edges);
        },
    });

    const handleFields = (array) => {
        let object = {};
        array?.forEach((item) => {
            object[item?.node?.id] = item?.node?.bundlePivot?.product_quantity;
        });

        setFields(object);
    };

    const [createBundle] = useMutation(CREATE_BUNDLE, {
        variables: {
            name: bundleName,
            organization: organizationId,
        },
        update(cache, result) {
            const data = cache.readQuery({
                query: FETCH_BUNDLES_QUERY,
            });

            delete Object.assign(result.data, {
                node: result.data["createBundle"],
            })["createBundle"];

            cache.writeQuery({
                query: FETCH_BUNDLES_QUERY,
                data: {
                    bundles: {
                        edges: [result.data, ...data.bundles.edges],
                    },
                },
            });
            setBundleName("");
            setSearched(false);
            setActive(result?.data?.node?.id);
            setName(result?.data?.node?.name);

            toast.success(bundleName + " created.");
        },
    });

    const dataFormat = () => {
        let array = [];

        productPerBundle &&
            productPerBundle.length > 0 &&
            // eslint-disable-next-line
            productPerBundle.map((item) => {
                let object = {};
                object.id = item.node.id;
                object.product_quantity =
                    fields && fields[item.node.id]
                        ? parseInt(fields[item.node.id])
                        : item.node.bundlePivot &&
                        item.node.bundlePivot.product_quantity;
                array.push(object);
            });
        return array;
    };

    const [updateBundle, { loading: updateBundleLoading }] = useMutation(
        UPDATE_BUNDLE,
        {
            variables: {
                id: parseInt(active),
                name: name,
                organization: organizationId,
                products: dataFormat(),
            },
            update(cache, result) {
                if (
                    activeProducts?.length >
                    result?.data?.updateBundle?.products?.edges?.length
                )
                    setActiveProducts(() =>
                        result?.data?.updateBundle?.products?.edges?.map((item) =>
                            parseInt(item.node.id)
                        )
                    );
                let name = result?.data?.updateBundle?.name;
                toast.success(name + " updated!");
                const data = cache.readQuery({
                    query: FETCH_BUNDLES_QUERY,
                });

                delete Object.assign(result.data, {
                    node: result.data["updateBundle"],
                })["updateBundle"];

                if (data?.bundles) {

                    cache.writeQuery({
                        query: FETCH_BUNDLES_QUERY,
                        data: {
                            bundles: {
                                edges: [
                                    result?.data,
                                    ...data?.bundles?.edges?.filter(
                                        (u) => u.node.id !== result.data.node.id
                                    ),
                                ],
                            },
                        },
                    });
                }
                getProducts();
                setEditName(false);
                setReset(true);
            },
        }
    );

    useEffect(() => {
        setAccordianData(
            organizationNode?.organizations?.edges?.[0]?.node?.programs?.edges
        );
    }, [organizationNode]);

    const addProducts = (eachData) => {
        if (!activeProducts.includes(parseInt(eachData.node.id))) {
            setEdit(true);
            setProductsPerBundle((productPerBundle) => [
                ...productPerBundle,
                eachData,
            ]);
            setActiveProducts((activeProducts) => [
                ...activeProducts,
                parseInt(eachData.node.id),
            ]);
        }
    };

    const AccordianComponent = () => {
        return (
            <div className="w-full max-h-partial xl:max-h-smallMin sm:max-h-full scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400">
                <ul className=" flex-0 w-full  overflow-auto border-l  border-r border-white ">
                    {accordianDataClickData.map((eachData) => {
                        return (
                            <li
                                className={` pl-5 transition-all py-2 border-t border-l-4 bg-gray-100  hover:border-l-6 ${activeProducts.includes(
                                    parseInt(eachData.node.id)
                                )
                                    ? "border-l-gold border-l-6"
                                    : "border-l-primary"
                                    }`}
                                onClick={() => {
                                    addProducts(eachData);
                                    setProductNode(eachData);
                                }}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <div className="flex flex-col text-xs text-gray-500 italic">
                                            {eachData.node.category &&
                                                eachData.node.category.name}
                                        </div>
                                        <div className="group relative   flex justify-between items-center">
                                            <div className="text-sm font-semibold text-gray-500">
                                                <Link
                                                    to="#"
                                                    className="  focus:outline-none"
                                                >
                                                    <span
                                                        className="absolute inset-0"
                                                        aria-hidden="true"
                                                    ></span>

                                                    {eachData?.node
                                                        ?.bbg_product_code
                                                        ? eachData?.node
                                                            ?.bbg_product_code +
                                                        " - "
                                                        : ""}
                                                    {eachData.node.name}
                                                </Link>
                                            </div>
                                        </div>
                                        <div className=" flex flex-col text-xs text-gray-500">
                                            {eachData.node &&
                                                eachData.node.programs &&
                                                eachData.node.programs.edges
                                                    .length > 0 &&
                                                eachData.node.programs.edges.map(
                                                    (item) => {
                                                        return (
                                                            <div className="flex flex-col">
                                                                <span className="">
                                                                    {
                                                                        item
                                                                            ?.node
                                                                            ?.name
                                                                    }
                                                                </span>
                                                            </div>
                                                        );
                                                    }
                                                )}
                                        </div>
                                    </div>
                                    {activeProducts.includes(
                                        parseInt(eachData.node.id)
                                    ) ? null : (
                                        <PlusCircleIcon className="w-8 h-8 mr-5 text-brickGreen cursor-pointer" />
                                    )}
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>
        );
    };

    const newProductContent = () => {
        return (
            <div className="grid grid-cols-1 w-full text-rose-200">
                <div className="flex flex-col md:flex-row px-4 py-2  justify-between items-center">
                    <p className=" w-full py-2 text-start text-primary font-bold text-md">
                        Search Bundles
                    </p>
                    <div className="my-1 ml-5 flex rounded-md shadow-sm">
                        <div className="relative flex w-48 sm:w-100 ">
                            <input
                                type="text"
                                name="customRebate"
                                id="customRebate"
                                value={bundleName}
                                className="focus:ring-primary focus:border-primary block rounded-none rounded-l-md w-full sm:text-sm border-gray-300"
                                placeholder="Bundle Name"
                            ></input>
                        </div>
                        <button className="-ml-px relative inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-r-md text-primary bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary">
                            <span>Add</span>
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const initialState = {};

    const handleBundle = (node) => {
        setActive(node.id);
        setActiveProducts([]);
        setEdit(false);
        setFields({});
        setName(node.name);
        getProducts();
        setError(initialState);
    };

    const IconJSX = () => {
        return (
            <svg
                className="h-6 w-6 text-red-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
            </svg>
        );
    };

    const accordianDataClick = (data) => {
        setAccordianDataClickData(data.products.edges);
        setEdit(false);
    };

    const removeFromBundle = async (id) => {
        setProductsPerBundle((productPerBundle) =>
            productPerBundle.filter((item) => item.node.id !== id)
        );
        setActiveProducts((activeProducts) =>
            activeProducts?.filter((item) => item === id)
        );
    };

    const modal = () => {
        return (
            <>
                <Modal
                    title="Find a Program"
                    Content={newProductContent()}
                    submitLabel="Confirm"
                    onClose={() => setShowModal(false)}
                    IconJSX={<IconJSX />}
                    show={showModal}
                />
            </>
        );
    };

    const handleQuantityChange = (eachPackage, e) => {
        setEdit(true);
        setFields({
            ...fields,
            [parseInt(eachPackage.node.id)]: e.target.value,
        });
        setProductNode(eachPackage);
    };

    useEffect(() => {
        if (
            fields?.[parseInt(productNode?.node?.id)] <
            productNode?.node?.minimum_unit &&
            productNode?.node?.minimum_unit !== null &&
            productNode?.node?.require_quantity_reporting
        ) {
            setError({ ...error, [parseInt(productNode?.node?.id)]: true });
        } else if (
            !fields?.[parseInt(productNode?.node?.id)] &&
            productNode?.node?.minimum_unit !== null &&
            productNode?.node?.require_quantity_reporting
        ) {
            setError({ ...error, [parseInt(productNode?.node?.id)]: true });
        } else if (
            productNode?.node?.require_quantity_reporting &&
            !fields?.[parseInt(productNode?.node?.id)]
        ) {
            setError({ ...error, [parseInt(productNode?.node?.id)]: true });
        } else {
            setError({ ...error, [parseInt(productNode?.node?.id)]: false });
        }
        // eslint-disable-next-line
    }, [fields, productPerBundle, productNode]);

    const isError = () => {
        let finalError = false;
        // eslint-disable-next-line
        productPerBundle?.map((item) => {
            if (error?.[item?.node?.id]) {
                finalError = true;
            }
        });
        return finalError;
    };

    const debouncedValue1 = useDebounce(productSearchString, 160);

    useEffect(() => {
        if (productSearchString.trim().length > 1 && productSearch === true) {
            searchProducts({
                variables: {
                    search: debouncedValue1,
                },
            });
        }
        // eslint-disable-next-line
    }, [debouncedValue1]);

    const [
        searchProducts,
        { data: searchedProducts, loading: searchedLoading },
    ] = useLazyQuery(SEARCH_PRODUCTS, {

        notifyOnNetworkStatusChange: false,
        onCompleted: () => { },
    });

    const findUniqueProductCount = (products) => {
        let productCodes = [];
        products?.forEach((item) => {
            if (!productCodes?.includes(item?.node?.bbg_product_code)) {
                productCodes?.push(item?.node?.bbg_product_code)
            }
        });
        let count = productCodes?.length;
        if (count > 0) {
            return count;
        }
        return 0;
    };

    const handleEditNameChange = (e) => {
        setEditName(true);
        const { name, value } = e.target;
        setName(value)
        setEditNameField({
            ...editNameField,
            [name]: value,
        });
    }

    return (
        <div className="min-h-smallMin  max-w-8xl flex flex-col gap-5 h-full w-8xl mx-auto px-4 sm:px-6 lg:px-32">
            <Helmet>
                <meta charSet="utf-8" />
                <title>{APP_TITLE} - Manage Bundles</title>
            </Helmet>
            <div className=" bg-white rounded-lg py-4  px-4 h1 flex w-full justify-between items-center">
                <div className="flex items-center">
                    <p>Manage Bundles</p>
                    <HelperModal type={"bundles"} title="Bundles Information" />
                </div>
                <Link
                    className="text-md"
                    to={{
                        pathname: "/reporting/assignment",
                        state: { tab: "assignment" },
                    }}
                >
                    Go to: <span>Product Assignment</span>
                </Link>
            </div>
            <div
                className="flex space-x-5 overflow-hidden"
                style={{ minHeight: "79vh", maxHeight: "79vh" }}
            >
                <div className=" bg-white border w-full rounded-lg max-w-xs 3xl:max-w-sm">
                    <div className="flex flex-col h-full">
                        <div className="flex flex-col md:flex-row px-4 border-b justify-between items-center">
                            <div className="font-title  py-4 text-center h2">
                                Bundles
                            </div>
                            <div className="my-1 ml-5 flex rounded-md ">
                                <div className="relative flex w-48 sm:w-100 focus-within:z-10">
                                    <input
                                        onChange={(e) => handleChange(e)}
                                        type="text"
                                        name="bundleName"
                                        id="bundleName"
                                        className="focus:ring-secondary focus:border-secondary block rounded-md  w-full sm:text-sm border-gray-300"
                                        placeholder="Find or Add Bundle"
                                        value={bundleName}
                                    ></input>
                                </div>
                                {searched === true ? (
                                    <button
                                        type="button"
                                        className="text-lg  pl-2  font-medium  rounded-md text-secondary focus:outline-none"
                                        onClick={() => {
                                            createBundle();
                                        }}
                                    >
                                        <svg
                                            className="w-8 h-8"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                    </button>
                                ) : null}
                            </div>
                        </div>
                        <div className="flex h-full scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400 w-full">
                            <div className="w-full  scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400">
                                <ul className=" flex-0 w-full h-full  scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400 overflow-auto">
                                    {searched === true &&
                                        bundleName?.length > 0 ? (
                                        searchBundleLoading ? (
                                            <Loader />
                                        ) : searchedBundles?.searchBundles
                                            ?.edges?.length === 0 ? (
                                            <div className="border-b py-2 px-2 text-secondary font-title font-semibold flex items-center justify-between">
                                                <p> No Results Found </p>
                                                <span
                                                    className="underline cursor-pointer text-brickRed"
                                                    onClick={() => {
                                                        setBundleName("");
                                                        setSearched(false);
                                                    }}
                                                >
                                                    {" "}
                                                    Reset{" "}
                                                </span>
                                            </div>
                                        ) : (
                                            searchedBundles &&
                                            searchedBundles.searchBundles &&
                                            searchedBundles.searchBundles.edges
                                                .length !== 0 &&
                                            searchedBundles.searchBundles.edges.map(
                                                (eachData, index) => {
                                                    if (
                                                        index ===
                                                        searchedBundles
                                                            .searchBundles.edges
                                                            .length -
                                                        1
                                                    ) {
                                                        return (
                                                            <li
                                                                className={`  border-b transition-all group flex items-center justify-between border-l-4    hover:border-l-6   ${active ===
                                                                    eachData
                                                                        .node.id
                                                                    ? "bg-gray-100 border-l-6 border-l-gold text-darkgray75 "
                                                                    : "text-darkgray75 border-l-primary"
                                                                    }`}
                                                                onClick={() =>
                                                                    handleBundle(
                                                                        eachData.node
                                                                    )
                                                                }
                                                                ref={
                                                                    lastProgramElement
                                                                }
                                                            >
                                                                <div className="relative flex flex-col py-2">
                                                                    <div className="text-sm px-4 font-semibold ">
                                                                        <div className="focus:outline-none cursor-pointer">
                                                                            <span
                                                                                className="absolute inset-0"
                                                                                aria-hidden="true"
                                                                            ></span>
                                                                            {
                                                                                eachData
                                                                                    .node
                                                                                    .name
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                    <div className=" flex flex-col text-xs px-4 text-secondary">
                                                                        (
                                                                        {findUniqueProductCount(
                                                                            eachData
                                                                                ?.node
                                                                                ?.products
                                                                                ?.edges
                                                                        ) >
                                                                            1
                                                                            ? findUniqueProductCount(
                                                                                eachData
                                                                                    ?.node
                                                                                    ?.products
                                                                                    ?.edges
                                                                            )
                                                                            +
                                                                            " Product Codes"
                                                                            : findUniqueProductCount(
                                                                                eachData
                                                                                    ?.node
                                                                                    ?.products
                                                                                    ?.edges
                                                                            ) +
                                                                            " Product Code"}
                                                                        )
                                                                    </div>
                                                                </div>
                                                                <div
                                                                    className="pr-4 cursor-pointer transition-all duration-300 opacity-0 group-hover:opacity-100"
                                                                    onClick={(
                                                                        e
                                                                    ) => {
                                                                        e.stopPropagation();
                                                                        setDeleteBundleId(
                                                                            eachData
                                                                                ?.node
                                                                                ?.id
                                                                        );
                                                                        setDeleteBundleName(
                                                                            eachData
                                                                                ?.node
                                                                                ?.name
                                                                        );
                                                                        setShowBundleDeleteModal(
                                                                            true
                                                                        );
                                                                    }}
                                                                >
                                                                    <XCircleIcon className="w-8 h-8 text-brickRed" />
                                                                </div>
                                                            </li>
                                                        );
                                                    }
                                                    return (
                                                        <li
                                                            onClick={() =>
                                                                handleBundle(
                                                                    eachData.node
                                                                )
                                                            }
                                                            className={`  border-b transition-all group  border-l-4 flex items-center justify-between   hover:border-l-6  ${active ===
                                                                eachData.node.id
                                                                ? "bg-gray-100 border-l-6 border-l-gold text-darkgray75 "
                                                                : "text-darkgray75 border-l-primary"
                                                                }`}
                                                        >
                                                            <div className="relative flex flex-col py-2  ">
                                                                <div className="text-sm px-4 font-semibold ">
                                                                    <div className="focus:outline-none cursor-pointer">
                                                                        <span
                                                                            className="absolute inset-0"
                                                                            aria-hidden="true"
                                                                        ></span>
                                                                        {
                                                                            eachData
                                                                                .node
                                                                                .name
                                                                        }
                                                                    </div>
                                                                </div>
                                                                <div className=" flex flex-col text-xs px-4 text-secondary">
                                                                    (
                                                                    {findUniqueProductCount(
                                                                        eachData
                                                                            ?.node
                                                                            ?.products
                                                                            ?.edges
                                                                    ) >
                                                                        1
                                                                        ? findUniqueProductCount(
                                                                            eachData
                                                                                ?.node
                                                                                ?.products
                                                                                ?.edges
                                                                        ) +
                                                                        " Product Codes"
                                                                        : findUniqueProductCount(
                                                                            eachData
                                                                                ?.node
                                                                                ?.products
                                                                                ?.edges
                                                                        ) +
                                                                        " Product Code"}
                                                                    )
                                                                </div>
                                                            </div>
                                                            <div className="pr-4 cursor-pointer transition-all duration-300 opacity-0 group-hover:opacity-100" onClick={(e) => {
                                                                e.stopPropagation()
                                                                setDeleteBundleId(eachData?.node?.id);
                                                                setDeleteBundleName(eachData?.node?.name)
                                                                setShowBundleDeleteModal(true);
                                                            }}>
                                                                <XCircleIcon className="w-8 h-8 text-brickRed" />
                                                            </div>
                                                        </li>
                                                    );
                                                }
                                            )
                                        )
                                    ) : bundleLoading ? (
                                        <Loader />
                                    ) : (
                                        bundles &&
                                        bundles.bundles &&
                                        bundles.bundles.edges.length !== 0 &&
                                        bundles.bundles.edges.map(
                                            (eachData, index) => {
                                                if (
                                                    index ===
                                                    bundles.bundles.edges
                                                        .length -
                                                    1
                                                ) {
                                                    return (
                                                        <li
                                                            className={`  border-b transition-all group flex items-center justify-between  border-l-4    hover:border-l-6   ${active ===
                                                                eachData.node.id
                                                                ? "bg-gray-100 border-l-6 border-l-gold text-darkgray75 "
                                                                : "text-darkgray75 border-l-primary"
                                                                }`}
                                                            onClick={() => {
                                                                handleBundle(
                                                                    eachData.node
                                                                )
                                                                setEditName(false);
                                                            }
                                                            }
                                                            ref={
                                                                lastProgramElement
                                                            }
                                                        >
                                                            <div className="relative flex flex-col py-2">
                                                                <div className="text-sm px-4 font-semibold ">
                                                                    <div className="focus:outline-none cursor-pointer">
                                                                        <span
                                                                            className="absolute inset-0"
                                                                            aria-hidden="true"
                                                                        ></span>
                                                                        {
                                                                            eachData
                                                                                .node
                                                                                .name
                                                                        }
                                                                    </div>
                                                                </div>
                                                                <div className=" flex flex-col text-xs px-4 text-secondary">
                                                                    (
                                                                    {findUniqueProductCount(
                                                                        eachData
                                                                            ?.node
                                                                            ?.products
                                                                            ?.edges
                                                                    ) >
                                                                        1
                                                                        ? findUniqueProductCount(
                                                                            eachData
                                                                                ?.node
                                                                                ?.products
                                                                                ?.edges
                                                                        ) +
                                                                        " Product Codes"
                                                                        : findUniqueProductCount(
                                                                            eachData
                                                                                ?.node
                                                                                ?.products
                                                                                ?.edges
                                                                        ) +
                                                                        " Product Code"}
                                                                    )
                                                                </div>
                                                            </div>
                                                            <div className="pr-4 cursor-pointer transition-all duration-300 opacity-0 group-hover:opacity-100" onClick={(e) => {
                                                                e.stopPropagation()
                                                                setDeleteBundleId(eachData?.node?.id);
                                                                setDeleteBundleName(eachData?.node?.name)
                                                                setShowBundleDeleteModal(true);
                                                            }}>
                                                                <XCircleIcon className="w-8 h-8 text-brickRed" />
                                                            </div>
                                                        </li>
                                                    );
                                                }
                                                return (
                                                    <li
                                                        onClick={() => {
                                                            handleBundle(
                                                                eachData.node
                                                            )
                                                            setEditName(false);
                                                        }
                                                        }
                                                        className={`  border-b transition-all group flex items-center justify-between border-l-4    hover:border-l-6  ${active ===
                                                            eachData.node.id
                                                            ? "bg-gray-100 border-l-6 border-l-gold text-darkgray75 "
                                                            : "text-darkgray75 border-l-primary"
                                                            }`}
                                                    >
                                                        <div className="relative flex flex-col py-2  ">
                                                            <div className="text-sm px-4 font-semibold ">
                                                                <div className="focus:outline-none cursor-pointer">
                                                                    <span
                                                                        className="absolute inset-0"
                                                                        aria-hidden="true"
                                                                    ></span>
                                                                    {
                                                                        eachData
                                                                            .node
                                                                            .name
                                                                    }
                                                                </div>
                                                            </div>
                                                            <div className=" flex flex-col text-xs px-4 text-secondary">
                                                                (
                                                                {findUniqueProductCount(
                                                                    eachData
                                                                        ?.node
                                                                        ?.products
                                                                        ?.edges
                                                                ) >
                                                                    1
                                                                    ? findUniqueProductCount(
                                                                        eachData
                                                                            ?.node
                                                                            ?.products
                                                                            ?.edges
                                                                    ) +
                                                                    " Product Codes"
                                                                    : findUniqueProductCount(
                                                                        eachData
                                                                            ?.node
                                                                            ?.products
                                                                            ?.edges
                                                                    ) +
                                                                    " Product Code"}
                                                                )
                                                            </div>
                                                        </div>
                                                        <div className="pr-4 cursor-pointer transition-all duration-300 opacity-0 group-hover:opacity-100" onClick={(e) => {
                                                            e.stopPropagation()
                                                            setDeleteBundleId(eachData?.node?.id);
                                                            setDeleteBundleName(eachData?.node?.name)
                                                            setShowBundleDeleteModal(true);
                                                        }}>
                                                            <XCircleIcon className="w-8 h-8 text-brickRed" />
                                                        </div>
                                                    </li>
                                                );
                                            }
                                        )
                                    )}
                                </ul>
                            </div>
                        </div>
                        <div className="flex flex-col w-full py-2 border-t justify-end items-center">
                            <div className="  text-secondary font-bold">
                                Total:
                                {searched === true && bundleName?.length > 0
                                    ? searchedBundles?.searchBundles
                                        ?.pageInfo &&
                                        !searchBundleLoading?.total > 1
                                        ? searchedBundles?.searchBundles
                                            ?.pageInfo?.total + " Bundles"
                                        : !searchBundleLoading &&
                                        searchedBundles?.searchBundles
                                            ?.pageInfo?.total + " Bundle"
                                    : bundles?.bundles?.pageInfo?.total > 1 &&
                                        !bundleLoading
                                        ? bundles?.bundles?.pageInfo?.total +
                                        " Bundles"
                                        : !bundleLoading &&
                                        bundles?.bundles?.pageInfo?.total +
                                        " Bundle"}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-white w-full max-w-md  rounded-lg lg:col-span-3 ">
                    <div className="h-full relative   lg:pr-0 xl:pr-3 2xl:pr-0">
                        {modal()}
                        {deleteBundleModal()}
                        <div className="inset-0    h-full flex flex-col">
                            <div className="flex flex-col  ">
                                <div className="flex justify-between border-b px-4 ">
                                    <div className="font-title py-4 text-center h2">
                                        Add Products
                                    </div>
                                    <div className="my-2 ml-5 flex rounded-md ">
                                        <div className="relative flex w-48 sm:w-100">
                                            <input
                                                onChange={(e) => {
                                                    setProductSearchString(
                                                        e.target.value
                                                    );
                                                    if (
                                                        productSearchString.trim()
                                                            .length > 1
                                                    ) {
                                                        setProductSearch(true);
                                                    }
                                                }}
                                                type="text"
                                                name="productSearchString"
                                                id="productSearchString"
                                                className="focus:ring-secondary focus:border-secondary block rounded-md  w-full sm:text-sm border-gray-300"
                                                placeholder="Find or Add"
                                                value={productSearchString}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {active !== "" &&
                                    productSearch &&
                                    productSearchString?.trim().length > 0 ? (
                                    <div className=" col-span-1 m-5 max-h-48  mb-3  bg-white overflow-auto  scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400 ">
                                        {searchedLoading ? (
                                            <div className="border rounded-lg">
                                                <Loader />
                                            </div>
                                        ) : searchedProducts?.searchProducts
                                            ?.edges?.length === 0 ? (
                                            <div className="border rounded-lg py-2 px-2 text-secondary font-title font-semibold flex items-center justify-between">
                                                <p> No Results Found </p>
                                                <span
                                                    className="underline cursor-pointer text-brickRed"
                                                    onClick={() => {
                                                        setProductSearchString(
                                                            ""
                                                        );
                                                        setProductSearch(false);
                                                    }}
                                                >
                                                    {" "}
                                                    Reset{" "}
                                                </span>
                                            </div>
                                        ) : (
                                            <div
                                                className={`${searchedProducts
                                                    ?.searchProducts?.edges
                                                    ?.length > 0
                                                    ? "border rounded-lg "
                                                    : ""
                                                    }`}
                                            >
                                                {searchedProducts
                                                    ?.searchProducts?.edges
                                                    ?.length > 0 &&
                                                    searchedProducts?.searchProducts?.edges.map(
                                                        (item) => {
                                                            return (
                                                                <div
                                                                    className="flex items-center w-full py-4 border-b"
                                                                    onClick={() => {
                                                                        addProducts(
                                                                            item
                                                                        );
                                                                        setProductNode(
                                                                            item
                                                                        );
                                                                        setProductSearchString(
                                                                            ""
                                                                        );
                                                                        setProductSearch(
                                                                            false
                                                                        );
                                                                    }}
                                                                >
                                                                    <div className="min-w-0 flex-1 flex">
                                                                        <div className=" flex-1 px-4 flex justify-between md:gap-4 items-center">
                                                                            <div className="flex flex-col items-start">
                                                                                <div className="flex flex-col text-xs text-gray-500 italic">
                                                                                    {item
                                                                                        .node
                                                                                        .category &&
                                                                                        item
                                                                                            .node
                                                                                            .category
                                                                                            .name}
                                                                                </div>
                                                                                <div className="group relative   flex justify-between items-center">
                                                                                    <div className="text-sm font-semibold text-gray-500">
                                                                                        <Link
                                                                                            to="#"
                                                                                            className="  focus:outline-none"
                                                                                        >
                                                                                            <span
                                                                                                className="absolute inset-0"
                                                                                                aria-hidden="true"
                                                                                            ></span>
                                                                                            {item
                                                                                                .node
                                                                                                .bbg_product_code
                                                                                                ? item
                                                                                                    .node
                                                                                                    .bbg_product_code +
                                                                                                " - "
                                                                                                : null}
                                                                                            {
                                                                                                item
                                                                                                    .node
                                                                                                    .name
                                                                                            }
                                                                                        </Link>
                                                                                    </div>
                                                                                </div>
                                                                                <div className=" flex flex-col text-xs text-gray-500">
                                                                                    {item.node &&
                                                                                        item
                                                                                            .node
                                                                                            .programs &&
                                                                                        item
                                                                                            .node
                                                                                            .programs
                                                                                            .edges
                                                                                            .length >
                                                                                        0 &&
                                                                                        item.node.programs.edges.map(
                                                                                            (
                                                                                                item
                                                                                            ) => {
                                                                                                return (
                                                                                                    <div className="flex flex-col">
                                                                                                        <span className="">
                                                                                                            {
                                                                                                                item
                                                                                                                    .node
                                                                                                                    .name
                                                                                                            }
                                                                                                        </span>
                                                                                                    </div>
                                                                                                );
                                                                                            }
                                                                                        )}
                                                                                </div>
                                                                            </div>
                                                                            <div className="text-secondary ">
                                                                                {productPerBundle?.findIndex(
                                                                                    (
                                                                                        element
                                                                                    ) =>
                                                                                        parseInt(
                                                                                            element
                                                                                                ?.node
                                                                                                ?.id
                                                                                        ) ===
                                                                                        parseInt(
                                                                                            item
                                                                                                ?.node
                                                                                                ?.id
                                                                                        )
                                                                                ) ===
                                                                                    -1 ? (
                                                                                    <PlusCircleIcon className="w-8 h-8 text-brickGreen cursor-pointer" />
                                                                                ) : (
                                                                                    "Added"
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        }
                                                    )}
                                            </div>
                                        )}
                                    </div>
                                ) : null}
                            </div>

                            <div className="flex flex-col flex-1 overflow-auto w-full">
                                <div className="flex flex-col h-full overflow-auto w-full">
                                    <div className="w-full h-full   scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400">
                                        <div className="grid grid-cols-1 h-full scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400 gap-6 border-t border-b">
                                            {active ? (
                                                false ? (
                                                    <Loader />
                                                ) : (
                                                    <BundleAccordion
                                                        onClick={(data) => {
                                                            accordianDataClick(
                                                                data.node
                                                            );
                                                        }}
                                                        reset={reset}
                                                        component={
                                                            <AccordianComponent />
                                                        }
                                                        selectedProducts={
                                                            productPerBundle
                                                        }
                                                        Data={
                                                            accordianData &&
                                                                accordianData.length >
                                                                0
                                                                ? accordianData
                                                                : null
                                                        }
                                                    />
                                                )
                                            ) : null}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white border w-full  rounded-lg lg:col-span-4 ">
                    <div className="h-full relative   lg:pr-0 xl:pr-3 2xl:pr-0">
                        {modal()}
                        <div className="inset-0    h-full flex flex-col">
                            <div className="flex flex-col md:flex-row justify-between items-center">
                                <div className={`flex flex-col md:flex-row justify-between items-center font-title px-4 py-1 text-center h2`} style={{ width: "100%", whiteSpace: "nowrap" }}>
                                    <input
                                        type="text"
                                        name="bundleName"
                                        id="bundleName"
                                        onChange={handleEditNameChange}
                                        value={
                                            editName
                                                ? editNameField?.name
                                                : name
                                        }
                                        className="focus:outline-none  input-no-error font-title text-left h2  rounded-md"
                                        style={{
                                            border: "none",
                                            borderBottom: "1px solid #1890ff",
                                            padding: "5px 10px",
                                            outline: "none",
                                            borderRadius: "0",
                                            width: "100%"
                                        }}
                                        placeholder="Bundle Name"
                                    />
                                    <Button
                                        color="primary"
                                        title={
                                            updateBundleLoading
                                                ? "Renaming"
                                                : "Rename"
                                        }
                                        style={{
                                            whiteSpace: "nowrap",
                                            textAlign: "center",
                                            width: "auto"
                                        }}
                                        disabled={!editName}
                                        onClick={() => {
                                            updateBundle();
                                        }} />
                                </div>
                            </div>
                            <div className="flex flex-col flex-1 overflow-auto w-full">
                                <div className="flex flex-col h-full overflow-auto w-full">
                                    <div className="w-full border-t h-full scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400">
                                        <ul className="flex-0 w-full h-full scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400  overflow-auto">
                                            {productsLoading ? (
                                                <Loader />
                                            ) : (
                                                productPerBundle &&
                                                productPerBundle.length > 0 &&
                                                productPerBundle.map(
                                                    (eachPackage) => {
                                                        return (
                                                            <li
                                                                className={`border-b border-l-6 border-l-gold`}
                                                            >
                                                                <Link
                                                                    to="#"
                                                                    className="block hover:bg-gray-50"
                                                                >
                                                                    <div className="flex items-center px-4 py-4 sm:px-6">
                                                                        <div className="min-w-0 flex-1 flex">
                                                                            <div className="min-w-0 flex-1 px-2 md:grid md:grid-cols-2 md:gap-4 items-center">
                                                                                <div className="flex flex-col items-start">
                                                                                    <div className="flex flex-col text-xs text-gray-500 italic">
                                                                                        {eachPackage
                                                                                            .node
                                                                                            .category &&
                                                                                            eachPackage
                                                                                                .node
                                                                                                .category
                                                                                                .name}
                                                                                    </div>
                                                                                    <div className="group relative   flex justify-between items-center">
                                                                                        <p className="text-sm font-semibold text-gray-500">
                                                                                            <Link
                                                                                                to="#"
                                                                                                className="  focus:outline-none"
                                                                                            >
                                                                                                <span
                                                                                                    className="absolute inset-0"
                                                                                                    aria-hidden="true"
                                                                                                ></span>
                                                                                                {eachPackage
                                                                                                    ?.node
                                                                                                    ?.bbg_product_code
                                                                                                    ? eachPackage
                                                                                                        ?.node
                                                                                                        ?.bbg_product_code +
                                                                                                    " - "
                                                                                                    : ""}
                                                                                                {
                                                                                                    eachPackage
                                                                                                        .node
                                                                                                        .name
                                                                                                }
                                                                                            </Link>
                                                                                        </p>
                                                                                    </div>
                                                                                    <div className=" flex flex-col text-xs text-gray-500">
                                                                                        {eachPackage.node &&
                                                                                            eachPackage
                                                                                                .node
                                                                                                .programs &&
                                                                                            eachPackage
                                                                                                .node
                                                                                                .programs
                                                                                                .edges
                                                                                                .length >
                                                                                            0 &&
                                                                                            eachPackage.node.programs.edges.map(
                                                                                                (
                                                                                                    item
                                                                                                ) => {
                                                                                                    return (
                                                                                                        <div className="flex flex-col">
                                                                                                            <span className="">
                                                                                                                {
                                                                                                                    item
                                                                                                                        .node
                                                                                                                        .name
                                                                                                                }
                                                                                                            </span>
                                                                                                        </div>
                                                                                                    );
                                                                                                }
                                                                                            )}
                                                                                    </div>
                                                                                </div>

                                                                                <div className="flex flex-col">
                                                                                    {eachPackage
                                                                                        ?.node
                                                                                        ?.require_quantity_reporting ? (
                                                                                        <>
                                                                                            <input
                                                                                                value={
                                                                                                    fields &&
                                                                                                        fields?.[
                                                                                                        eachPackage
                                                                                                            ?.node
                                                                                                            ?.id
                                                                                                        ]
                                                                                                        ? fields[
                                                                                                        eachPackage
                                                                                                            ?.node
                                                                                                            ?.id
                                                                                                        ]
                                                                                                        : edit
                                                                                                            ? fields?.[
                                                                                                            eachPackage
                                                                                                                .node
                                                                                                                .id
                                                                                                            ]
                                                                                                            : eachPackage
                                                                                                                ?.node
                                                                                                                ?.bundlePivot &&
                                                                                                            eachPackage
                                                                                                                ?.node
                                                                                                                ?.bundlePivot
                                                                                                                ?.product_quantity
                                                                                                }
                                                                                                type="number"
                                                                                                onChange={(
                                                                                                    e
                                                                                                ) => {
                                                                                                    handleQuantityChange(
                                                                                                        eachPackage,
                                                                                                        e
                                                                                                    );
                                                                                                }}
                                                                                                name="productQuantity"
                                                                                                id="productQuantity"
                                                                                                autoComplete="productQuantity"
                                                                                                placeholder="Qty"
                                                                                                className={` ${error?.[
                                                                                                    eachPackage
                                                                                                        ?.node
                                                                                                        ?.id
                                                                                                ]
                                                                                                    ? "input-error focus:border-brickRed border-brickRed"
                                                                                                    : "focus:border-secondary border-secondary"
                                                                                                    } w-12 my-2 rounded-lg rounded-b-none min-w-0 sm:text-sm border-0 border-b-2 border-gray-400  outline-none focus:outline-none focus:ring-0`}
                                                                                            />

                                                                                            {error?.[
                                                                                                eachPackage
                                                                                                    ?.node
                                                                                                    ?.id
                                                                                            ] ? (
                                                                                                <p className=" self-start  mb-1 text-sm text-brickRed font-medium">
                                                                                                    {eachPackage
                                                                                                        ?.node
                                                                                                        ?.minimum_unit ===
                                                                                                        1
                                                                                                        ? "Quantity can not be empty"
                                                                                                        : eachPackage
                                                                                                            ?.node
                                                                                                            ?.require_quantity_reporting &&
                                                                                                            eachPackage
                                                                                                                ?.node
                                                                                                                ?.minimum_unit <
                                                                                                            1
                                                                                                            ? "Quantity can not be empty "
                                                                                                            : "Quantity can not be less than " +
                                                                                                            eachPackage
                                                                                                                ?.node
                                                                                                                ?.minimum_unit}
                                                                                                </p>
                                                                                            ) : null}
                                                                                        </>
                                                                                    ) : eachPackage
                                                                                        ?.node
                                                                                        ?.minimum_unit ? (
                                                                                        <p className="text-sm text-secondary">
                                                                                            Qty:{" "}
                                                                                            {eachPackage?.node?.minimum_unit?.toLocaleString()}
                                                                                        </p>
                                                                                    ) : null}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        {products?.bundle?.products?.edges?.findIndex(
                                                                            (
                                                                                element
                                                                            ) =>
                                                                                element
                                                                                    ?.node
                                                                                    ?.id ===
                                                                                eachPackage
                                                                                    ?.node
                                                                                    ?.id
                                                                        ) !==
                                                                            -1 ? (
                                                                            <div
                                                                                onClick={async () => {
                                                                                    await removeFromBundle(
                                                                                        eachPackage
                                                                                            .node
                                                                                            .id
                                                                                    );
                                                                                    updateBundle();
                                                                                }}
                                                                            >
                                                                                <XCircleIcon className="w-8 h-8 text-brickRed" />
                                                                            </div>
                                                                        ) : (
                                                                            <div
                                                                                onClick={async () => {
                                                                                    await removeFromBundle(
                                                                                        eachPackage
                                                                                            .node
                                                                                            .id
                                                                                    );
                                                                                }}
                                                                            >
                                                                                <XCircleIcon className="w-8 h-8 text-brickRed" />
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </Link>
                                                            </li>
                                                        );
                                                    }
                                                )
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            {edit ? (
                                <div className="p-4 flex flex-col items-end justify-end">
                                    <Button
                                        disabled={isError()}
                                        color="primary"
                                        title={
                                            updateBundleLoading
                                                ? "Saving Updates"
                                                : "Save Updates"
                                        }
                                        onClick={() => {
                                            updateBundle();
                                        }}
                                    />
                                </div>
                            ) : (
                                <div className="p-4 flex flex-col items-end justify-end">
                                    <Link
                                        to={{
                                            pathname: "/reporting/assignment",
                                            state: { tab: "assignment" },
                                        }}
                                        className=" font-title text-secondary focus:outline-none"
                                    >
                                        Go to: Product Assignments
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Bundles;