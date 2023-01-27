import React, { FC, useContext } from "react";
import cx from "classnames";
import Company from "../../Models/Company";
import { AuthContext } from "../../auth";
import Country from "../../Models/Country";

type SetUpOpportunityProps = {
	step: number;
	setOpportunityData: React.Dispatch<
		React.SetStateAction<{
			name?: string | undefined;
			description?: string | undefined;
			startDate?: Date | undefined;
			closeDate?: Date | undefined;
			country?: string[] | undefined;
			company?: Company;
		}>
	>;
	opportunityData: {
		name?: string | undefined;
		description?: string | undefined;
		startDate?: Date | undefined;
		closeDate?: Date | undefined;
		country?: string[] | undefined;
		company?: Company;
	};
	companyList: Company[];
};

const SetUpOpportunity: FC<SetUpOpportunityProps> = ({
	step,
	opportunityData,
	companyList,
	setOpportunityData
}: SetUpOpportunityProps) => {
	const { user } = useContext(AuthContext);
	const checkedFunction = (checked: boolean, country: string) => {
		if (checked) {
			const list = opportunityData.country || [];
			list?.push(country);

			setOpportunityData({
				...opportunityData,
				country: list,
			});
		} else {
			if (opportunityData?.country) {
				setOpportunityData({
					...opportunityData,
					country: opportunityData?.country?.filter(
						(countryToRemove) => countryToRemove !== country
					),
				});
			}
		}
	};
	return (
		<div className={cx(" mt-[80px]", step == 1 ? "flex" : "hidden")}>
			<div className="lg:w-[820px] lg:h-[503px] z-[60] shadow-lg shadow-grey rounded-md  font-roboto text-[18px] text-gray bg-white pt-[15px] relative p-[20px]">
				<form className="">
					<div className="flex flex-col">
						<div className="text-[36px] leading-[48px] py-[16px]">Setup</div>
						<div className="flex flex-col lg:flex-row justify-between">
							<div>
								<p className="text-[10px] pb-[3px] font-semibold">Name</p>
								<input
									value={opportunityData?.name}
									onChange={(event) => {
										setOpportunityData({
											...opportunityData,
											name: event?.target?.value,
										});
									}}
									required
									type="text"
									className="focus:border-brightRed h-[36px] w-[360px] text-[15px] pr-8 form-control block  px-4 py-2  font-normal bg-white bg-clip-padding border border-solid border-grey rounded transition ease-in-out m-0  focus:bg-white  focus:outline-none"
								/>
							</div>
							<div>
								<p className="text-[10px] pb-[3px] font-semibold">Owner</p>
								<select
									disabled={ user?.roles?.includes("Super Admin") ? false : true }
									className="focus:border-brightRed h-[36px] w-[360px] text-[15px] pr-8 form-control block  px-4 py-2  font-normal bg-white bg-clip-padding border border-solid border-grey rounded transition ease-in-out m-0  focus:bg-white  focus:outline-none"
									onChange={(event) => {
										companyList.forEach((company) => {
											if (company?.id === parseInt(event?.target?.value)) {
												setOpportunityData({
													...opportunityData,
													company: company,
												});
											}
										});
									}}
									defaultValue={ user?.roles?.includes("Super Admin") ? "" : user?.company?.id }
								>
									<option value={""} key={"PLACEHOLDER"} disabled hidden>
										Please Select A Company
									</option>
									{ user?.roles?.includes("Super Admin") ? companyList
										?.filter((c) => {
											return !c?.isMember;
										})
										.map((company) => {
											return (
												<option value={company?.id} key={company?.id}>
													{company?.name}
												</option>
											);
										})
										:
										<option value={user?.company?.id} key={user?.company?.id}>
											{user?.company?.name}
										</option>
									}
								</select>
							</div>
						</div>
						<div className="mt-[16px] mb-[15px]">
							<p className="text-[10px] pb-[3px] font-semibold">
								Brief Description
							</p>
							<textarea
								onChange={(event) => {
									setOpportunityData({
										...opportunityData,
										description: event?.target?.value,
									});
								}}
								required
								className="focus:border-brightRed resize-none overflow-x-hidden h-[135px] form-control block w-full px-4 py-2 mb-[15px] text-[15px] text-xl font-normal bg-white bg-clip-padding border border-solid border-grey rounded transition ease-in-out m-0  focus:bg-white  focus:outline-none overflow-scroll "
							/>
						</div>
						<div className="flex gap-[15px]">
							<div className="mb-3">
								<p className="text-[10px] pb-[3px] font-semibold">Start Date</p>
								<input
									onChange={(event) => {
										setOpportunityData({
											...opportunityData,
											startDate: new Date(event?.target?.value),
										});
									}}
									required
									type="date"
									className="focus:border-brightRed h-[36px] w-[240px] text-[15px] pr-8 form-control block  px-4 py-2  font-normal bg-white bg-clip-padding border border-solid border-grey rounded transition ease-in-out m-0  focus:bg-white  focus:outline-none"
								/>
							</div>
							<div className="mb-3">
								<p className="text-[10px] pb-[3px] font-semibold">Close Date</p>
								<input
									onChange={(event) => {
										setOpportunityData({
											...opportunityData,
											closeDate: new Date(event?.target?.value),
										});
									}}
									required
									type="date"
									className="focus:border-brightRed h-[36px] w-[240px] text-[15px] pr-8 form-control block  px-4 py-2  font-normal bg-white bg-clip-padding border border-solid border-grey rounded transition ease-in-out m-0  focus:bg-white  focus:outline-none"
								/>
							</div>
						</div>
						<div>
							<div className="text-[10px] pb-[3px] font-semibold">Country</div>
							<div className="flex text-[16px] gap-[24px]">
								<div className="flex">
									<input
										value="Canada"
										onChange={(e) => 
											checkedFunction(e.target.checked, e.target.value)
										}
										style={{
											backgroundImage: opportunityData?.country?.includes(
												"Canada"
											)
												? `url(${"/assets/tick.svg"}`
												: "",
										}}
										type="checkbox"
										className=" mb-[5px] appearance-none h-4 w-4
									border border-grey rounded-sm bg-white
									checked:border-brightRed focus:outline-none transition
									duration-200 mt-1 align-top bg-no-repeat bg-contain float-left bg-center
									mr-2 cursor-pointer "
									></input>
									<div className="">Canada</div>
								</div>

								<div className="flex">
									<input
										value="USA"
										onChange={(e) =>
											checkedFunction(e.target.checked, e.target.value)
										}
										style={{
											backgroundImage: opportunityData?.country?.includes("USA")
												? `url(${"/assets/tick.svg"}`
												: "",
										}}
										type="checkbox"
										className=" mb-[5px] appearance-none h-4 w-4
									border border-grey rounded-sm bg-white
									checked:border-brightRed focus:outline-none transition
									duration-200 mt-1 align-top bg-no-repeat bg-contain float-left bg-center
									mr-2 cursor-pointer "
									></input>
									<div className="">USA</div>
								</div>
								<div className="flex">
									<input
										value="Brazil"
										onChange={(e) =>
											checkedFunction(e.target.checked, e.target.value)
										}
										style={{
											backgroundImage: opportunityData?.country?.includes(
												"Brazil"
											)
												? `url(${"/assets/tick.svg"}`
												: "",
										}}
										type="checkbox"
										className=" mb-[5px] appearance-none h-4 w-4
									border border-grey rounded-sm bg-white
									checked:border-brightRed focus:outline-none transition
									duration-200 mt-1 align-top bg-no-repeat bg-contain float-left bg-center
									mr-2 cursor-pointer "
									></input>
									<div className="">Brazil</div>
								</div>
								<div className="flex">
									<input
										value="Germany"
										onChange={(e) =>
											checkedFunction(e.target.checked, e.target.value)
										}
										style={{
											backgroundImage: opportunityData?.country?.includes(
												"Germany"
											)
												? `url(${"/assets/tick.svg"}`
												: "",
										}}
										type="checkbox"
										className=" mb-[5px] appearance-none h-4 w-4
									border border-grey rounded-sm bg-white
									checked:border-brightRed focus:outline-none transition
									duration-200 mt-1 align-top bg-no-repeat bg-contain float-left bg-center
									mr-2 cursor-pointer "
									></input>
									<div className="">Germany</div>
								</div>
								<div className="flex">
									<input
										value="Japan"
										onChange={(e) =>
											checkedFunction(e.target.checked, e.target.value)
										}
										style={{
											backgroundImage: opportunityData?.country?.includes(
												"Japan"
											)
												? `url(${"/assets/tick.svg"}`
												: "",
										}}
										type="checkbox"
										className=" mb-[5px] appearance-none h-4 w-4
									border border-grey rounded-sm bg-white
									checked:border-brightRed focus:outline-none transition
									duration-200 mt-1 align-top bg-no-repeat bg-contain float-left bg-center
									mr-2 cursor-pointer "
									></input>
									<div className="">Japan</div>
								</div>
								<div className="flex">
									<input
										value="South Korea"
										onChange={(e) => {
											checkedFunction(e.target.checked, e.target.value);
										}}
										style={{
											backgroundImage: opportunityData?.country?.includes(
												"South Korea"
											)
												? `url(${"/assets/tick.svg"}`
												: "",
										}}
										type="checkbox"
										className={` mb-[5px] appearance-none h-4 w-4
									border border-grey rounded-sm bg-white
									checked:border-brightRed focus:outline-none transition
									duration-200 mt-1 align-top bg-no-repeat bg-contain float-left bg-center
									mr-2 cursor-pointer `}
									></input>
									<div>South Korea</div>
								</div>
							</div>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
};

export default SetUpOpportunity;
