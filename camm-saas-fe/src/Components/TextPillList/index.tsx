import React, { FC } from "react";
import TextPill from "../TextPill";

type TextPillListProps = {
	color?: string;
	textList: string[];
	textSize?: string;
	textColor?: string;
};

const TextPillList: FC<TextPillListProps> = ({
	color = "#FFFFFF",
	textSize = "12px",
	textList = [],
	textColor = "#000000",
}: TextPillListProps) => {
	return (
		<div className="gap-1 flex flex-wrap">
			{textList.map((text1, key) => (
				<TextPill
					key={key}
					color={color}
					textSize={textSize}
					text={text1}
					textColor={textColor}
				/>
			))}
		</div>
	);
};

export default TextPillList;
