
import React, { useState, useEffect } from "react";
import { sortSubdivisionPrepareRebates } from "../../../../../util/sort";
import { CHANGE_REBATES_STATUS, GET_UNAVAILABLE_REBATES } from "./MultiRebateAccordian.query"
import { useMutation, useQuery } from "@apollo/client";
import RebateAccordian from "./RebateAccordian";
import Button from "../../../../Buttons";
import { toast } from "react-toastify";


const MultiRebateAccordian = ({
  Data,
  closeAccordian = true,
  isModifiable,
  handleAccordianEachAddress,
  houseProofPoints,
  productProofPoints,
  reportId,
  openModal,
  type,
  refetch,
  houses,
  readyHouses,
  actionHouses,
  allHouses,
  disputes,
  organizationId,
  isPeriodClosing
}) => {
  const [clicked, setClicked] = useState([]);

  const toggle = (index) => {
    if (clicked?.includes(index)) {
      //if clicked question is already active, then close it
      setClicked(clicked?.filter((item) => item !== index));
    } else {
      setClicked([...clicked, index]);
    }
  };

  //Code to Auto-Expand Starts Here

  useEffect(() => {
    let items = Data?.map((item, index) => index);
    if (items) {
      setClicked([...clicked, ...items]);
    }
    // eslint-disable-next-line
  }, [Data]);

  //Code to Auto-Expand Ends Here

  const handleReadyAllRebates = () => {
    if (type !== "ready" && type !== "action") return
    let rebates_ids = []
    Data.forEach((item) => {
      item?.houses?.forEach((house) => {
        Object.values(house?.node?.pivots).forEach((pivot) => {
          rebates_ids.push(pivot?.id)
        })
      })
    })
    rebates_ids = rebates_ids.filter((element) => {
      return !unavailableRebates?.includes(element);
    })
    changeRebatesStatus({
      variables: {
        rebate_ids: rebates_ids,
        org_id: organizationId,
        status: "REBATE_READY"
      }
    })
  }

  const component = (node, allProductsData, readyProductsData, action) => {
    return (
      <RebateAccordian
        openModal={openModal}
        Data={node}
        reportId={reportId}
        fromAddress
        allProductsData={allProductsData}
        readyProductsData={readyProductsData}
        actionHouses={action}
        rebateReport
        type={type}
        handleAccordianEachAddress={handleAccordianEachAddress}
        houseProofPoints={houseProofPoints}
        productProofPoints={productProofPoints}
        refetch={refetch}
        isModifiable={isModifiable}
        disputes={disputes}
      />
    );
  };

  const handleDisplayProperty = (action, all, item) => {
    if (type === "action") {
      let actionLength = action?.length;
      let result = actionLength;
      let total = all?.length;
      return total > 1 ? `(${result} of ${total} Properties)` : `(${result} of ${total} Property)`;
    } else if (type === "ready") {
      let actionLength = action?.length;
      let total = all?.length;
      let result = total - actionLength;
      return total > 1 ? `(${result} of ${total} Properties)` : `(${result} of ${total} Property)`;
    } else {
      return item?.houses?.length > 1
        ? `(${item?.houses?.length} Properties)`
        : `(${item?.houses?.length} Property)`;
    }
  };

  const [changeRebatesStatus] = useMutation(CHANGE_REBATES_STATUS, {
    onCompleted: () => {
      toast.info("Updating all valid rebates. A notification will be sent when this is finished", { autoClose: 30000 })
    }
  })

  const { unavailableRebates } = useQuery(GET_UNAVAILABLE_REBATES, {
    notifyOnNetworkStatusChange: false,
    fetchPolicy: "no-cache",
  });


  return (
    <div className="flex flex-col w-full items-start justify-start bg-white col-span-4">
      <div
        className={`w-full scrollbar-thumb-lightPrimary scrollbar-track-gray-400 `}
      >
        {type === "action" ?
          <div>
            <Button title="Update All" color="gold" disabled={isPeriodClosing} onClick={() => handleReadyAllRebates()} />
          </div>
          : null
        }
        {Data && Data.length > 0 &&
          sortSubdivisionPrepareRebates(Data)?.map((item, index) => {
            let some = houses?.find((element) => element?.subdivisionId === item?.subdivisionId);
            let ready = readyHouses?.find((element) => element?.subdivisionId === item?.subdivisionId);
            let action =
              actionHouses &&
              actionHouses?.filter(
                (element) => element?.node?.model?.subdivision?.id === item?.subdivisionId
              );
            let all =
              allHouses &&
              allHouses?.filter(
                (element) => element?.node?.model?.subdivision?.id === item?.subdivisionId
              );
            return (
              <div className={`border-b`}>
                <div
                  className={`flex group py-1 justify-between items-center w-full text-center cursor-pointer transition-all  border-l-4 hover:border-l-6 ${clicked?.includes(index) && closeAccordian
                    ? "bg-gray-300 border-l-6 border-gold"
                    : "bg-white border-primary"
                    }`}
                  onClick={() => {
                    toggle(index);
                  }}
                  key={index}
                >
                  <div className="flex w-full items-center px-2">
                    <div className="py-2 px-2 w-full flex justify-between text-sm text-darkgray75 font-semibold">
                      <p className="">{item?.subdivisionName}</p>
                      <div
                        className={`flex items-start ${item?.houses?.length < 2 ? "pr-3" : ""}`}
                      >
                        <p> {handleDisplayProperty(action, all, item)} </p>
                      </div>
                    </div>
                  </div>
                  <span className="mr-5">
                    {clicked?.includes(index) && closeAccordian ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-secondary"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 15l7-7 7 7"
                        />
                      </svg>
                    ) : null}
                    {!clicked?.includes(index) ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="opacity-0 transition-opacity duration-150 h-6 w-6 group-hover:opacity-100 text-secondary"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    ) : null}
                  </span>
                </div>
                {clicked?.includes(index) && closeAccordian ? (
                  <div className="bg-red w-full   flex flex-col justify-around items-center transition-all duration-1000 ">
                    {component(item.houses, some?.houses, ready?.houses, action)}
                  </div>
                ) : null}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default MultiRebateAccordian;
