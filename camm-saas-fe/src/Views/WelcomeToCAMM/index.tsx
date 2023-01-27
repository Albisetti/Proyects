import React from "react";
import { TabTitle } from "../../Components/Utils/BrowserTitles";

const WelcomeToCAMM = () => {
	TabTitle("CAMM");
	return (
		<div className="mt-[100px] w-full flex justify-center items-center">
			<div className="flex flex-col items-center text-center">
				<a
					href="https://canadianassociationofmoldmakers.com/"
					className="w-1/6 min-h-[200px] flex"
					target="_blank"
					rel="noreferrer"
				>
					<img
						className="h-[80px] w-[250px] mb-5 self-center"
						src="/CammLogo.png"
						alt="CAMM Logo"
					/>
				</a>
				<div className="flex flex-col gap-5">
					<div className="flex flex-col my-5 gap-5 p-5">
						<h2 className="mb-5 font-semibold text-[36px]">
							CAMM Welcomes Our Corporate Sponsors
						</h2>
						<div className="flex flex-wrap justify-center gap-10">
							<a
								href="https://procomps.com/"
								className="w-1/6"
								target="_blank"
								rel="noreferrer"
							>
								<img
									alt="Progressive Components Logo"
									src="https://canadianassociationofmoldmakers.com/wp-content/uploads/2020/02/ProgressiveComponentsLogo.png"
								/>
							</a>
							<img
								className="w-1/6"
								alt="Megatel Logo"
								src="https://canadianassociationofmoldmakers.com/wp-content/uploads/2020/02/Megatel-750x123.png"
							/>
							<img
								className="w-1/6"
								alt="EDC Logo"
								src="https://canadianassociationofmoldmakers.com/wp-content/uploads/2022/06/edc-1.jpg"
							/>
						</div>
					</div>
					<div className="flex flex-col my-5 gap-5 p-5">
						<h2 className="mb-5 font-semibold text-[36px]">
							CAMM Welcomes Our Partners
						</h2>
						<div className="flex flex-wrap justify-center gap-10">
							<a
								href="https://www.canadianmetalworking.com/subscription/publication"
								className="w-1/6"
								target="_blank"
								rel="noreferrer"
							>
								<img
									alt="Canadian Metalworking Logo"
									src="https://canadianassociationofmoldmakers.com/wp-content/uploads/2021/11/Canadian-Metalworking-Logo-high-res-1320x361.jpg"
								/>
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default WelcomeToCAMM;
