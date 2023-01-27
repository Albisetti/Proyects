import Button from "../../../../Buttons";
import React, { useState, useEffect } from "react";
import Modal from "../../../../Modal";
import { useLazyQuery,useMutation } from "@apollo/client";
import { FETCH_AFTER_MUTATION_DISPUTE_CLAIM,FETCH_DISPUTE_CLAIM, FETCH_SMALL_CLAIM, UPDATE_CLAIM_READY, UPSERT_DISPUTE } from "../../../../../lib/claims";
import Loader from "../../../../Loader/Loader";
import DisputeAccordion from "./DisputeAccordion";
import { useHistory } from "react-router";
import { formatterForCurrency } from "../../../../../util/generic"
import {APP_TITLE} from "../../../../../util/constants";

const DisputeDetails = ({ claimId,confirmAction }) => {
    const [showModal, setShowModal] = useState(false);
    const [claim, setClaim] = useState();
    const [activeAddresses, setActiveAddresses] = useState([]);
    const [activeBuilder, setActiveBuilder] = useState();
    const [centerColumnList, setCenterColumnList] = useState();
    const [disputeFields,setDisputeFields] = useState();
    const [disputeValuesToCompare,setDisputeValuesToCompare] = useState();
    const [disputes,setDisputes] = useState([]);
    const [mutationObject,setMutationObject] = useState();
    const [secondModal,setSecondModal] = useState(false);
    const [tm,setTm] = useState();
    const [builderExpandData,setBuilderExpandData] = useState();
    const [showConfirmModal,setShowConfirmModal] = useState();
    const [confirmSecondModal,setConfirmSecondModal] = useState()

    const history = useHistory();

    useEffect(() => {
        if (claimId) {
            getEachClaim();
        }
        // eslint-disable-next-line
    }, [claimId]);

    const [getEachClaim,{loading:claimLoading}] = useLazyQuery(FETCH_SMALL_CLAIM, {
        notifyOnNetworkStatusChange: false,
        variables: {
            id: claimId,
        },
        fetchPolicy: "no-cache",
        onCompleted: (data) => {
            if (data?.claim?.id) {
                setClaim(data?.claim);
            }
        },
    });

    const [calculateClaimAllocation, {loading: calculateClaimAllocationLoading}] = useMutation(FETCH_AFTER_MUTATION_DISPUTE_CLAIM, {
        variables: {
            id: claimId,
            builderId:activeBuilder?.builder_id,
        },
        update(cache, result){
            setClaim(result?.data?.calculateIndividualBuilderClaimAllocation);
            normalizeTheList(result?.data?.calculateIndividualBuilderClaimAllocation?.houseProductsForBuilder?.edges);
        }
    })

    const [getClaimForBuilder, {loading:builderClaimLoading}] = useLazyQuery(FETCH_DISPUTE_CLAIM, {
        notifyOnNetworkStatusChange: false,
        variables: {
            id: claimId,
            orgId: activeBuilder?.builder_id,
        },
        fetchPolicy: "no-cache",
        onCompleted: (data) => {
            if (data?.claim?.id) {
                setClaim(data?.claim);
                normalizeTheList(data?.claim?.houseProductsForBuilder?.edges);
            }
        },
    });

    const normalizeTheList = (edges) => {
        let houseIds = [];
        let finalHouseProductArray = [];
        edges?.forEach((item) => {
            if (!houseIds.includes(item?.node?.houses?.id)) {
                let object = {};
                object.house = item?.node?.houses;
                object.products = [{...item?.node?.products,product_quantity : item?.node?.product_quantity,dispute: item?.node?.dispute,pivotId:item?.node?.id}];
                object.dispute = item?.node?.dispute;
                object.disputed = item?.node?.disputed;
                houseIds.push(item?.node?.houses?.id);
                finalHouseProductArray.push(object);
            } else {
                let arrayIndex = finalHouseProductArray.findIndex(
                    (element) => element?.house?.id === item?.node?.houses?.id
                );
                finalHouseProductArray[arrayIndex].products = [
                    ...finalHouseProductArray[arrayIndex].products,
                    {...item?.node?.products,product_quantity : item?.node?.product_quantity,dispute: item?.node?.dispute,pivotId:item?.node?.id},
                ];
            }
        });


        setTm(edges?.[0]?.node?.rebateReports?.organization?.territoryManagers?.edges?.[0]?.node?.first_name + " " + edges?.[0]?.node?.rebateReports?.organization?.territoryManagers?.edges?.[0]?.node?.last_name)
        setCenterColumnList(finalHouseProductArray);
    };

    const handleDisputeFieldsChange = (e,item) => {
        const { name, value } = e.target;
        if (disputeFields) {
            setDisputeFields({
                ...disputeFields,
                [item?.pivotId]: {
                    ...disputeFields[item?.pivotId],
                    name:item?.name,
                    pivotId:item?.pivotId,
                    programs:item?.programs,
                    rebateReportPivot:item?.rebateReportPivot,
                    require_quantity_reporting:item?.require_quantity_reporting,
                    id:item?.id,
                    dispute:item?.dispute,
                    category:item?.category,
                    bbg_product_code:item?.bbg_product_code,
                    [name]: name === "product_quantity"?  parseInt(value):value,
                },
            });
        } else {
            setDisputeFields({
                ...disputeFields,
                [item?.pivotId]: {
                    name:item?.name,
                    pivotId:item?.pivotId,
                    programs:item?.programs,
                    rebateReportPivot:item?.rebateReportPivot,
                    require_quantity_reporting:item?.require_quantity_reporting,
                    id:item?.id,
                    dispute:item?.dispute,
                    category:item?.category,
                    bbg_product_code:item?.bbg_product_code,
                    [name]:  name === "product_quantity"?  parseInt(value):value,
                },
            });
        }  
        if(!disputes.includes(item?.pivotId)) {
        setDisputes([...disputes,item?.pivotId])
        }
    }

    

    useEffect(() => {

        const array = []
        disputes?.forEach((id) => {
            let object = {};
            if(disputeFields?.[id]?.dispute?.id) {
                object.id = disputeFields?.[id]?.dispute?.id;
                object.new_product_quantity = disputeFields?.[id]?.product_quantity;
                object.note = disputeFields?.[id]?.note ? disputeFields?.[id]?.note : "";
                array.push(object);
            }
            else {
                object.new_product_quantity = disputeFields?.[id]?.product_quantity;
                object.note = disputeFields?.[id]?.note ? disputeFields?.[id]?.note : "";
                object.claim = { "connect": claimId};
                if(disputeFields?.[id]?.pivotId) {
                object.rebateReport = { "connect" :disputeFields?.[id]?.pivotId };
                }
                array.push(object);
            }
        })

        setMutationObject(array)
        // eslint-disable-next-line
    }, [disputes,disputeFields])

   

    const [upsertDispute] = useMutation(UPSERT_DISPUTE,{
        variables: {
            disputes:mutationObject,
        },
        update(cache, result) {
           setSecondModal(true);
           calculateClaimAllocation();
        },
    })

    const disputeModalContent = () => {
        let list = centerColumnList?.filter(
            (item) =>
                activeAddresses?.findIndex(
                    (element) => element?.id === item?.house?.id
                ) > -1
        );

        return (
            <div className="flex mx-4 flex-col   max-h-smallMin overflow-auto scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400">
                {list?.map((item) => {
                    return item?.products?.map((eachItem) => {
                        return (
                            <div className={` flex flex-col border px-4 rounded-lg mb-4 border-l-4  ${parseInt(disputeFields?.[eachItem?.id]?.product_quantity) !== parseInt(disputeValuesToCompare?.[eachItem?.id]?.product_quantity) ? "border-l-gold border-l-6": "border-l-primary "}`}>
                                <div className="flex flex-col items-start justify-start py-2">
                                    {item?.house?.lot_number ? (
                                        <p className="text-md font-semibold text-gray-500">
                                            Lot: {item?.house?.lot_number}
                                        </p>
                                    ) : null}
                                    {item?.house?.address2 !== null && item?.house?.address2?.trim() !== ""  ? (
                                        <p className="text-md font-semibold text-gray-500">
                                            {item?.house?.address2} -{" "}
                                            {item?.house?.address}
                                        </p>
                                    ) : (
                                        <p className="text-md font-semibold text-gray-500">
                                            {item?.house?.address}
                                        </p>
                                    )}
                                    {item?.house?.project_number ? (
                                        <p className="text-md font-semibold text-gray-500">
                                            Project:{" "}
                                            {item?.house?.project_number}
                                        </p>
                                    ) : null}
                                    {item?.house?.model ? (
                                        <p className="text-md font-semibold text-gray-500 capitalize">
                                            Build Model: {item?.house?.model}
                                        </p>
                                    ) : null}
                                </div>
                                <div className="px-4 pb-2 flex flex-col ">
                                    <div className="flex justify-between items-center">
                                        <div className="flex flex-col w-full">
                                            <div className="flex flex-col text-xs text-gray-500 italic text-left">
                                                {eachItem?.category &&
                                                    eachItem?.category.name}
                                            </div>
                                            <div className="group relative   flex justify-between items-center">
                                                <div className="text-sm font-semibold text-gray-500">
                                                    <div className="  focus:outline-none">
                                                        <span
                                                            className="absolute inset-0"
                                                            aria-hidden="true"
                                                        ></span>
                                                        {
                                                            eachItem?.bbg_product_code ? eachItem?.bbg_product_code + " - ": ""
                                                        } {eachItem?.name}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className=" flex flex-col text-xs text-gray-500 text-left">
                                                {eachItem?.programs?.edges.map(
                                                    (item) => {
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

                                        <div className="flex items-center w-full">
                                            {eachItem?.require_quantity_reporting ? (
                                                <input
                                                    type="number"
                                                    name="product_quantity"
                                                    id="product_quantity"
                                                    value={disputeFields?.[eachItem?.pivotId]?.product_quantity}
                                                    onChange={(e) => handleDisputeFieldsChange(e,eachItem)}
                                                    placeholder="Qty"
                                                    className={` w-12 my-2 focus:border-secondary border-secondary rounded-lg rounded-b-none min-w-0 sm:text-sm border-0 border-b-2   outline-none focus:outline-none focus:ring-0`}
                                                />
                                            ) : null}
                                        </div>

                                        <div className="flex items-center w-full">
                                            <textarea
                                                type="text"
                                                name="note"
                                                id="note"
                                                onChange={(e) => handleDisputeFieldsChange(e,eachItem)}
                                                value={disputeFields?.[eachItem?.pivotId]?.note}
                                                placeholder="Notes"
                                                className={`my-2 focus:border-secondary border-secondary rounded-lg min-w-0 sm:text-sm  focus:outline-none focus:ring-1 focus:ring-secondary`}
                                            />
                                        </div>
                                    </div>

                                </div>
                            </div>
                        );
                    });
                })}
            </div>
        );
    };

    const accordianComponent = () => {
        return (
            <div className="flex flex-col py-1">
                <div className="flex px-4">
                    <p className="flex-1 text-darkGray75 font-body text-md ">Builder Allocation - {builderExpandData?.builder_tier.replace("_", " ")}</p>
                    <p className=" text-darkGray75 font-body text-md ">{formatterForCurrency.format(builderExpandData?.builder_allocation)}   </p>
                </div>
                <div  className="flex px-4">
                    <p className="flex-1 text-darkGray75 font-body text-md ">{APP_TITLE} Revenue</p>
                    <p className=" text-darkGray75 font-body text-md ">
                        {formatterForCurrency.format(builderExpandData?.total -
                            builderExpandData?.builder_allocation)}
                    </p>
                </div>
                <div  className="flex px-4">
                    <p className="flex-1 text-darkGray75 font-body text-md ">Total to claim</p>
                    <p className=" text-darkGray75 font-body text-md ">{formatterForCurrency.format(builderExpandData?.total)}</p>
                </div>
            </div>
        );
    };

    const secondModalContent = () => {
            
            return(
                <div className="flex flex-col flex-1 overflow-auto w-full">
                <p className="px-6 text-gray-500  font-title font-semibold text-lg">
                    This report has been sent to all <span className="text-secondary">{activeBuilder?.name}</span>  contacts and the assigned TM <span className="text-secondary">{tm}</span> 
                </p>
                <p className="px-6 text-gray-500  font-title font-semibold text-lg">
                    The Disputed address(es) are now in the Action Required tab for the next reporting period.
                </p>
            </div>
            )

    }

    const deepEqual = (x, y)  =>{
        const ok = Object.keys, tx = typeof x, ty = typeof y;
        return x && y && tx === 'object' && tx === ty ? (
          ok(x).length === ok(y).length &&
            ok(x).every(key => deepEqual(x[key], y[key]))
        ) : (x === y);
      }


    const modal = () => {
        return (
            <>
                <Modal
                    title={!secondModal?  `Create Dispute Report`: "Dispute Created Successfully"}
                    width={"2xl"}
                    minHeight={ secondModal? "": "min-h-smallMin"}
                    Content={secondModal? secondModalContent(): disputeModalContent() }
                    submitLabelColor={"primary"}
                    showSubmit={secondModal?true: !deepEqual(disputeFields,disputeValuesToCompare) }
                    submitLabel={secondModal?"Close":"Save Changes & Send Report"}
                    onClose={() => {setShowModal(false);setDisputeFields({});setSecondModal(false) }
                    }
                    onSubmit={secondModal? () => setShowModal(false) : () =>  upsertDispute()}
                    show={showModal}
                />
            </>
        );
    };

    const approveClaimContent = () => {
        return(
            <div className="flex flex-col flex-1 overflow-auto w-full">
            <p className="px-6 text-gray-500 font-medium text-lg">
                Please click Approve Claim to move this Disputed Claim to Ready for Close, or go back to make updates.
            </p>
        </div>
        )
    }

    const getMonthYear = (date) => {
        var month = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ];
        return month[date.getMonth()] + " " + date.getFullYear();
    };

    const approveSecondModalContent = () => {
        return(
            <div className="flex flex-col flex-1 overflow-auto w-full">
          <p className="px-6 text-gray-500  font-title font-semibold text-lg">
              Claim Period : {getMonthYear( new Date(claim?.claim_start_date))} - {getMonthYear( new Date(claim?.claim_end_date))}
          </p>
          <p className="px-6 text-gray-500  font-title font-semibold text-lg">
              Submitted Claim : {claim?.total_payment_rebate}
          </p>
            </div>
        )
    }


    const confirmModal = () => {
        return (
            <>
                <Modal
                    onSubmit={confirmSecondModal?() =>  history.push('/claims/claimhistory'): () => submitClaim()}
                    title={!confirmSecondModal? "Are you sure?":claim?.program?.name}
                    width={"lg"}
                    Content={confirmSecondModal? approveSecondModalContent(): approveClaimContent()}
                    submitLabelColor={ "primary"}
                    submitLabel={confirmSecondModal?"Go to Claim History": "Approve Claim" }
                    onClose={confirmSecondModal? () => confirmAction() : () => setShowConfirmModal(false)}
                    show={showConfirmModal}
                />
            </>
        );
    };

    const [submitClaim] = useMutation(UPDATE_CLAIM_READY, {
        variables: {
            status:"READYTOCLOSE",
            id: claim?.id
        },
        update(cache, result) {
            setConfirmSecondModal(true)
        },
    });

    const handleBuilderClick = (data) => {
        setActiveBuilder(data);
        setDisputes([])
    };

    useEffect(() => {
        if (activeBuilder?.builder_id && claimId) {
            getClaimForBuilder();
        }
        // eslint-disable-next-line
    }, [activeBuilder, claimId]);

    const handleAccordianEachAddress = (node) => {
      
        if (
            activeAddresses?.findIndex((element) => element?.id === node?.id) >
            -1
        ) {
            setActiveAddresses(
                activeAddresses.filter((item) => item.id !== node.id)
            );
        } else {
            setActiveAddresses(() => [
                ...activeAddresses,
                {
                    ...node,
                    subdivisionName: node?.subdivisionName,
                    subdivisionId: node?.subdivisionId,
                },
            ]);
        }
    };

    const setDisputeData = () => {
  
        let list = centerColumnList?.filter(
            (item) =>
                activeAddresses?.findIndex(
                    (element) => element?.id === item?.house?.id
                ) > -1
        );

        let object = {}
        list?.forEach((item) => {
            item?.products?.forEach((eachItem) => {
                object[eachItem?.pivotId] = {
                    product_quantity : item?.dispute?.new_product_quantity ? item?.dispute?.new_product_quantity:  eachItem?.product_quantity,
                    note: item?.dispute?.note
                }
            })
        })

       setDisputeFields(object);
       setDisputeValuesToCompare(object);
    }


    return (
        <div
            className="flex-1 flex-col  flex items-stretch sm:flex-row  overflow-hidden"
            style={{ minHeight: "60vh", maxHeight: "60vh" }}
        >
            <div className="flex-grow w-full max-w-8xl mx-auto 2xl:flex">
                <div className="flex-1 min-w-0 md:flex">
                    <div className=" flex-1 2xl:max-w-xs 3xl:max-w-md xl:flex-shrink-0  ">
                        <div className="h-full">
                            <div className="h-full relative">
                                <div className=" inset-0  border bg-white border-gray-200 h-full flex flex-col">
                                    <div className="flex flex-0 px-4 py-4  border-b justify-between items-center">
                                        <div className="font-title text-center text-secondary font-bold text-lg">
                                            {"Builders Claiming"}
                                        </div>
                                    </div>

                                    <div className="flex overflow-auto scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400 w-full h-full">
                                        <div className="w-full  border-l border-white border-r sm:max-h-full scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400">
                                            <ul className=" flex-0 w-full  overflow-auto">
                                                {claimLoading?
                                                <Loader />
                                                : 
                                                claim?.calculateCurrentTotal?.builderTotals?.map(
                                                    (eachData, key) => {
                                                        return (
                                                            <li
                                                                key={key}
                                                                onClick={() =>
                                                                    handleBuilderClick(
                                                                        eachData
                                                                    )
                                                                }
                                                                className={`py-3 pl-3 transition-all border-b border-l-4  hover:border-l-6 hover:bg-gray-100 cursor-pointer ${
                                                                    activeBuilder?.builder_id ===
                                                                    eachData?.builder_id
                                                                        ? "border-l-gold border-l-6"
                                                                        : eachData?.disputed? "border-l-brickRed": "border-l-primary"
                                                                }`}
                                                            >
                                                                <div className="relative  ">
                                                                    <div className="text-sm font-semibold text-darkgray75">
                                                                        <div className="focus:outline-none">
                                                                            {
                                                                                eachData.name
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </li>
                                                        );
                                                    }
                                                )}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="sm:flex-1 flex">
                        <div className=" flex-1 ">
                            <div className="h-full relative  md:pr-3 lg:pr-0 xl:pr-3 2xl:pr-0">
                                <div className="inset-0  border  bg-white  h-full flex flex-col">
                                    <div className="flex flex-0 px-4 border-b justify-between items-center">
                                        <div className="py-4 font-title text-center text-secondary font-bold text-lg">
                                            Rebate Report{" "}
                                            {activeBuilder?.name
                                                ? ": " + activeBuilder?.name
                                                : ""}
                                        </div>
                                    </div>
                                    <div className="flex flex-col flex-1 overflow-auto w-full">
                                        <div
                                            className={`flex flex-col  h-full w-full scrollbar-thin overflow-hidden scrollbar-thumb-lightPrimary scrollbar-track-gray-400`}
                                        >
                                            {modal()}
                                            {(!centerColumnList &&
                                            activeBuilder) || builderClaimLoading? (
                                                <Loader />
                                            ) : (
                                                centerColumnList?.map(
                                                    (eachData, key) => {
                                                        return (
                                                            <div
                                                                key={key}
                                                                className={`flex px-2 group justify-between py-3 w-full transition-all cursor-pointer border-b hover:border-l-6 ${
                                                                    activeAddresses.findIndex(
                                                                        (
                                                                            element
                                                                        ) =>
                                                                            element.id ===
                                                                            eachData
                                                                                .house
                                                                                .id
                                                                    ) > -1
                                                                        ? "border-l-6 border-l-gold"
                                                                        : eachData?.disputed? "border-l-4 border-l-brickRed": "border-l-4 border-l-primary"
                                                                }`}
                                                                onClick={() =>
                                                                    handleAccordianEachAddress(
                                                                        eachData.house
                                                                    )
                                                                }
                                                            >
                                                                <div className="flex items-center">
                                                                    <input
                                                                        id="checkSearchedAddress"
                                                                        name="checkSearchedAddress"
                                                                        type="checkbox"
                                                                        onChange={() =>
                                                                            handleAccordianEachAddress(
                                                                                eachData.house
                                                                            )
                                                                        }
                                                                        checked={
                                                                            activeAddresses?.findIndex(
                                                                                (
                                                                                    element
                                                                                ) =>
                                                                                    element?.id ===
                                                                                    eachData
                                                                                        ?.house
                                                                                        ?.id
                                                                            ) >
                                                                            -1
                                                                        }
                                                                        className="focus:ring-secondary h-4 w-4 text-secondary border-gray-300 rounded"
                                                                    />

                                                                    <p className="text-sm px-2  font-semibold text-darkgray75 ">
                                                                        {eachData
                                                                            ?.house
                                                                            ?.lot_number
                                                                            ? eachData
                                                                                  ?.house
                                                                                  ?.lot_number +
                                                                              " | " +
                                                                              eachData
                                                                                  ?.house
                                                                                  ?.address +
                                                                              " " +
                                                                              eachData
                                                                                  ?.house
                                                                                  ?.address2
                                                                            : eachData
                                                                                  ?.house
                                                                                  ?.address +
                                                                              " " +
                                                                              eachData
                                                                                  ?.house
                                                                                  ?.address2}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        );
                                                    }
                                                )
                                            )}
                                        </div>
                                        {activeAddresses?.length > 0 ? (
                                            <div className="flex w-full py-1 border-t justify-center">
                                                <div>
                                                    <Button
                                                        title="Create Dispute Report"
                                                        color="brickRed"
                                                        onClick={() =>
                                                            {setShowModal(true);
                                                                setSecondModal(false);
                                                                setDisputeData()}
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className=" flex-1 2xl:max-w-md 3xl:max-w-lg">
                    <div className="h-full relative  md:pr-3 lg:pr-0 xl:pr-3 2xl:pr-0">
                        <div className="inset-0  border  bg-white   h-full flex flex-col">
                            <div className="flex flex-0 px-4 border-b justify-between items-center">
                                <div className="py-4 font-title text-center text-secondary font-bold text-lg">
                                    Summary
                                </div>
                                <div className="flex flex-0 px-4 justify-between items-center space-x-5">
                                    <div className="grid grid-cols-1 w-full ">
                                        <div className="flex  justify-end items-center  space-x-5">
                                            <p className="font-title text-center text-secondary font-bold text-lg">
                                                Report total
                                            </p>
                                            <div className="font-title text-center text-secondary font-bold text-lg flex-1">
                                                {claimLoading || calculateClaimAllocationLoading?
                                                <Loader width={25} height={25}/> :
                                                formatterForCurrency.format(
                                                    claim?.calculateCurrentTotal
                                                        ?.total)
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <p className="font-title border-b text-secondary font-bold text-lg py-2 px-4">
                                Dispute Reports
                            </p>
                            {claimLoading || calculateClaimAllocationLoading?
                            <Loader />
                            :
                            <DisputeAccordion 
                            Data={claim?.calculateCurrentTotal?.builderTotals}
                            onClick={(data) => {
                                setBuilderExpandData(data)
                            }}
                            component={accordianComponent()}
                            />
                            }
                            <div className="flex w-full py-1 border-t justify-center">
                                {confirmModal()}
                                <div>
                                    <Button
                                        title="Approve & Close"
                                        color="primary"
                                        onClick={() => {setShowConfirmModal(true);setConfirmSecondModal(false)}}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default DisputeDetails;