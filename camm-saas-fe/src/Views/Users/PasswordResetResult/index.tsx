import React from "react";
import { TabTitle } from "../../../Components/Utils/BrowserTitles";

const PasswordResetResult = () => {
	TabTitle("CAMM - Password Reset");
	return (
		<div className="container w-screen h-screen font-roboto flex justify-center items-center">
			<div className="flex flex-col items-center text-center">
				<div className="text-[50px]">Your Password Has Been Reset.</div>
				<img className="h-[80px] w-[250px]" src="/CammLogo.png" alt="" />
			</div>
		</div>
	);
};

export default PasswordResetResult;
