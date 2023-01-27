import React from 'react'

const Product = ({eachData}) => {
    return (
        <div
                                className={` pl-5 py-2 transition-all border rounded-lg `}
                               
                            >
                                <div className="flex flex-col text-xs text-gray-500 italic">
                                    {eachData.node.category &&
                                        eachData.node.category.name}
                                </div>
                                <div className="group relative   flex justify-between items-center">
                                    <div className="text-sm font-semibold text-gray-500">
                                        <div
                                            to="#"
                                            className="  focus:outline-none"
                                        >
                                            <span
                                                className="absolute inset-0"
                                                aria-hidden="true"
                                            ></span>
                                            {eachData?.node?.bbg_product_code
                                                ? eachData?.node
                                                      ?.bbg_product_code + " - "
                                                : ""}
                                            {eachData.node.name}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col text-xs text-gray-500">
                                    {eachData.node &&
                                        eachData.node.programs &&
                                        eachData.node.programs.edges.length >
                                            0 &&
                                        eachData.node.programs.edges.map(
                                            (item) => {
                                                return (
                                                    <div className="flex flex-col">
                                                        <span className="">
                                                            {item?.node?.name}
                                                        </span>
                                                    </div>
                                                );
                                            }
                                        )}
                                </div>
                            </div>
    )
}

export default Product
