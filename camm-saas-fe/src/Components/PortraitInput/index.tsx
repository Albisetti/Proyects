import React, { ChangeEvent, useEffect, useState } from "react";
import cx from "classnames";

type PortraitInputProps = {
	id: string;
	portraitImage?: string | undefined;
	rounded?: boolean;
	// eslint-disable-next-line no-use-before-define
	inputAction?: (e: ChangeEvent<HTMLInputElement>) => void;
};
const PortraitInput = ({
	id,
	portraitImage,
	rounded = false,
	inputAction,
}: PortraitInputProps) => {
	const [placeholder, setPlaceHolder] = useState("");
	useEffect(() => {
		if (rounded) {
			setPlaceHolder("/assets/profile-image.svg");
		} else {
			setPlaceHolder("/assets/rectangularPlaceholder.png");
		}
	}, []);
	return (
		<div className="flex w-full h-full ">
			<label
				htmlFor={`file-input-${id}`}
				className="cursor-pointer relative h-full w-full group"
			>
				<div
					className={cx(
						"w-full h-full absolute top-0 left-0 bg-no-repeat bg-cover bg-center",
						rounded && "rounded-full"
					)}
					style={{
						backgroundImage: `url(${
							portraitImage ? portraitImage : placeholder
						})`,
					}}
				/>
				{inputAction && (
					<div className="w-full h-full flex items-center justify-center absolute bg-white/75 transition-all duration-200 opacity-0 group-hover:opacity-100">
						<img
							className="h-[24px] w-[24px] opacity-75"
							src="/assets/pencilBlack.svg"
						/>
					</div>
				)}
			</label>
			{inputAction && (
				<input
					className="hidden"
					id={`file-input-${id}`}
					onChange={async (e) => {
						await inputAction(e);
					}}
					type="file"
				/>
			)}
		</div>
	);
};

export default PortraitInput;
