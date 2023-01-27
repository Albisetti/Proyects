import React from "react";
import { Link } from "react-router-dom";

const RejectedModalContent = ({ products }) => {
    return (
        <div className="flex flex-col px-6">
            <div className=" border rounded-lg  scrollbar-thumb-lightPrimary scrollbar-track-gray-400 max-h-smallMin">
                <ul className={`flex-0 w-full pointer-events-none`}>
                    {products?.map((product) => {
                        return (
                            <li className={`border-b border-l-6 border-l-gold`}>
                                <Link to="#" className="block hover:bg-gray-50">
                                    <div className="flex items-center px-4 py-4 sm:px-6">
                                        <div className="min-w-0 flex-1 flex">
                                            <div className="min-w-0 flex-1 px-2 md:grid md:grid-cols-2 items-center">
                                                <div className="flex flex-col">
                                                    <div className="flex flex-col text-xs text-gray-500 italic text-left">
                                                        {product.category && product.category.name}
                                                    </div>
                                                    <div className="group relative   flex justify-between items-center">
                                                        <p className="text-sm font-semibold text-gray-500 text-left">
                                                            {product?.bbg_product_code &&
                                                                product?.bbg_product_code + " - "}
                                                            {product.name}
                                                        </p>
                                                    </div>
                                                    <div className=" flex flex-col text-xs text-gray-500">
                                                        {product?.programs?.map((program) => {
                                                            return (
                                                                <div className="flex flex-col">
                                                                    <span>{program?.program_name}</span>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                    <div className=" flex flex-col text-xs text-gray-500">
                                                        <div className="flex flex-col">
                                                            <span>Rejected Note: {product?.reject_note}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
};

export default RejectedModalContent;
