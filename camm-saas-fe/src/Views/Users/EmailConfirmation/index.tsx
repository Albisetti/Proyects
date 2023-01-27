import React from "react";
import { TabTitle } from "../../../Components/Utils/BrowserTitles";

const EmailConfirmation = () => {
	TabTitle("CAMM - Email Confirmation");
	return (
		<div className="container w-screen h-screen font-roboto flex justify-center items-center">
			<div className="flex flex-col items-center text-center">
				<div className="text-[50px]">A confirmation email has been sent.</div>
				<img className="h-[80px] w-[250px]" src="/CammLogo.png" alt="" />
			</div>
		</div>
	);
};

export default EmailConfirmation;
