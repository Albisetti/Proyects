import React, { FC, ReactElement } from "react";
import { useNavigate } from "react-router-dom";
import { TabTitle } from "../Utils/BrowserTitles";

type ComingSoonProps = {
	message?: string;
};

const ComingSoon: FC<ComingSoonProps> = ({
	message,
}: ComingSoonProps): ReactElement => {
	const navigate = useNavigate();
	TabTitle("CAMM - Coming Soon");
	return (
		<div className="h-screen w-auto font-poppins font-normal flex flex-col gap-5 justify-center items-center text-lg">
			<div className="">
				{message ??
					"The page you have requested is under construction! Please check back soon!"}
			</div>
			<div>
				<a
					className="hover:underline cursor-pointer text-brightRed"
					onClick={() => navigate("/")}
				>
					Return Home
				</a>
			</div>
			<div className="flex flex-col items-center text-center">
				<img className="h-[80px] w-[250px]" src="/CammLogo.png" alt="" />
			</div>
		</div>
	);
};

export default ComingSoon;
