import React, { FC } from "react";
import cx from "classnames";
type PriorDeleteModalProps = {
	instanceToDelete: string;
	active: boolean;
	deleteFunction: () => void;
	setActiveDeleteModal: () => void;
};

const PriorDeleteModal: FC<PriorDeleteModalProps> = ({
	instanceToDelete,
	active,
	deleteFunction,
	setActiveDeleteModal,
}: PriorDeleteModalProps) => {
	return (
		<>
			<div
				className={cx(
					"fixed top-[0] left-[0] w-screen h-screen bg-transparent items-center justify-center  z-[100]",
					active ? "flex animate-fadeIn" : "hidden"
				)}
			>
				<div className="w-fit h-fit shadow-sm shadow-grey">
					<div className="px-5 py-10 font-poppins font-normal text-[18px] text-gray items-center flex flex-col justify-center bg-white border border-brightRed">
						<div>Are you sure you want to delete this {instanceToDelete}?</div>
						<div className="flex justify-between mt-[30px] gap-[10px]">
							<div
								onClick={() => {
									deleteFunction();
								}}
								className="h-[48px] w-[100px] bg-brightRed flex justify-center items-center text-white mr-[9px] cursor-pointer select-none"
							>
								YES
							</div>
							<div
								onClick={() => setActiveDeleteModal()}
								className="h-[48px] w-[100px] bg-brightRed flex justify-center items-center text-white mr-[9px] cursor-pointer select-none"
							>
								NO
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default PriorDeleteModal;
