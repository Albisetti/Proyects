import React, { FC } from "react";
import cx from "classnames";
type ConfirmedDeletedModalProps = {
	instanceToDelete: string;
	active: boolean;
	setActiveConfirmedDeleteModal: () => void;
};

const ConfirmedDeletedModal: FC<ConfirmedDeletedModalProps> = ({
	instanceToDelete,
	active,
	setActiveConfirmedDeleteModal,
}: ConfirmedDeletedModalProps) => {
	return (
		<>
			<div
				className={cx(
					"fixed top-[0] left-[0] w-screen h-screen items-center  justify-center  z-[100]",
					active ? "flex animate-fadeIn" : "hidden"
				)}
			>
				<div className="w-fit h-fit">
					<div className="px-5 py-10 font-poppins font-normal shadow-sm shadow-grey text-[18px] text-gray items-center flex flex-col justify-center bg-white border border-brightRed">
						<div className="mb-[20px]">
							{instanceToDelete} deleted successfully.
						</div>
						<div className="">
							<div
								onClick={() => {
									setActiveConfirmedDeleteModal();
								}}
								className="h-[48px] w-[100px] bg-brightRed flex justify-center items-center text-white mr-[9px] cursor-pointer select-none"
							>
								DISMISS
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default ConfirmedDeletedModal;
