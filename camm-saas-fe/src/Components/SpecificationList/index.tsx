import React, { FC } from "react";
import cx from "classnames";
import Specification from "../../Models/Specification";

type SpecificationListProps = {
	step: number;
	specificationTypes: string[];
	specificationByTypeList?: Specification[];
	specificationAmount: number;
	selectedSpecificationList?: Specification[];

	setSelectedSpecificationList?: React.Dispatch<
		React.SetStateAction<Specification[]>
	>;
};

const SpecificationList: FC<SpecificationListProps> = ({
	step,
	specificationTypes,
	specificationAmount,
	specificationByTypeList,
	selectedSpecificationList,
	setSelectedSpecificationList,
}: SpecificationListProps) => {
	const checkedFunction = (checked: boolean, field: Specification) => {
		if (checked && !selectedSpecificationList?.includes(field)) {
			const list = selectedSpecificationList
				? [...selectedSpecificationList]
				: [];

			if (list && setSelectedSpecificationList) {
				list?.push(field);
				setSelectedSpecificationList(list);
			}
		} else {
			const list = selectedSpecificationList?.filter(
				(fieldToRemove) => fieldToRemove !== field
			);
			if (list && setSelectedSpecificationList) {
				setSelectedSpecificationList(list);
			}
		}
	};

	return (
		<div
			className={cx("lg:mb-[100px] mt-[80px] ", step === 2 ? "flex" : "hidden")}
		>
			<div className="lg:w-[920px] h-[500px] overflow-y-auto z-[60] shadow-lg shadow-grey rounded-md  font-roboto text-[18px] text-gray bg-white relative p-[36px]">
				<div className="text-[16px] font-normal ">
					<>
						<div className="gap-1 flex flex-wrap">
							{specificationTypes?.map((type) => {
								return specificationByTypeList
									?.filter((specification) => specification?.type === type)
									?.map((spec: Specification, key) => {
										return (
											<>
												{key === 0 && (
													<div className="basis-full">
														<p className="text-[20px] pb-[2px] font-semibold">
															{type}
														</p>
														<div
															className={`${
																specificationByTypeList?.length != 0
																	? "text-[10px] mb-2"
																	: "text-[20px]"
															}`}
														>
															{specificationByTypeList?.length != 0
																? "Choose from"
																: "No specification of this type available at the moment!"}
														</div>
													</div>
												)}

												<div className="flex w-[33%]">
													<label className="cursor-pointer">
														<input
															onChange={(e) =>
																checkedFunction(e.target.checked, spec)
															}
															type="checkbox"
															checked={selectedSpecificationList?.includes(
																spec
															)}
															className=" mb-[5px] appearance-none checked:bg-checkboxBackground h-[16px] w-[16px] border border-grey rounded-sm bg-white  checked:border-brightRed focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
														/>
														{spec.name}
													</label>
												</div>
											</>
										);
									});
							})}
						</div>
					</>
				</div>
			</div>
		</div>
	);
};

export default SpecificationList;
