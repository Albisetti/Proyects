import { useMutation, useQuery, useLazyQuery } from "@apollo/client";
import { PlusCircleIcon, XCircleIcon } from "@heroicons/react/solid";
import Modal from "../../../Modal";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FETCH_ORGANIZATIONS_QUERY } from "../../../../lib/organization";
import {
    UPDATE_PROGRAM,
    GET_PROGRAM_PRODUCT_PRICING_HISTORY,
    GET_PROGRAM_PRODUCT_ORGANIZATION_PRICING_HISTORY,
} from "../../../../lib/programs";
import Button from "../../../Buttons";
import TextField from "../../../FormGroups/Input";
import CommonSelect from "../../../Select";
import { APP_TITLE } from "../../../../util/constants";

const ClaimsTemplate = ({ id, program, callBack, refetch }) => {
    const [rebateOption, setRebateOption] = useState("byProgram");
    const [showPricingModal, setShowPricingModal] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [fields, setFields] = useState({
        volume_bbg_rebate: "",
    });
    const [programParticipants, setProgramParticipants] = useState({});
    const [programCustomParticipants, setProgramCustomParticipants] = useState({});
    const [nullReactSelect, setNullReactSelect] = useState(false);
    const [customBuilderNumber, setCustomBuilderNumber] = useState(0);
    const [showSelection, setShowSelection] = useState();
    const [programIdForPricingHistoryQuery, setProgramIdForPricingHistoryQuery] = useState(id);
    const [productProgramIdForPricingHistoryQuery, setProductProgramIdForPricingHistoryQuery] = useState(null);
    const [
        productAndOrganizationIdForPricingHistoryQuery,
        setProductAndOrganizationIdForPricingHistoryQuery,
    ] = useState(null);
    const [remove, setRemove] = useState();
    const [disabled, setDisabled] = useState();

    const rebateCalculationOptions = [
        { name: "byProgram", label: "By Program (all Products)" },
        { name: "byProduct", label: "Per Product" },
    ];

    const handleRebateOptionChange = (event) => {
        setCustomBuilderNumber(0);
        setRebateOption(event.target.value);
    };

    useEffect(() => {
        setFields({
            ...fields,
            volume_bbg_rebate: program?.volume_bbg_rebate,
        });
        setProgramIdForPricingHistoryQuery(program?.id);
        // eslint-disable-next-line
    }, [program]);

    useEffect(() => {
        if (remove === true) {
            handleMutation();
        }
        // eslint-disable-next-line
    }, [remove]);

    const removeFromSelected = (id) => {
        setSelectedProducts(selectedProducts.filter((item) => item !== id));
    };

    const addProduct = (id) => {
        if (!selectedProducts.includes(id)) {
            setSelectedProducts([...selectedProducts, id]);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFields({
            ...fields,
            [name]: value,
        });
    };

    const { data: organizations } = useQuery(FETCH_ORGANIZATIONS_QUERY, {
        variables: {
            organization_type: ["BUILDERS"],
            first: 200000,
        },
        fetchPolicy: "network-only",
        nextFetchPolicy: "network-only",
    });

    const [
        getProgramProductPricingHistory,
        { data: programProductPricingHistory, loading: programProductPricingHistoryLoading },
    ] = useLazyQuery(GET_PROGRAM_PRODUCT_PRICING_HISTORY, {
        variables: {
            program_id: programIdForPricingHistoryQuery,
            product_id: productProgramIdForPricingHistoryQuery,
        },
        onCompleted() {
            setShowPricingModal(true);
        },
        fetchPolicy: "no-cache",
    });

    const [
        getProgramProductOrganizationPricingHistory,
        { data: programProductOrganizationPricingHistory, loading: programProductOrganizationPricingHistoryLoading },
    ] = useLazyQuery(GET_PROGRAM_PRODUCT_ORGANIZATION_PRICING_HISTORY, {
        variables: {
            id: programIdForPricingHistoryQuery,
            organization_id: productAndOrganizationIdForPricingHistoryQuery
                ? productAndOrganizationIdForPricingHistoryQuery[0]
                : null,
            product_id: productAndOrganizationIdForPricingHistoryQuery
                ? productAndOrganizationIdForPricingHistoryQuery[1]
                : null,
        },
        onCompleted() {
            setShowPricingModal(true);
        },
        fetchPolicy: "no-cache",
    });

    const [updateProgram] = useMutation(UPDATE_PROGRAM, {
        variables: {
            id: program?.id,
            volume_bbg_rebate: remove === true ? null : parseFloat(fields?.volume_bbg_rebate),
            customParticipantsRebateProgram:
                remove === true
                    ? programParticipants &&
                      Object.values(programParticipants).map((item) => {
                          let object = {};
                          object.id = item?.value;
                          object.volume_bbg_rebate = null;
                          return object;
                      })
                    : programParticipants &&
                      Object.values(programParticipants).map((item) => {
                          let object = {};
                          object.id = item?.value;
                          object.volume_bbg_rebate = item?.volume_bbg_rebate;
                          return object;
                      }),
            create_pricing_array:
                remove === true
                    ? null
                    : programParticipants &&
                      Object.values(programParticipants)
                          .map((item) => {
                              let object = {};
                              object.relation_model_2 = "ORGANIZATION";
                              object.relation_id_2 = item?.value;
                              object.volume_bbg_rebate = item?.volume_bbg_rebate;
                              return object;
                          })
                          .concat([
                              {
                                  volume_bbg_rebate: remove === true ? null : parseFloat(fields?.volume_bbg_rebate),
                              },
                          ]),
        },
        update(cache, result) {
            delete Object.assign(result.data, {
                node: result.data["updateProgram"],
            })["updateProgram"];

            setFields({
                ...fields,
                volume_bbg_rebate: null,
            });
            setProgramParticipants({});
            setShowSelection(false);
            setSelectedProducts([]);
            callBack(result?.data?.node);
            if (remove === true) {
                toast.success("Template removed.");
            } else {
                toast.success("Template saved!");
            }
            setRemove(false);
        },
    });

    const handleMutation = () => {
        if (rebateOption === "byProgram") {
            updateProgram();
        } else if (rebateOption === "byProduct") {
            updateProgramProduct();
        }
    };

    const modifyObject = () => {
        let programParticipants = programCustomParticipants && Object.values(programCustomParticipants);
        let finalArray = programParticipants?.map((item) => {
            let object = {};
            let productArray = [];
            object.id = item?.value;
            // eslint-disable-next-line
            selectedProducts?.map((insideItem) => {
                let productProgramRebateObject = {};
                productProgramRebateObject.id = parseInt(insideItem);
                productProgramRebateObject.program_id = parseInt(program?.id);
                productProgramRebateObject.volume_bbg_rebate = parseFloat(item?.volume_bbg_rebate);
                productArray.push(productProgramRebateObject);
            });
            object.customProducts = {
                syncWithoutDetaching: productArray,
            };
            return object;
        });

        return finalArray;
    };

    const modifyRemoveObject = () => {
        let programParticipants = programCustomParticipants && Object.values(programCustomParticipants);
        let finalArray = programParticipants?.map((item) => {
            let object = {};
            let productArray = [];
            object.id = item?.value;
            // eslint-disable-next-line
            selectedProducts?.map((insideItem) => {
                let productProgramRebateObject = {};
                productProgramRebateObject.id = parseInt(insideItem);
                productProgramRebateObject.program_id = parseInt(program?.id);
                productProgramRebateObject.volume_bbg_rebate = null;
                productArray.push(productProgramRebateObject);
            });
            object.customProducts = {
                syncWithoutDetaching: productArray,
            };
            return object;
        });

        return finalArray;
    };

    const generatePricingArray = () => {
        let pricingArray = [];
        let objectProduct = {};
        selectedProducts.forEach((item) => {
            objectProduct.relation_model_2 = "PRODUCT";
            if (item?.id) {
                objectProduct.relation_id_2 = item?.id;
            } else {
                objectProduct.relation_id_2 = item;
            }
            objectProduct.volume_bbg_rebate = parseFloat(fields?.product_bbg_volume_rebate);
            objectProduct.rebate_amount_type = "AMOUNT";
            pricingArray.push(objectProduct);
        });
        Object.entries(programCustomParticipants).forEach((item) => {
            return selectedProducts.forEach((product) => {
                let object = {};
                if (product?.id) {
                    object.relation_id_2 = product?.id;
                } else {
                    object.relation_id_2 = product;
                }
                object.relation_model_3 = "ORGANIZATION";
                object.relation_id_3 = item[1]?.value;
                object.relation_model_2 = "PRODUCT";
                object.volume_bbg_rebate = parseFloat(item[1]?.volume_bbg_rebate);
                object.rebate_amount_type = "AMOUNT";
                pricingArray.push(object);
            });
        });
        return pricingArray;
    };

    const [updateProgramProduct] = useMutation(UPDATE_PROGRAM, {
        variables: {
            id: program?.id,
            productsRebate:
                remove === true
                    ? selectedProducts?.map((item) => {
                          let object = {};
                          if (item?.id) {
                              object.id = item?.id;
                          } else {
                              object.id = item;
                          }
                          object.volume_bbg_rebate = null;
                          return object;
                      })
                    : selectedProducts?.map((item) => {
                          let object = {};
                          if (item?.id) {
                              object.id = item?.id;
                          } else {
                              object.id = item;
                          }
                          object.volume_bbg_rebate = parseFloat(fields?.product_bbg_volume_rebate);
                          return object;
                      }),
            upsert: remove === true ? modifyRemoveObject() : modifyObject(),
            create_pricing_array:
                remove === true
                    ? null
                    : Object.entries(programCustomParticipants)?.length >= 0
                    ? generatePricingArray()
                    : selectedProducts?.map((item) => {
                          let object = {};
                          Object.entries(programCustomParticipants)?.forEach((programCustomParticipant) => {
                              object.relation_model_3 = "ORGANIZATION";
                              object.relation_id_3 = programCustomParticipant?.value;
                          });
                          object.relation_model_2 = "PRODUCT";
                          if (item?.id) {
                              object.relation_id_2 = item?.id;
                          } else {
                              object.relation_id_2 = item;
                          }
                          object.volume_bbg_rebate = parseFloat(fields?.product_bbg_volume_rebate);
                          object.rebate_amount_type = "AMOUNT";
                          return object;
                      }),
        },
        update(cache, result) {
            delete Object.assign(result.data, {
                node: result.data["updateProgram"],
            })["updateProgram"];
            setFields({
                ...fields,
                product_bbg_volume_rebate: null,
            });
            setShowSelection(false);
            setSelectedProducts([]);
            if (remove === true) {
                toast.success("Template removed.");
            } else {
                toast.success("Template saved!");
            }

            setRemove(false);
            callBack(result?.data?.node);
        },
    });

    const renderDynamicalCustomRebate = () => {
        let array = [];
        for (let index = 0; index < customBuilderNumber; index++) {
            array.push(
                <>
                    <CommonSelect
                        options={organizations?.organizations?.edges
                            // eslint-disable-next-line
                            ?.map((item) => {
                                if (item.node.organization_type === "BUILDERS") {
                                    if (Object.keys(programParticipants).length > 0) {
                                        for (let participant in programParticipants) {
                                            if (item.node.id !== programParticipants[participant]?.value) {
                                                return item;
                                            } else {
                                                return null;
                                            }
                                        }
                                    } else {
                                        return item;
                                    }
                                }
                            })
                            .filter((element) => element !== undefined)}
                        value={
                            rebateOption === "byProduct"
                                ? programCustomParticipants[index]
                                : {
                                      value: programParticipants[index]?.value,
                                      label: programParticipants[index]?.label,
                                  }
                        }
                        className="col-span-1 lg:w-60 py-1"
                        clean={nullReactSelect}
                        from="createProgram"
                        placeHolder="Builders"
                        menuPlacement={"top"}
                        onChange={(e) => {
                            if (rebateOption === "byProgram") {
                                participantsSelection(e, index);
                                setNullReactSelect(false);
                            } else if (rebateOption === "byProduct") {
                                participantsProgramsSelection(e, index);
                                setNullReactSelect(false);
                            }
                        }}
                    />
                    <div className="flex flex-row justify-between">
                        <TextField
                            parentClass="py-2 w-20"
                            id="volume_bbg_rebate"
                            value={
                                rebateOption === "byProduct"
                                    ? programCustomParticipants[index]?.volume_bbg_rebate
                                    : programParticipants[index]?.volume_bbg_rebate
                            }
                            onChange={(e) =>
                                rebateOption === "byProgram" ? participants(e, index) : participantsProgram(e, index)
                            }
                            isPercent
                            width={"w-20"}
                            className="w-20 pl-6"
                            name="volume_bbg_rebate"
                            placeholder="5"
                            type="number"
                        />
                        {rebateOption === "byProduct" ? (
                            <Button
                                color="secondary"
                                title={
                                    programProductOrganizationPricingHistoryLoading
                                        ? "Loading History"
                                        : "Pricing History"
                                }
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setProductAndOrganizationIdForPricingHistoryQuery([
                                        programCustomParticipants[index]?.value,
                                        selectedProducts[0]?.id,
                                    ]);
                                }}
                            />
                        ) : null}
                    </div>
                </>
            );
        }
        return array;
    };

    const participantsProgram = (e, i) => {
        if (programCustomParticipants) {
            setProgramCustomParticipants({
                ...programCustomParticipants,
                [i]: {
                    ...programCustomParticipants[i],
                    volume_bbg_rebate: parseFloat(e.target.value),
                },
            });
        } else {
            setProgramCustomParticipants({
                ...programCustomParticipants,
                [i]: {
                    volume_bbg_rebate: parseFloat(e.target.value),
                },
            });
        }
    };

    const participantsProgramsSelection = (e, i) => {
        if (programCustomParticipants) {
            setProgramCustomParticipants({
                ...programCustomParticipants,
                [i]: {
                    ...programCustomParticipants[i],
                    label: e.label,
                    value: e.value,
                },
            });
        } else {
            setProgramCustomParticipants({
                ...programCustomParticipants,
                [i]: {
                    label: e.label,
                    value: e.value,
                },
            });
        }
    };

    const participants = (e, i) => {
        if (programParticipants) {
            setProgramParticipants({
                ...programParticipants,
                [i]: {
                    ...programParticipants[i],
                    volume_bbg_rebate: parseFloat(e.target.value),
                },
            });
        } else {
            setProgramParticipants({
                ...programParticipants,
                [i]: {
                    volume_bbg_rebate: parseFloat(e.target.value),
                },
            });
        }
    };

    const participantsSelection = (e, i) => {
        if (programParticipants) {
            setProgramParticipants({
                ...programParticipants,
                [i]: {
                    ...programParticipants[i],
                    label: e.label,
                    value: e.value,
                },
            });
        } else {
            setProgramParticipants({
                ...programParticipants,
                [i]: {
                    label: e.label,
                    value: e.value,
                },
            });
        }
    };

    const handleAllProducts = () => {
        setRebateOption("byProgram");

        let outerObject = {};
        let array = program?.pivotDistinctPricings?.edges
            // eslint-disable-next-line
            ?.map((item) => {
                if (item?.node?.volume_bbg_rebate !== null) {
                    return item;
                }
            })
            .filter((element) => element !== undefined)
            // eslint-disable-next-line
            .map((item, index) => {
                let object = {};
                object = program?.participants?.edges?.map((participant) => {
                    if (participant?.node?.id === item?.node?.relation_id_2) {
                        object.value = participant?.node?.id;
                        object.volume_bbg_rebate = item?.node?.volume_bbg_rebate;
                        object.label = participant?.node?.name;
                        outerObject[index] = {
                            ...object,
                        };
                        return object;
                    } else {
                        return null;
                    }
                });
            });
        setCustomBuilderNumber(array.length);
        setProgramParticipants(outerObject);
    };

    const handleCustomProducts = (id) => {
        setRebateOption("byProduct");
        let outerObject = {};
        // eslint-disable-next-line

        let values = program?.products?.edges
            // eslint-disable-next-line
            ?.map((item) => {
                if (item?.node?.id === id) {
                    return item;
                }
            })
            .filter((element) => element !== undefined);

        let values1 = values?.map((eachPackage) => {
            return program?.participants?.edges?.map((item) => {
                let object = {};
                program?.trinaryDistinctPricings?.edges?.forEach((pivotPricing) => {
                    if (
                        pivotPricing?.node?.relation_id_2 === eachPackage?.node?.id &&
                        item?.node?.id === pivotPricing?.node?.relation_id_3
                    ) {
                        object.volume_bbg_rebate = pivotPricing?.node?.volume_bbg_rebate;
                        object.id = item?.node?.id;
                        object.name = item?.node?.name;
                    }
                });
                if (object && object.name) {
                    return object;
                } else {
                    return null;
                }
            });
        });
        let finalValues = values1[0]
            ?.filter((item) => item)
            ?.map((item, index) => {
                let object = {};
                object.value = item?.id;
                object.volume_bbg_rebate = item?.volume_bbg_rebate;
                object.label = item?.name;
                outerObject[index] = {
                    ...object,
                };

                return item;
            });

        setCustomBuilderNumber(finalValues?.length);
        setSelectedProducts([
            {
                id,
            },
        ]);
        setProgramCustomParticipants(outerObject);
    };

    let customProgramRebateExists = () => {
        let value = program?.pricings?.edges
            // eslint-disable-next-line
            ?.map((item) => {
                if (item?.node?.volume_bbg_rebate !== null) {
                    return item;
                }
            })
            .filter((element) => element !== undefined);
        return value;
    };

    const cleanStates = () => {
        setProgramParticipants({});
        setSelectedProducts(() => []);
        setCustomBuilderNumber(0);
        setProgramCustomParticipants({});
        setRebateOption("byProgram");
    };

    useEffect(() => {
        let disable1;

        if (rebateOption === "byProgram") {
            disable1 = fields?.volume_bbg_rebate === null || fields?.volume_bbg_rebate === "";
        } else {
            disable1 = fields?.product_bbg_volume_rebate === null || fields?.product_bbg_volume_rebate === "";
        }

        setDisabled(disable1);
        // eslint-disable-next-line
    }, [fields?.volume_bbg_rebate, fields?.product_bbg_volume_rebate]);

    useEffect(() => {
        if (productProgramIdForPricingHistoryQuery && productProgramIdForPricingHistoryQuery !== null) {
            getProgramProductPricingHistory();
        }
        // eslint-disable-next-line
    }, [productProgramIdForPricingHistoryQuery]);

    useEffect(() => {
        if (productAndOrganizationIdForPricingHistoryQuery?.length > 1) {
            getProgramProductOrganizationPricingHistory();
        }
        // eslint-disable-next-line
    }, [productAndOrganizationIdForPricingHistoryQuery]);

    const pricingModal = () => {
        return (
            <>
                <Modal
                    width={"lg"}
                    title={`Pricing History`}
                    Content={pricingContent()}
                    submitLabel="Close"
                    onSubmit={() => {
                        setShowPricingModal(false);
                        setProductProgramIdForPricingHistoryQuery(null);
                        setProductAndOrganizationIdForPricingHistoryQuery(null);
                    }}
                    onClose={() => {
                        setShowPricingModal(false);
                        setProductProgramIdForPricingHistoryQuery(null);
                        setProductAndOrganizationIdForPricingHistoryQuery(null);
                    }}
                    show={showPricingModal}
                />
            </>
        );
    };

    const pricingContent = () => {
        return (
            <table class="border-collapse table-auto w-full text-sm">
                <thead>
                    <tr>
                        <th class="border-b dark:border-slate-600 font-medium p-4 pt-0 pb-3 text-secondary text-center">
                            Volume BBG Rebate
                        </th>
                        <th class="border-b dark:border-slate-600 font-medium p-4 pt-0 pb-3 text-secondary text-center">
                            Updated At
                        </th>
                    </tr>
                </thead>
                <tbody class="bg-white dark:bg-slate-800">
                    {productAndOrganizationIdForPricingHistoryQuery
                        ? programProductOrganizationPricingHistory?.program?.specificTrinaryPricings?.edges?.map(
                              (pricing) => {
                                  return (
                                      <tr>
                                          <td class="border-t text-center text-secondary border-slate-100 dark:border-slate-700 p-4 text-slate-500 dark:text-slate-400">
                                              {pricing?.node?.volume_bbg_rebate ||
                                              pricing?.node?.volume_bbg_rebate === 0 ? (
                                                  pricing?.node?.volume_bbg_rebate
                                              ) : (
                                                  <p className="text-center text-placeHolder">Not set</p>
                                              )}
                                          </td>
                                          <td class="border-t text-center text-secondary border-slate-100 dark:border-slate-700 p-4 text-slate-500 dark:text-slate-400">
                                              {pricing?.node?.created_at}
                                          </td>
                                      </tr>
                                  );
                              }
                          )
                        : programProductPricingHistory?.program?.specificPivotPricings?.edges?.map((pricing) => {
                              return (
                                  <tr>
                                      <td class="border-t text-center text-secondary border-slate-100 dark:border-slate-700 p-4 text-slate-500 dark:text-slate-400">
                                          {pricing?.node?.volume_bbg_rebate ||
                                          pricing?.node?.volume_bbg_rebate === 0 ? (
                                              pricing?.node?.volume_bbg_rebate
                                          ) : (
                                              <p className="text-center text-placeHolder">Not set</p>
                                          )}
                                      </td>
                                      <td class="border-t text-center text-secondary border-slate-100 dark:border-slate-700 p-4 text-slate-500 dark:text-slate-400">
                                          {pricing?.node?.created_at}
                                      </td>
                                  </tr>
                              );
                          })}
                </tbody>
            </table>
        );
    };

    const productsClaimTable = () => {
        return (
            <ul className="">
                <li className={`border-t py-1`}>
                    <div className="block hover:bg-gray-50">
                        <div className="flex items-center pt-1 px-2">
                            <div className="min-w-0 flex-1 flex">
                                <div className="min-w-0 flex-1 px-2  md:gap-4 items-center">
                                    <div className="flex  items-start justify-between">
                                        <div className="group relative w-full  flex justify-between items-center">
                                            <p className="text-md font-semibold text-secondary">
                                                <Link to="#" className="  focus:outline-none">
                                                    <span className="absolute inset-0" aria-hidden="true"></span>
                                                    Products
                                                </Link>
                                            </p>
                                        </div>
                                        <div className="flex w-full flex-col text-md font-semibold text-secondary ">
                                            {APP_TITLE} Rebate
                                        </div>
                                        <div className=" flex w-full flex-col text-md font-semibold text-secondary">
                                            Custom Builder Rebates
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </li>
                {program?.volume_bbg_rebate === null && customProgramRebateExists().length === 0 ? null : (
                    <li
                        className={`border-b py-1`}
                        onClick={() => {
                            handleAllProducts();
                            setShowSelection(true);
                        }}
                    >
                        <div className="block hover:bg-gray-50">
                            <div className="flex items-center py-1 px-2">
                                <div className="min-w-0 flex-1 flex">
                                    <div className="min-w-0 flex-1 px-2  md:gap-4 items-center">
                                        <div className="flex  items-start justify-between relative">
                                            <div className="group relative w-full   flex justify-between items-center">
                                                <p className="text-sm font-semibold text-gray-500">
                                                    <Link to="#" className="  focus:outline-none">
                                                        <span className="absolute inset-0" aria-hidden="true"></span>
                                                        All Products (Program level)
                                                    </Link>
                                                </p>
                                            </div>
                                            <div className="flex flex-col w-full text-sm text-gray-500 pr-3">
                                                {program?.volume_bbg_rebate}%
                                            </div>
                                            <div className=" flex w-full flex-col text-sm text-gray-500">
                                                {program?.participants?.edges?.map((item) => {
                                                    return program?.pivotDistinctPricings?.edges?.map(
                                                        (pivotPricing) => {
                                                            if (pivotPricing?.node?.relation_id_2 === item?.node?.id) {
                                                                return (
                                                                    <p className="text-sm text-gray-500">
                                                                        {pivotPricing?.node?.volume_bbg_rebate !== null
                                                                            ? item?.node?.name +
                                                                              " : " +
                                                                              pivotPricing?.node?.volume_bbg_rebate +
                                                                              "%"
                                                                            : null}
                                                                    </p>
                                                                );
                                                            } else {
                                                                return null;
                                                            }
                                                        }
                                                    );
                                                })}
                                            </div>

                                            <div
                                                className="cursor-pointer"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleAllProducts();
                                                    setRemove(true);
                                                    setRebateOption("byProgram");
                                                }}
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    class="w-6 text-brickRed"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                        stroke-width="2"
                                                        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                                                    />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>
                )}
                {program?.products?.edges?.map((eachPackage) => {
                    return eachPackage?.node?.programPivot?.claimTemplateExist === true ? (
                        <li
                            className={`border-b py-1`}
                            onClick={() => {
                                handleCustomProducts(eachPackage?.node?.id);
                                setShowSelection(true);
                                setFields({
                                    ...fields,
                                    product_bbg_volume_rebate: eachPackage?.node?.programPivot?.volume_bbg_rebate,
                                });
                            }}
                        >
                            <div className="block hover:bg-gray-50">
                                <div className="flex items-center py-1 px-2">
                                    <div className="min-w-0 flex-1 flex">
                                        <div className="min-w-0 flex-1 px-2  md:gap-4 items-center">
                                            <div className="flex  items-center justify-between relative">
                                                <div className="group relative w-full   flex justify-between items-center">
                                                    <div className="flex flex-col items-start">
                                                        <div className="flex flex-col text-xs text-gray-500 italic">
                                                            {eachPackage.node.category &&
                                                                eachPackage.node.category.name}
                                                        </div>
                                                        <div className="group relative   flex justify-between items-center">
                                                            <p className="text-sm font-semibold text-gray-500">
                                                                <Link to="#" className="  focus:outline-none">
                                                                    <span
                                                                        className="absolute inset-0"
                                                                        aria-hidden="true"
                                                                    ></span>
                                                                    {eachPackage?.node?.bbg_product_code
                                                                        ? eachPackage?.node?.bbg_product_code + " - "
                                                                        : ""}
                                                                    {eachPackage?.node?.name}
                                                                </Link>
                                                            </p>
                                                        </div>
                                                        <div className=" flex flex-col text-xs text-gray-500">
                                                            {eachPackage.node &&
                                                                eachPackage.node.programs &&
                                                                eachPackage.node.programs.edges.length > 0 &&
                                                                eachPackage.node.programs.edges.map((item) => {
                                                                    return (
                                                                        <div className="flex flex-col">
                                                                            <span className="">{item.node.name}</span>
                                                                        </div>
                                                                    );
                                                                })}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col w-full text-sm text-gray-500 pr-3">
                                                    {eachPackage?.node?.pricings2ndModel?.edges[0]?.node
                                                        ?.volume_bbg_rebate !== null
                                                        ? eachPackage?.node?.pricings2ndModel?.edges[0]?.node
                                                              ?.volume_bbg_rebate + "%"
                                                        : program?.volume_bbg_rebate + "%"}
                                                </div>
                                                <div className=" flex flex-col w-full text-sm text-gray-500">
                                                    {program?.participants?.edges?.map((item) => {
                                                        return program?.trinaryDistinctPricings?.edges?.map(
                                                            (pivotPricing) => {
                                                                if (
                                                                    pivotPricing?.node?.relation_id_2 ===
                                                                        eachPackage?.node?.id &&
                                                                    item?.node?.id === pivotPricing?.node?.relation_id_3
                                                                ) {
                                                                    return (
                                                                        <p className="text-sm text-gray-500">
                                                                            {pivotPricing?.node?.volume_bbg_rebate !==
                                                                            null
                                                                                ? item?.node?.name +
                                                                                  " : " +
                                                                                  pivotPricing?.node
                                                                                      ?.volume_bbg_rebate +
                                                                                  "%"
                                                                                : null}
                                                                        </p>
                                                                    );
                                                                } else {
                                                                    return null;
                                                                }
                                                            }
                                                        );
                                                    })}
                                                </div>
                                                <div className="flex flex-row items-center absolute right-0">
                                                    <Button
                                                        color="secondary"
                                                        title={
                                                            programProductPricingHistoryLoading
                                                                ? "Loading History"
                                                                : "Pricing History"
                                                        }
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setProductProgramIdForPricingHistoryQuery(
                                                                eachPackage?.node?.id
                                                            );
                                                        }}
                                                    />
                                                    <div
                                                        className="cursor-pointer"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleCustomProducts(eachPackage?.node?.id);
                                                            setRemove(true);
                                                            setRebateOption("byProduct");
                                                        }}
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            class="w-6 text-brickRed"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                        >
                                                            <path
                                                                stroke-linecap="round"
                                                                stroke-linejoin="round"
                                                                stroke-width="2"
                                                                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                                                            />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                    ) : null;
                })}
            </ul>
        );
    };

    return (
        <div className="">
            {pricingModal()}
            <div className=" w-full col-span-2 h-full">
                <div className="flex items-center w-full">
                    <div className="w-full flex items-center border-b ">
                        <p className="px-4 text-md  font-title text-secondary font-bold py-3">
                            {showSelection ? "New Template" : "Existing Templates"}
                        </p>
                        {!showSelection ? (
                            <PlusCircleIcon
                                className="text-brickGreen w-8 h-8 cursor-pointer"
                                onClick={() => {
                                    setShowSelection(!showSelection);
                                    cleanStates();
                                }}
                            />
                        ) : null}
                    </div>
                </div>
                {!showSelection ? productsClaimTable() : null}
                {showSelection ? (
                    <>
                        <div className="border-b border-gray-200 col-span-6   items-start justify-between sm:items-center w-full">
                            <div className="  ">
                                <div className="mr-5 flex space-x-5 items-center px-4 py-3">
                                    {rebateCalculationOptions.map((item, index) => {
                                        return (
                                            <div className="" key={index}>
                                                <label className="flex items-center ">
                                                    <input
                                                        type="radio"
                                                        name={item.name}
                                                        value={item.name}
                                                        className="form-radio h-5 w-5 text-secondary focus:ring-secondary"
                                                        checked={rebateOption === item.name}
                                                        onChange={handleRebateOptionChange}
                                                    ></input>
                                                    <span className="ml-2 text-sm  text-secondary">{item.label}</span>
                                                </label>
                                            </div>
                                        );
                                    })}
                                    {rebateOption === "byProduct" ? (
                                        <div
                                            className={`px-4 text-md  border-gray-300 font-title  text-secondary font-bold  `}
                                        >
                                            ({selectedProducts.length} of {program?.products?.edges?.length} Selected)
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 items-start ">
                            {rebateOption === "byProduct" ? (
                                program?.products?.edges?.length > 0 ? (
                                    <div className="border-r-2 border-gray-300 w-full col-span-1  flex flex-col">
                                        <ul className="max-h-72 border-b overflow-auto scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400  ">
                                            {program?.products?.edges?.map((eachPackage) => {
                                                return (
                                                    <li
                                                        className={`border-b  ${
                                                            selectedProducts.includes(eachPackage?.node?.id)
                                                                ? "border-l-gold border-l-6 "
                                                                : "border-l-primary border-l-4"
                                                        } `}
                                                    >
                                                        <div
                                                            className="block hover:bg-gray-50"
                                                            onClick={() => addProduct(eachPackage?.node?.id)}
                                                        >
                                                            <div className="flex items-center px-4 py-4 sm:px-6">
                                                                <div className="min-w-0 flex-1 flex">
                                                                    <div className="min-w-0 flex-1 px-2 md:grid md:grid-cols-2 md:gap-4 items-center">
                                                                        <div className="flex flex-col items-start">
                                                                            <div className="flex flex-col text-xs text-gray-500 italic">
                                                                                {eachPackage.node.category &&
                                                                                    eachPackage.node.category.name}
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
                                                                                        {eachPackage?.node
                                                                                            ?.bbg_product_code
                                                                                            ? eachPackage?.node
                                                                                                  ?.bbg_product_code +
                                                                                              " - "
                                                                                            : ""}
                                                                                        {eachPackage.node.name}
                                                                                    </Link>
                                                                                </p>
                                                                            </div>
                                                                            <div className=" flex flex-col text-xs text-gray-500">
                                                                                {eachPackage.node &&
                                                                                    eachPackage.node.programs &&
                                                                                    eachPackage.node.programs.edges
                                                                                        .length > 0 &&
                                                                                    eachPackage.node.programs.edges.map(
                                                                                        (item) => {
                                                                                            return (
                                                                                                <div className="flex flex-col">
                                                                                                    <span className="">
                                                                                                        {item.node.name}
                                                                                                    </span>
                                                                                                </div>
                                                                                            );
                                                                                        }
                                                                                    )}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                {selectedProducts.includes(eachPackage?.node?.id) ? (
                                                                    <div
                                                                        onClick={async () => {
                                                                            await removeFromSelected(
                                                                                eachPackage.node.id
                                                                            );
                                                                        }}
                                                                    >
                                                                        <XCircleIcon className="w-8 h-8 text-brickRed" />
                                                                    </div>
                                                                ) : null}
                                                            </div>
                                                        </div>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                ) : (
                                    <div className="font-title text-gray-500 py-1 text-start px-4 h2 border-r">
                                        <p>No Products found.</p>
                                    </div>
                                )
                            ) : null}
                            <div
                                className={`${
                                    rebateOption === "byProgram" ? "col-span-3" : "col-span-2"
                                } flex items-start   `}
                            >
                                <div className={`min-w-max flex h-full relative items-center  pr-4`}>
                                    {rebateOption === "byProduct" ? (
                                        <TextField
                                            parentClass="flex items-center space-x-10 pl-4 py-3"
                                            id={"product_bbg_volume_rebate"}
                                            label={APP_TITLE + " Rebate"}
                                            value={fields?.product_bbg_volume_rebate}
                                            onChange={handleChange}
                                            width="w-20"
                                            isPercent
                                            name={"product_bbg_volume_rebate"}
                                            placeholder="5"
                                            type="number"
                                        />
                                    ) : null}
                                    {rebateOption === "byProgram" ? (
                                        <TextField
                                            parentClass="flex items-center space-x-10 pl-4 py-3"
                                            id={"volume_bbg_rebate"}
                                            label={APP_TITLE + " Rebate"}
                                            value={fields?.volume_bbg_rebate}
                                            onChange={handleChange}
                                            width="w-20"
                                            isPercent
                                            name={"volume_bbg_rebate"}
                                            placeholder="5"
                                            type="number"
                                        />
                                    ) : null}
                                </div>
                                <div
                                    className="flex flex-col space-x-2 w-full h-full cursor-pointer text-secondary font-title font-semibold"
                                    onClick={(e) => {
                                        setCustomBuilderNumber(customBuilderNumber + 1);
                                    }}
                                >
                                    <div
                                        className={`flex items-center space-x-2  ${
                                            customBuilderNumber > 0 ? "border-b" : ""
                                        } px-4`}
                                    >
                                        <span className="py-3">Custom Builder Rebates</span>
                                        <PlusCircleIcon className="text-brickGreen w-8 h-8" />
                                    </div>
                                    {customBuilderNumber > 0 ? (
                                        <div
                                            className="grid grid-cols-2 w-full max-w-3xl mt-2 py-2 px-3"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <p className="text-sm font-medium text-secondary"> Builder Selection</p>
                                            <p className="text-sm font-medium text-secondary"> Custom Rebate</p>
                                            {renderDynamicalCustomRebate()}
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                    </>
                ) : null}
                {showSelection ? (
                    <div className="py-2 pr-5 flex items-end justify-end">
                        <Button color="primary" title={"Cancel"} onClick={() => setShowSelection(false)} />
                        <Button
                            color="primary"
                            disabled={disabled}
                            title={"Save Updates"}
                            onClick={() => handleMutation()}
                        />
                    </div>
                ) : null}

                {showSelection ? (
                    <div className="flex items-center w-full">
                        <div className="w-full flex items-center border-b  border-t-2 border-t-gray-400">
                            <p className="px-4 text-md  font-title text-secondary font-bold py-3">Existing Templates</p>
                        </div>
                    </div>
                ) : null}
                {showSelection ? productsClaimTable() : null}
            </div>
        </div>
    );
};

export default ClaimsTemplate;
