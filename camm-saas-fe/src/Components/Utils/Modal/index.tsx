import React from "react";
import cx from "classnames";

type ModalProps = {
	modalActive: boolean;
	modalActiveControl?: React.Dispatch<React.SetStateAction<boolean>>;
	children?: React.ReactNode;
	width?: number;
	height?: number;
	darkBg?: boolean;
	cross?: boolean;
};

const Modal = ({
	modalActive,
	modalActiveControl,
	children,
	width,
	height,
	darkBg = true,
	cross = true,
}: ModalProps) => {
	return (
		<div
			className={cx(
				"fixed z-[100] top-0 left-0 w-full h-screen justify-center items-center ",
				modalActive ? "flex" : "hidden",
				darkBg ? "bg-black/70 " : "bg-transparent"
			)}
			onClick={() => {
				if (modalActiveControl) {
					modalActiveControl(false);
				}
			}}
		>
			<div
				className="shadow-sm shadow-grey rounded-md bg-white border border-brightRed p-[33px]"
				style={{
					width: width ? width : "fitContent",
					height: height ? height : "fitContent",
				}}
				onClick={(e) => {
					e.stopPropagation();
				}}
			>
				{modalActiveControl && cross && (
					<div className="w-full flex justify-end">
						<img
							onClick={(e) => {
								e.stopPropagation();
								modalActiveControl(false);
							}}
							src="/crossBlack.svg"
							className="w-[20px] h-[20px] cursor-pointer"
						/>
					</div>
				)}

				{children}
			</div>
		</div>
	);
};

export default Modal;
