import React, { FC } from "react";
import ConfirmPasswordModal from "../../../Components/ConfirmPasswordModal";
import { TabTitle } from "../../../Components/Utils/BrowserTitles";

const ConfirmPassword: FC = () => {
	TabTitle("CAMM - Confirm Password");
	return (
		<div className="container w-screen h-screen font-roboto flex justify-center items-center">
			<div className="flex flex-col items-center text-center">
				<ConfirmPasswordModal />
			</div>
		</div>
	);
};

export default ConfirmPassword;
