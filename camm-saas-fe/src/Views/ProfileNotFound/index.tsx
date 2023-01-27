import React from "react";
import { useNavigate } from "react-router-dom";
import { TabTitle } from "../../Components/Utils/BrowserTitles";

const ProfileNotFound = () => {
	const navigate = useNavigate();
	TabTitle("CAMM - Profile Not Found");
	return (
		<div className="w-auto h-screen font-roboto flex flex-col gap-3 justify-center items-center text-lg">
			<div className="">The requested profile is not yet complete.</div>
			<div>
				<a
					className="hover:underline cursor-pointer"
					onClick={() => navigate("/directory")}
				>
					Back to Directory
				</a>
			</div>
			<div className="flex flex-col items-center text-center">
				<img className="h-[80px] w-[250px]" src="/CammLogo.png" alt="" />
			</div>
		</div>
	);
};

export default ProfileNotFound;
