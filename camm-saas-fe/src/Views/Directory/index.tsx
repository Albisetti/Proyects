import React, { FC } from "react";
import LatestList from "../../Components/LatestList";
import { TabTitle } from "../../Components/Utils/BrowserTitles";

const Directory: FC = () => {
	TabTitle("CAMM - Directory");
	return (
		<div className="w-full h-full font-roboto pt-[160px] mb-[30px] relative px-[40px] container-1440">
			<div className="flex-col flex justify-between items-center gap-[20px] md:flex-row">
				<LatestList typeOfList="member" />
				<LatestList typeOfList="company" />
				<LatestList typeOfList="opportunity" />
			</div>
		</div>
	);
};

export default Directory;
