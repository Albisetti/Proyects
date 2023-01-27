import { useLazyQuery, useMutation } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import { BATCH_CORRECTION, GET_PERIODS_LIST, GET_PROPERTIES_FOR_BATCH_CORRECTION } from "../../../lib/claims";
import { FETCH_ORGANIZATIONS_QUERY, FETCH_SINGLE_ORGANIZATION_FOR_BATCH } from "../../../lib/organization";
import Button from "../../Buttons";
import CommonSelect from "../../Select";
import BatchCorrectionSubdivisionAccordion from "./BatchCorrectionSubdivisionAccordion";
import { APP_TITLE } from "../../../util/constants";

const BatchCorrection = () => {
    const [programParticipants, setProgramParticipants] = useState([]);
    const [selectProducts, setSelectProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState();
    const [periodsList, setPeriodsList] = useState([]);
    const [selectedPeriod, setSelectedPeriod] = useState();
    const [houseList, setHouseList] = useState();
    const [activeAddresses, setActiveAddresses] = useState([]);
    const [correction, setCorrection] = useState();
    const [allProducts, setAllProducts] = useState();
    const [newSelectedProduct, setNewSelectedProduct] = useState();
    const [productQuantity, setProductQuantity] = useState();
    const [productsNode, setProductsNode] = useState();
    const [selectedProductNode, setSelectedProductNode] = useState();
    const [newSelectedProductNode, setNewSelectedProductNode] = useState();
    const [newProductType, setNewProductType] = useState();
    const [allProductsNodes, setAllProductsNodes] = useState();
    const [productType, setProductType] = useState();
    const [error, setError] = useState();
    const [newError, setNewError] = useState();

    useEffect(() => {
        getOrganizations();
        // eslint-disable-next-line
    }, []);

    const [getOrganizations, { data: organizations }] = useLazyQuery(FETCH_ORGANIZATIONS_QUERY, {
        variables: {
            organization_type: ["BUILDERS"],
            first: 200000,
        },
        fetchPolicy: "cache-and-network",
        notifyOnNetworkStatusChange: false,
    });

    const [getSingleOrganization] = useLazyQuery(FETCH_SINGLE_ORGANIZATION_FOR_BATCH, {
        variables: {
            id: programParticipants?.value,
        },
        fetchPolicy: "cache-and-network",
        notifyOnNetworkStatusChange: false,
        onCompleted: (result) => {
            setSelectedProduct({});
            setSelectedPeriod({});
            setActiveAddresses([]);
            setProductQuantity("");
            setCorrection("");
            normalizedData(result);
        },
    });

    useEffect(() => {
        if (selectedProduct?.value) {
            getPeriods();
        }
        // eslint-disable-next-line
    }, [selectedProduct]);

    const [getPeriods] = useLazyQuery(GET_PERIODS_LIST, {
        variables: {
            ids: selectedProduct?.value?.values,
        },
        fetchPolicy: "cache-and-network",
        notifyOnNetworkStatusChange: false,
        onCompleted: (result) => {
            normalizePeriods(result);
        },
    });

    useEffect(() => {
        if (selectedPeriod?.value?.claim_start_date && selectedPeriod?.value?.claim_end_date) {
            getProperties();
        }
        // eslint-disable-next-line
    }, [selectedPeriod]);

    const [getProperties] = useLazyQuery(GET_PROPERTIES_FOR_BATCH_CORRECTION, {
        variables: {
            orgId: programParticipants?.value,
            productId: selectedProduct?.value?.productId,
            startDate:
                selectedPeriod?.value?.claim_start_date &&
                new Date(selectedPeriod?.value?.claim_start_date)?.toISOString()?.substr(0, 10),
            endDate:
                selectedPeriod?.value?.claim_end_date &&
                new Date(selectedPeriod?.value?.claim_end_date)?.toISOString()?.substr(0, 10),
        },
        fetchPolicy: "cache-and-network",
        notifyOnNetworkStatusChange: false,
        onCompleted: (result) => {
            setHouseList(result?.getPropertyForBatchCorrection);
        },
    });

    const handleAccordianSubdivisionAddresses = (node, checked) => {
        let newAddresses = [];
        if (!checked) {
            node?.forEach((item) => {
                if (activeAddresses?.findIndex((element) => element?.id === item?.house?.id) < 0) {
                    let object = {};
                    object.name = item?.house?.address;
                    object.id = item?.house?.id;
                    object.subdivisionName = item?.house?.subdivision?.name;
                    object.subdivisionId = item?.house?.subdivision?.id;
                    object.rebateId = item?.rebate?.id;
                    newAddresses.push({ ...object });
                }
            });
            setActiveAddresses([...activeAddresses, ...newAddresses]);
        }

        if (checked) {
            node?.forEach((item) => {
                let object = {};
                object.name = item?.house?.address;
                object.id = item?.house?.id;
                object.subdivisionName = item?.house?.subdivision?.name;
                object.subdivisionId = item?.house?.subdivision?.id;
                object.rebateId = item?.rebate?.id;
                newAddresses.push({ ...object });
            });
            let newArray = activeAddresses.filter((el) => !newAddresses.find((rm) => rm.id === el.id));
            setActiveAddresses(newArray);
        }
    };

    const [batchCorrection] = useMutation(BATCH_CORRECTION, {
        variables: {
            org_id: programParticipants?.value,
            rebates: activeAddresses?.map((item) => item?.rebateId),
            action: correction,
            qty: productQuantity ? parseInt(productQuantity) : undefined,
            newProduct: newSelectedProduct?.value,
        },
        update(cache, result) {
            if (result.errors) {
                toast.error(result.errors[0].message);
            } else {
                toast.success("Batch Correction Applied!");
                getSingleOrganization();
            }
        },
    });

    const correctionBoolChange = (e) => {
        setCorrection(e.target.value);
    };

    const handleAccordianEachAddress = (node) => {
        if (activeAddresses?.findIndex((element) => element?.id === node?.house?.id) > -1) {
            setActiveAddresses(activeAddresses.filter((item) => item.id !== node?.house?.id));
        } else {
            setActiveAddresses(() => [
                ...activeAddresses,
                {
                    ...node?.house,
                    rebateId: node?.rebate?.id,
                    subdivisionName: node?.subdivisionName,
                    subdivisionId: node?.subdivisionId,
                },
            ]);
        }
    };

    const getMonth = (startDate, endDate) => {
        var month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return (
            startDate?.getDate() +
            ", " +
            month[startDate.getMonth()] +
            " " +
            startDate.getFullYear() +
            " - " +
            endDate?.getDate() +
            ", " +
            month[endDate.getMonth()] +
            " " +
            endDate.getFullYear()
        );
    };

    const normalizePeriods = (data) => {
        let claimPeriods = [];
        data?.getPeriodsListFromClaims?.forEach((item) => {
            let object = {};
            let outerObject = {};
            object.name = getMonth(new Date(item?.claim_start_date), new Date(item?.claim_end_date));
            object.id = {
                claim_start_date: item?.claim_start_date,
                claim_end_date: item?.claim_end_date,
            };
            outerObject.node = object;
            claimPeriods.push(outerObject);
        });

        setPeriodsList(claimPeriods);
    };

    const normalizedData = (data) => {
        let getProductsClaims = [];
        let nodes = [];
        data?.organization?.getUsedOpenProductList?.forEach((item) => {
            if (item?.product?.bbg_product_code && item?.product?.name) {
                let outObject = {};
                let object = {};
                let anotherObject = {};
                object.name = item?.product?.bbg_product_code + " " + item?.product?.name;
                let values = item?.claims?.map((insideItem) => insideItem?.id);
                object.id = { values: values, productId: item?.product?.id };
                anotherObject = { ...item?.product };
                nodes.push(anotherObject);
                outObject.node = object;
                getProductsClaims.push(outObject);
            }
        });

        setProductsNode(nodes);
        let products = [];
        let productsNodes = [];
        let productIds = [];
        data?.organization?.programs?.edges?.forEach((item) => {
            item?.node?.products?.edges?.forEach((insideItem) => {
                if (!productIds.includes(insideItem?.node?.id)) {
                    let object = {};
                    let outObject = {};
                    object.name = insideItem?.node?.bbg_product_code + " " + insideItem?.node?.name;
                    object.id = insideItem?.node?.id;
                    outObject.node = object;
                    products.push(outObject);
                    productsNodes.push({ ...insideItem });
                    productIds.push(insideItem?.node?.id);
                }
            });
        });
        setAllProductsNodes(productsNodes);
        setAllProducts(products);
        setSelectProducts(getProductsClaims);
    };

    useEffect(() => {
        if (programParticipants?.value) {
            getSingleOrganization();
        }
        // eslint-disable-next-line
    }, [programParticipants]);

    const participants = (e) => {
        let object = {};
        object.value = e.value;
        object.label = e.label;
        setProgramParticipants(object);
        setSelectedProductNode({});
        setProductType("");
        setNewProductType("");
        setNewSelectedProductNode({});
    };

    const productSelection = (e) => {
        let object = {};
        object.value = e.value;
        object.label = e.label;
        let value = productsNode?.find((element) => element?.id === e.value?.productId);
        setSelectedProductNode(value);
        setSelectedProduct(object);
    };

    const newProductSelection = (e) => {
        let object = {};
        object.value = e.value;
        object.label = e.label;
        let value = allProductsNodes?.find((element) => element?.id === e.value?.productId);
        setNewSelectedProductNode(value?.node);
        setNewSelectedProduct(object);
    };

    const periodSelection = (e) => {
        let object = {};
        object.value = e.value;
        object.label = e.label;
        setSelectedPeriod(object);
    };

    const rebateUnitOptions = [
        { name: "REMOVE", label: `Remove ${selectedProduct?.label}` },
        { name: "CHANGE_QTY", label: "Change Quantity" },
        { name: "REPLACE", label: "Replace Product" },
    ];

    useEffect(() => {
        let types = selectedProductNode?.programs?.edges?.map((item) => item?.node?.type);

        if (types?.includes("FACTORY") && types?.includes("VOLUME")) {
            setProductType("BOTH");
        } else if (types?.includes("FACTORY") && !types?.includes("VOLUME")) {
            setProductType("FACTORY");
        } else if (!types?.includes("FACTORY") && types?.includes("VOLUME")) {
            setProductType("VOLUME");
        }
    }, [selectedProductNode]);

    useEffect(() => {
        if (
            productQuantity < selectedProductNode?.minimum_unit &&
            selectedProductNode?.minimum_unit !== null &&
            selectedProductNode?.require_quantity_reporting &&
            productType !== "VOLUME" &&
            correction === "CHANGE_QTY"
        ) {
            setError(true);
        } else if (
            !productQuantity &&
            selectedProductNode &&
            selectedProductNode?.minimum_unit !== null &&
            selectedProductNode?.require_quantity_reporting &&
            productType !== "VOLUME" &&
            correction === "CHANGE_QTY"
        ) {
            setError(true);
        } else if (
            selectedProductNode?.require_quantity_reporting &&
            !productQuantity &&
            productType !== "VOLUME" &&
            correction === "CHANGE_QTY"
        ) {
            setError(true);
        } else {
            setError(false);
        }

        // eslint-disable-next-line
    }, [productQuantity, selectedProductNode, correction]);

    useEffect(() => {
        let types = newSelectedProductNode?.programs?.edges?.map((item) => item?.node?.type);

        if (types?.includes("FACTORY") && types?.includes("VOLUME")) {
            setNewProductType("BOTH");
        } else if (types?.includes("FACTORY") && !types?.includes("VOLUME")) {
            setNewProductType("FACTORY");
        } else if (!types?.includes("FACTORY") && types?.includes("VOLUME")) {
            setNewProductType("VOLUME");
        }
    }, [newSelectedProductNode]);

    useEffect(() => {
        if (
            productQuantity < newSelectedProductNode?.minimum_unit &&
            newSelectedProductNode?.minimum_unit !== null &&
            newSelectedProductNode?.require_quantity_reporting &&
            newProductType !== "VOLUME" &&
            correction === "REPLACE"
        ) {
            setNewError(true);
        } else if (
            !productQuantity &&
            newSelectedProductNode &&
            newSelectedProductNode?.minimum_unit !== null &&
            newSelectedProductNode?.require_quantity_reporting &&
            newProductType !== "VOLUME" &&
            correction === "REPLACE"
        ) {
            setNewError(true);
        } else if (
            newSelectedProductNode?.require_quantity_reporting &&
            !productQuantity &&
            newProductType !== "VOLUME" &&
            correction === "REPLACE"
        ) {
            setNewError(true);
        } else {
            setNewError(false);
        }

        // eslint-disable-next-line
    }, [productQuantity, newSelectedProductNode, correction]);

    return (
        <div className="min-h-smallMin  max-w-8xl flex flex-col gap-5 h-full ">
            <Helmet>
                <meta charSet="utf-8" />
                <title>{APP_TITLE} - Batch Corrections</title>
            </Helmet>
            <div className="flex space-x-5 mt-5  overflow-hidden" style={{ minHeight: "79vh", maxHeight: "79vh" }}>
                <div className="bg-white border w-full max-w-xs rounded-lg  ">
                    <div className="inset-0    h-full flex flex-col">
                        <div className="flex justify-between w-full px-4 border-b  items-center">
                            <div className="font-title  py-4 text-center h2">Select</div>
                        </div>

                        <div className="flex  scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400 w-full h-full">
                            <div className="w-full  scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400">
                                <div className="mt-2 flex flex-col px-4">
                                    <span className="ml-2 text-sm  text-secondary">Select Builder</span>
                                    <CommonSelect
                                        // eslint-disable-next-line
                                        value={programParticipants}
                                        options={organizations?.organizations?.edges
                                            ?.map(
                                                (
                                                    item
                                                    // eslint-disable-next-line
                                                ) => {
                                                    if (item.node.organization_type === "BUILDERS") {
                                                        return item;
                                                    }
                                                }
                                            )
                                            .filter((element) => element !== undefined)}
                                        className="col-span-1 lg:w-full"
                                        from="createProgram"
                                        placeHolder="Builders"
                                        menuPlacement={"bottom"}
                                        onChange={(e) => {
                                            participants(e);
                                        }}
                                    />
                                </div>
                                {programParticipants?.value ? (
                                    <div className="mt-5 flex flex-col px-4">
                                        <span className="ml-2 text-sm  text-secondary">Select Product</span>
                                        <CommonSelect
                                            noOptionsMessage="No Products Found"
                                            value={selectedProduct}
                                            options={{ edges: selectProducts }}
                                            className="col-span-1 lg:w-full"
                                            placeHolder="Products"
                                            menuPlacement={"bottom"}
                                            onChange={(e) => {
                                                productSelection(e);
                                            }}
                                        />
                                    </div>
                                ) : null}

                                {selectedProduct?.value ? (
                                    <div className="mt-5 flex flex-col px-4">
                                        <span className="ml-2 text-sm  text-secondary">Select Period</span>
                                        <CommonSelect
                                            noOptionsMessage="No Periods Found"
                                            value={selectedPeriod}
                                            options={{ edges: periodsList }}
                                            className="col-span-1 lg:w-full"
                                            from="createProgram"
                                            placeHolder="Periods"
                                            menuPlacement={"bottom"}
                                            onChange={(e) => {
                                                periodSelection(e);
                                            }}
                                        />
                                    </div>
                                ) : null}

                                {selectedProduct?.value && periodsList && periodsList?.length === 0 ? (
                                    <div className="mt-2 flex justify-center">
                                        <Button
                                            title="Search Properties"
                                            color="secondary"
                                            onClick={() => getProperties()}
                                        />
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white border w-full  2xl:max-w-md  rounded-lg  ">
                    <div className="h-full relative   lg:pr-0 xl:pr-3 2xl:pr-0">
                        <div className="h-full flex flex-col scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400 overflow-y-scroll">
                            <div className="flex px-4 flex-col md:flex-row justify-between items-center border-b">
                                <p className="font-title  py-4 text-center h2">Select Properties</p>
                            </div>
                            {selectedProduct?.value ? (
                                <BatchCorrectionSubdivisionAccordion
                                    handleAccordianSubdivisionAddresses={(node, checked) =>
                                        handleAccordianSubdivisionAddresses(node, checked)
                                    }
                                    handleAccordianEachAddress={(node) => handleAccordianEachAddress(node)}
                                    activeAddresses={activeAddresses}
                                    Data={houseList ? houseList : null}
                                />
                            ) : null}
                        </div>
                    </div>
                </div>

                <div className="bg-white border  w-full rounded-lg">
                    <div className="h-full relative   lg:pr-0 xl:pr-3 2xl:pr-0">
                        <div className="h-full flex flex-col">
                            <div className="flex px-4 flex-col md:flex-row justify-between items-center border-b">
                                <div className=" font-title  py-4 text-center h2 ">Define Correction</div>
                            </div>
                            {activeAddresses?.length > 0 ? (
                                <>
                                    <div className=" px-4 sm:grid sm:grid-cols-2 items-start justify-between py-3 sm:items-center w-full">
                                        <div className="flex space-x-5 col-span-2 items-center">
                                            <div className="block text-secondary font-sm font-medium">
                                                Select Type of Correction
                                            </div>
                                            <div className=" flex space-x-4">
                                                {rebateUnitOptions.map((item, index) => {
                                                    if (
                                                        (item?.name === "CHANGE_QTY" &&
                                                            !selectedProductNode?.require_quantity_reporting) ||
                                                        (productType === "VOLUME" && item?.name === "CHANGE_QTY")
                                                    ) {
                                                        // eslint-disable-next-line
                                                        return;
                                                    } else {
                                                        return (
                                                            <div className="mt-2" key={index}>
                                                                <label className="inline-flex items-center ">
                                                                    <input
                                                                        type="radio"
                                                                        name={item.name}
                                                                        value={item.name}
                                                                        className="form-radio h-5 w-5 text-secondary focus:ring-secondary"
                                                                        checked={correction === item.name}
                                                                        onChange={correctionBoolChange}
                                                                    ></input>
                                                                    <span className="ml-2 text-sm  text-secondary">
                                                                        {item.label}
                                                                    </span>
                                                                </label>
                                                            </div>
                                                        );
                                                    }
                                                })}
                                            </div>
                                        </div>

                                        {correction === "REPLACE" ? (
                                            <div className="mt-5 flex flex-col pr-4">
                                                <CommonSelect
                                                    noOptionsMessage="No Products Found"
                                                    value={newSelectedProduct}
                                                    options={{
                                                        edges: allProducts,
                                                    }}
                                                    className="col-span-1 lg:w-full"
                                                    placeHolder="New Product"
                                                    menuPlacement={"bottom"}
                                                    onChange={(e) => {
                                                        newProductSelection(e);
                                                    }}
                                                />
                                            </div>
                                        ) : null}
                                        {(correction === "CHANGE_QTY" &&
                                            selectedProductNode?.require_quantity_reporting &&
                                            productType !== "VOLUME") ||
                                        (correction === "REPLACE" &&
                                            newSelectedProductNode?.require_quantity_reporting &&
                                            newProductType !== "VOLUME") ? (
                                            <div
                                                className={
                                                    correction === "REPLACE"
                                                        ? "hidden"
                                                        : "flex space-x-5 items-center mt-5"
                                                }
                                            >
                                                <label
                                                    htmlFor="product_quantity"
                                                    className="text-secondary font-medium"
                                                >
                                                    New Quantity
                                                </label>
                                                <input
                                                    type="number"
                                                    name="product_quantity"
                                                    id="product_quantity"
                                                    placeholder="Qty"
                                                    value={productQuantity}
                                                    onChange={(e) => setProductQuantity(e.target.value)}
                                                    className={`${
                                                        error
                                                            ? "input-error focus:border-brickRed border-brickRed"
                                                            : "focus:border-secondary border-secondary"
                                                    } w-12 my-2 rounded-lg rounded-b-none min-w-0 sm:text-sm border-0 border-b-2 border-gray-400  outline-none focus:outline-none focus:ring-0`}
                                                />
                                                {error ? (
                                                    <p className=" self-end  mb-1 text-sm text-brickRed font-medium">
                                                        {selectedProductNode?.minimum_unit === 1
                                                            ? "Quantity can not be empty"
                                                            : selectedProductNode?.require_quantity_reporting &&
                                                              selectedProductNode?.minimum_unit < 1
                                                            ? "Quantity can not be empty "
                                                            : "Quantity can not be less than " +
                                                              selectedProductNode?.minimum_unit}
                                                    </p>
                                                ) : newError ? (
                                                    <p className=" self-end  mb-1 text-sm text-brickRed font-medium">
                                                        {newSelectedProductNode?.minimum_unit === 1
                                                            ? "Quantity can not be empty"
                                                            : newSelectedProductNode?.require_quantity_reporting &&
                                                              newSelectedProductNode?.minimum_unit < 1
                                                            ? "Quantity can not be empty "
                                                            : "Quantity can not be less than " +
                                                              newSelectedProductNode?.minimum_unit}
                                                    </p>
                                                ) : null}
                                            </div>
                                        ) : null}
                                    </div>
                                    {correction ? (
                                        <div className="flex px-2 ">
                                            <Button
                                                title="Apply"
                                                disabled={
                                                    correction === "REPLACE"
                                                        ? false
                                                        : correction === "CHANGE_QTY"
                                                        ? error
                                                        : newError
                                                }
                                                color="secondary"
                                                onClick={() => batchCorrection()}
                                            />
                                        </div>
                                    ) : null}
                                </>
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BatchCorrection;
