import React from "react";
import { TabTitle } from "../../../Components/Utils/BrowserTitles";

const ForgotPasswordEmail = () => {
	TabTitle("CAMM - Forgot Password Email");
	return (
		<div className="container w-screen h-screen font-roboto flex justify-center items-center">
			<div className="flex flex-col items-center text-center">
				<div className="text-[50px]">
					An email has been sent to reset your password.
				</div>
				<img className="h-[80px] w-[250px]" src="/CammLogo.png" alt="" />
			</div>
		</div>
	);
};

export default ForgotPasswordEmail;
