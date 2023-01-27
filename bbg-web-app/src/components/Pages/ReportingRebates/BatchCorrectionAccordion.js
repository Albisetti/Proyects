
import React, { useEffect } from "react";

const BatchCorrectionAccordion = ({
  Data,
  fromAddress,
  closeAccordian = true,
  revealSearch,
  rebateReport,
  activeAddresses,
  DataArray,
  handleAccordianEachAddress,
  subdivisionId,
  subdivisionName,
}) => {
 



  useEffect(() => {
    if (revealSearch) {
      const updateScroll = function (e) {
        if (e.deltaY < 0) {
          revealSearch();
        }
      };
      window.addEventListener("wheel", updateScroll);
      return function () {
        window.removeEventListener("wheel", updateScroll);
      };
    }
    // eslint-disable-next-line
  }, []);

  const houseCount = (index) => {
    let houseArray =
      DataArray &&
      DataArray.rebateReportOfCurrentUserOrganization &&
      DataArray.rebateReportOfCurrentUserOrganization.report &&
      DataArray.rebateReportOfCurrentUserOrganization.report.houses.edges.filter(
        (item) => item?.node?.model?.id === index
      );
    let programId = []
    houseArray?.[0]?.node?.pivots?.forEach((item) => {
      item?.products?.programs?.edges?.forEach((insideItem) => {
        if(!programId?.includes(insideItem?.node?.id)) {
          programId.push(insideItem?.node?.id)
        }
      })
    })
    let count = programId?.length;
    if (count > 0) {
      return count;
    }
    return 0;
  };


  return (
    <div className="flex flex-col w-full items-start justify-start bg-white">
      <div className={`overflow-auto w-full scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400 `}>
        {Data &&
          Data.length !== 0 &&
          Data.map((item, index) => {
            return (
              <div className={` ${rebateReport ? "border-l border-b border-l-white" : "border-b"}`}>
                <div
                  className={`flex group py-1 justify-between items-center w-full text-center cursor-pointer transition-all  border-l-4 hover:border-l-6  ${
                    "bg-white border-primary"
                  } `}
                  key={index}
                >
                  <div className="flex w-full items-center pl-4">
                    <div className="flex items-center h-5">
                      <input
                        id="checkSubdivision"
                        name="checkSubdivision"
                        type="checkbox"
                        onChange={() => handleAccordianEachAddress({...item,subdivisionName:subdivisionName,subdivisionId:subdivisionId})}
                        checked={activeAddresses?.findIndex( (element) => element?.id === item?.house?.id) > -1}
                        className="focus:ring-secondary h-4 w-4 text-secondary border-gray-300 rounded"
                      />
                    </div>
                    <div
                      className="flex flex-1 w-full"
                    >
                      <div
                        className={`py-2 px-2 text-sm flex w-full ${
                          fromAddress && rebateReport ? "px-2" : "px-2"
                        }`}
                      >
                        {fromAddress ? (
                          <div className="flex flex-col items-start w-full">
                            {item.house.lot_number ? <p className="font-semibold text-gray-500">Lot: {item.house.lot_number}</p> : null}
                          
                            {item.house.address2 ? (
                              <div className="flex justify-between w-full">
                                  <p className="font-semibold text-gray-500">
                                {item.house.address2} - {item.house.address} 
                                  </p>
                              </div>
                            
                            ) : (
                              <p className="font-semibold text-gray-500">
                                {item.house.address} ({houseCount(item.house.id)}){" "}
                              </p>
                            )}
                              {item.house.project_number ? <p className="text-gray-500">Project: {item.house.project_number}</p> : null}
                            {item.house.model ? <p className="text-gray-500 capitalize">Build Model: {item.house.model}</p> : null}
                          </div>
                        ) : (
                         <p> {item.house.name} </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default BatchCorrectionAccordion;
