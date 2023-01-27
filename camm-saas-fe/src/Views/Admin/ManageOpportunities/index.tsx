import React, { FC, useContext, useState, useEffect } from "react";
import Opportunity from "../../../Models/Opportunity";
import { AuthContext } from "../../../auth";
import OpportunityList from "../../../Components/OpportunityList";
import Button from "../../../Components/Utils/Buttons/Button";
import Pagination from "../../../Components/Utils/Pagination";
import { PaginationItems } from "../../../Models/Utils/paginationItems";
import { useNavigate } from "react-router-dom";
import { TabTitle } from "../../../Components/Utils/BrowserTitles";

const ManageOpportunities: FC = () => {
	const { token } = useContext(AuthContext);
	const [pageToGet, setPageToGet] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [totalOpportunities, setTotalOpportunities] = useState(1);
	const [searchOpportunity, setSearchOpportunity] = useState("");
	const [opportunityList, setOpportunityList] = useState<Opportunity[]>([]);
	const [opportunitiesPerPage, setOpportunitiesPerPage] =
		useState<PaginationItems>({
			toItem: 1,
			fromItem: 1,
			totalPages: 1,
		});
	const navigate = useNavigate();

	useEffect(() => {
		if (searchOpportunity) {
			Opportunity.searchOpportunities(token, searchOpportunity, pageToGet).then(
				(response) => {
					setTotalPages(response?.totalPages);
					setOpportunitiesPerPage({
						toItem: response?.toOpportunity,
						fromItem: response?.fromOpportunity,
						totalPages: response?.totalPages,
					});
					setTotalOpportunities(response?.totalOpportunities);
					setOpportunityList(response?.opportunities);
				}
			);
		} else {
			Opportunity.getOpportunities(token, pageToGet).then((response) => {
				setTotalPages(response?.totalPages);
				setOpportunitiesPerPage({
					toItem: response?.toOpportunity,
					fromItem: response?.fromOpportunity,
					totalPages: response?.totalPages,
				});
				setTotalOpportunities(response?.totalOpportunities);
				setOpportunityList(response?.opportunities);
			});
		}
	}, [pageToGet, searchOpportunity]);
	TabTitle("CAMM - Manage Opportunities");
	return (
		<div className="container w-full h-full mt-[110px] font-roboto mb-[30px]">
			<div className=" ml-[39px] mr-[41px]">
				<div className="flex items-center">
					<img
						onClick={() => navigate("/")}
						className="cursor-pointer h-[15px] w-[18px] mr-[19px]"
						src="./assets/backArrow.svg"
					></img>
					<div>Home / </div>
					<div className="text-brightRed ml-[3px] ">Opportunities </div>
				</div>
				<div className="flex flex-col md:flex-row justify-between items-center mt-[28px] mb-[24px] ">
					<div className="text-[36px] leading-[48px]">Opportunities</div>
					<div className="flex justify-center items-center gap-[11px]">
						<Button
							text="add new opportunity"
							action={() => navigate("/create-opportunity")}
						/>
						<div className="relative">
							<input
								onChange={(event) => {
									setSearchOpportunity(event?.target?.value);
								}}
								required
								placeholder="Search here"
								type="text"
								className="pl-[15px] h-[48px] w-[220px] form-control block  bg-white bg-clip-padding border border-solid border-grey rounded transition ease-in-out m-0  focus:bg-white  focus:outline-none focus:border-brightRed"
							/>
							<img
								className="top-4 right-3 absolute w-[18px] h-[18px]"
								src="./assets/magnifyingGlass.svg"
							></img>
						</div>
					</div>
				</div>
				<div className="mx-[17px]">
					<OpportunityList
						opportunityList={opportunityList}
						setOpportunitiesPerPage={setOpportunitiesPerPage}
						opportunitiesPerPage={opportunitiesPerPage}
						setTotalOpportunities={setTotalOpportunities}
						totalOpportunities={totalOpportunities}
					/>
				</div>
				{totalOpportunities > 50 && (
					<Pagination
						pageToGet={pageToGet}
						setPageToGet={setPageToGet}
						totalPages={totalPages}
						itemsPerPage={opportunitiesPerPage}
						totalItems={totalOpportunities}
					/>
				)}
			</div>
		</div>
	);
};

export default ManageOpportunities;
