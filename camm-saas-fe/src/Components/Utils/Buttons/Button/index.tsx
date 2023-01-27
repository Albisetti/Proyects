import React from "react";
import cx from "classnames";

const styles = {
	primary: {
		bg: "bg-brightRed",
		text: "text-white",
		border: "border-brightRed",
		icon: "bg-brightRed",
	},
	secondary: {
		bg: "bg-gray-6",
		text: "text-white",
		border: "border-gray-6",
		icon: "bg-gray-6",
	},
	outline: {
		bg: "bg-transparent",
		text: "text-brightRed",
		border: "border-brightRed",
		icon: "bg-brightRed",
	},
	alternative: {
		bg: "bg-darkRed",
		text: "text-white",
		border: "border-darkRed",
		icon: "bg-darkRed",
	},
	disabled: {
		bg: "bg-gray-7",
		text: "text-gray-6",
		border: "border-bg-gray-7",
		icon: "bg-gray-6",
	},
};

const buttonPaddingOptions = {
	large: "px-[16px] py-[5px]",
	medium: "p-[12px]",
};

const textSizeOptions = {
	large: "text-[16px] leading-[36px]",
	medium: "text-[12px] leading-[24px]",
};

const iconSizeOptions = {
	large: "h-[16px] w-[16px]",
	medium: "h-[12px] w-[12px]",
	small: "h-[8px] w-[8px]",
};

type StyleKeys = keyof typeof styles;

type ButtonProps = {
	url?: string;
	action?: () => void;
	text?: string;
	iconLeft?: string;
	iconRight?: string;
	style?: StyleKeys;
	disabled?: boolean;
	iconPadding?: boolean;
	buttonPadding?: "large" | "medium";
	textSize?: "large" | "medium";
	iconSize?: "large" | "medium" | "small";
};

const Button = ({
	url,
	action,
	text,
	iconLeft,
	iconRight,
	style = "primary",
	disabled = false,
	iconPadding = true,
	buttonPadding = "large",
	textSize = "large",
	iconSize = "large",
}: ButtonProps) => {
	return (
		<a
			href={url ? url : undefined}
			className="hover:no-underline font-poppins font-normal"
		>
			<button
				className={cx(
					"uppercase flex items-center justify-center border-[1px] w-fit",
					styles[disabled ? "disabled" : style].bg,
					styles[disabled ? "disabled" : style].text,
					styles[disabled ? "disabled" : style].border,
					buttonPaddingOptions[buttonPadding],
					textSizeOptions[textSize]
				)}
				onClick={action ? action : () => null}
				disabled={disabled}
			>
				{iconLeft && (
					<span
						className={cx(
							styles[disabled ? "disabled" : style].icon,
							iconPadding && "mr-[10px]"
						)}
					>
						<img className={iconSizeOptions[iconSize]} src={iconLeft} alt="" />
					</span>
				)}
				{text}
				{iconRight && (
					<span
						className={cx(
							styles[disabled ? "disabled" : style].icon,
							iconPadding && "ml-[10px]"
						)}
					>
						<img className={iconSizeOptions[iconSize]} src={iconRight} alt="" />
					</span>
				)}
			</button>
		</a>
	);
};

export default Button;
