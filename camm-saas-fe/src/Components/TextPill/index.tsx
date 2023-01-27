import React, { FC } from "react";

type TextPillProps = {
	color?: string;
	text: string;
	textSize?: string;
	textColor?: string;
};

const TextPill: FC<TextPillProps> = ({
	color = "#FFFFFF",
	text,
	textSize = "12px",
	textColor = "#000000",
}: TextPillProps) => {
	return (
		<div
			style={{
				backgroundColor: color,
				fontSize: textSize,
				color: textColor,
			}}
			className=" min-h-[24px] h-fit w-max px-[10px] rounded-lg font-roboto leading-6 text-white"
		>
			{text}
		</div>
	);
};

export default TextPill;
