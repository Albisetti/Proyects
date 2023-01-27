import React from "react";
import { TabTitle } from "../../../Components/Utils/BrowserTitles";

const RequestedOpportunity = () => {
	TabTitle("CAMM - Opportunity Requested");
	return (
		<div className="mt-[100px] w-full flex justify-center items-center">
			<div className="flex flex-col items-center text-center">
				<div className="flex flex-col gap-5">
					<div className="flex flex-col my-5 gap-5 p-5">
						<h2 className="mb-5 font-semibold text-[36px]">
							Thank you for submitting your Opportunity.
							<br />A CAMM representative will create it or be in contact shortly.
						</h2>
					</div>
				</div>
			</div>
		</div>
	);
};

export default RequestedOpportunity;
