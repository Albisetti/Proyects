import React, { useContext, useEffect, useState } from "react";
import OpportunityDetails from "../../../Components/OpportunityDetails";
import cx from "classnames";
import Button from "../../../Components/Utils/Buttons/Button";
import Pagination from "../../../Components/Utils/Pagination";
import { PaginationItems } from "../../../Models/Utils/paginationItems";
import Opportunity from "../../../Models/Opportunity";
import { AuthContext } from "../../../auth";
import Specification from "../../../Models/Specification";
import { useNavigate } from "react-router-dom";
import { TabTitle } from "../../../Components/Utils/BrowserTitles";

type searchFilters = {
	specification_ids?: string[];
	specification_types?: string[];
};

type filterItem = {
	id: string;
	filterTitle: string;
	filters: Specification[];
};

const OpportunitiesListing = () => {
	const [filterList, setFilterList] = useState<filterItem[]>([]);
	const { token } = useContext(AuthContext);
	const [filtersOpen, setFiltersOpen] = useState<string[]>([]);
	const [filtersOpenType, setFiltersOpenType] = useState<string[]>([]);

	const [specificationsTypes, setSpecificationsTypes] = useState<string[]>([]);
	const [filtersSelected, setFiltersSelected] = useState<searchFilters>();
	const [pageToGet, setPageToGet] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [opportunitiesPerPage, setOpportunitiesPerPage] =
		useState<PaginationItems>({
			toItem: 1,
			fromItem: 1,
			totalPages: 1,
		});
	const [totalOpportunities, setTotalOpportunities] = useState(1);
	const navigate = useNavigate();
	const [opportunityList, setOpportunityList] = useState<Opportunity[]>([]);
	const [searchOpportunity, setSearchOpportunity] = useState("");

	const handleFilterAccordion = (filterItemId: string) => {
		const currentFilters = [...filtersOpen];
		if (currentFilters.includes(filterItemId)) {
			currentFilters.forEach((item, key) => {
				if (item === filterItemId) {
					currentFilters.splice(key);
				}
			});
		} else {
			currentFilters.push(filterItemId);
		}
		setFiltersOpen(currentFilters);
	};

	const handleFilterSelection = (filterItem: string) => {
		const currentFilters = [...(filtersSelected?.specification_ids || [])];
		if (currentFilters.filter((item) => item === filterItem).length > 0) {
			currentFilters.forEach((item, key) => {
				if (item === filterItem) {
					currentFilters.splice(key, 1);
				}
			});
		} else {
			currentFilters.push(filterItem);
		}
		setFiltersSelected({
			...filtersSelected,
			specification_ids: currentFilters,
		});
	};

	const handleFilterAccordionType = (type: string) => {
		const currentFilters = [...filtersOpenType];
		if (currentFilters.includes(type)) {
			currentFilters.forEach((item, key) => {
				if (item === type) {
					currentFilters.splice(key);
				}
			});
		} else {
			currentFilters.push(type);
		}
		setFiltersOpenType(currentFilters);
	};

	const clearFilters = () => {
		setFiltersSelected({ ...filtersSelected, specification_ids: undefined });
	};

	useEffect(() => {
		if (!filtersSelected?.specification_ids) getOpportunities();
	}, [filtersSelected]);

	const handleSearch = () => {
		getOpportunities();
	};

	useEffect(() => {
		getOpportunities();
		Specification.getSpecificationTypes(token).then((res) =>
			setSpecificationsTypes(res)
		);
		Specification.getSpecifications(token).then((res) =>
			setFilterList(
				filterList.concat({
					id: "1",
					filterTitle: "Specifications",
					filters: res.map((specification: Specification) => specification),
				})
			)
		);
	}, []);

	useEffect(() => {
		getOpportunities();
	}, [pageToGet]);

	function getOpportunities() {
		if (searchOpportunity) {
			Opportunity.searchOpportunities(
				token,
				searchOpportunity,
				pageToGet,
				7,
				["members", "specifications", "company"],
				filtersSelected
			).then((response) => {
				setTotalPages(response?.totalPages);
				setOpportunitiesPerPage({
					toItem: response?.toOpportunity,
					fromItem: response?.fromOpportunity,
					totalPages: response?.totalPages,
				});
				setTotalOpportunities(response?.totalOpportunities);
				setOpportunityList(response?.opportunities);
			});
		} else {
			Opportunity.getOpportunities(
				token,
				pageToGet,
				7,
				["members", "specifications", "company"],
				filtersSelected
			).then((response) => {
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
	}
	TabTitle("CAMM - Opportunities");
	return (
		<div className="w-full h-full flex flex-col mt-[88px] font-roboto mb-[20px] container">
			<div className="flex justify-center">
				<div className="flex flex-col w-[390px] w-min-[390px] bg-gray-7 px-[36px] py-[33px]">
					<h2 className="text-[18px] uppercase font-bold">Filters</h2>
					{filterList.map((filterItem) => (
						<div key={filterItem.id}>
							<div
								className="select-none flex justify-between text-[16px] border-b-[1px] border-grey leading-[36px] mt-[5px] hover:underline cursor-pointer"
								onClick={() => handleFilterAccordion(filterItem.id)}
							>
								<p>{filterItem.filterTitle}</p>
								<p>{`(${filterItem.filters.length})`}</p>
							</div>
							<div>
								{specificationsTypes?.map((type) => {
									const filteredItems = filterItem.filters?.filter(
										(specification) => specification?.type === type
									);
									return filteredItems.map((filter, key) => (
										<div
											className={cx(
												"transition-all duration-[500] overflow-hidden",
												filtersOpen.includes(filterItem.id)
													? "max-h-[200px]"
													: "max-h-0"
											)}
											key={key}
										>
											{key === 0 && (
												<div
													onClick={() => handleFilterAccordionType(type)}
													className="select-none ml-[23px] flex justify-between text-[16px] border-b-[1px] border-grey leading-[36px] mt-[5px] hover:underline cursor-pointer"
												>
													<p>{type}</p>
													<p>{`(${filteredItems.length})`}</p>
												</div>
											)}
											<div
												className={cx(
													"transition-all duration-[500] overflow-hidden",
													filtersOpenType.includes(type)
														? "max-h-[200px]"
														: "max-h-0"
												)}
												key={key}
											>
												<div className="ml-[46px] flex justify-between items-center text-[16px] hover:underline cursor-pointer border-b-[1px] border-grey leading-[36px] pt-[5px] ">
													<p>{filter.name}</p>
													<input
														onChange={() => {
															if (filter?.id)
																handleFilterSelection(filter?.id?.toString());
														}}
														value={filter?.id}
														style={{
															backgroundImage:
																filtersSelected?.specification_ids &&
																filtersSelected?.specification_ids.filter(
																	(item) => item === filter?.id?.toString()
																).length > 0
																	? `url(${"/assets/tick.svg"}`
																	: "",
														}}
														type="checkbox"
														className={cx(
															"mb-[5px] appearance-none h-4 w-4 border  rounded-sm bg-white focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-contain float-left bg-center mr-2 cursor-pointer",
															filtersSelected?.specification_ids &&
																filtersSelected?.specification_ids.filter(
																	(item) => item === filter?.id?.toString()
																).length > 0
																? "border-brightRed"
																: "border-grey"
														)}
													/>
												</div>
											</div>
										</div>
									));
								})}
							</div>
						</div>
					))}
					<div className="flex gap-[10px] mt-[30px]">
						<Button
							action={() => handleSearch()}
							text="apply"
							style="primary"
						/>
						<Button
							action={() => clearFilters()}
							text="clear"
							style="secondary"
						/>
					</div>
				</div>

				<div className="border-l border-gray-1 pl-[29px] mt-[24px]">
					<div className="flex items-center">
						<img
							onClick={() => navigate("/")}
							className="cursor-pointer h-[15px] w-[18px] mr-[19px]"
							src="./assets/backArrow.svg"
						/>
						<div>Home / </div>
						<div className="text-brightRed ml-[3px] ">Opportunities</div>
					</div>
					<div className="flex w-full justify-between items-center mt-[10px]  mb-[36px]">
						<p className="text-[24px] leading-[48px] font-medium">
							Opportunities
						</p>
						<div className="flex pl-5">
							<input
								onChange={(e) => setSearchOpportunity(e.target.value)}
								placeholder="Search here"
								required
								type="text"
								className="h-[48px] mr-[10px] form-control block w-full px-4 py-2 text-xl font-normal bg-white bg-clip-padding border border-solid border-grey rounded transition ease-in-out m-0  focus:bg-white  focus:outline-none focus:border-brightRed"
							/>
							<Button
								action={() => handleSearch()}
								text="search"
								iconRight="/assets/icons/search.svg"
								style="primary"
							/>
						</div>
					</div>
					<div className="flex flex-col gap-[15px]">
						{opportunityList.map((opportunity, key) => {
							return (
								<OpportunityDetails
									image={opportunity.company?.mainImage}
									members={opportunity?.companies}
									specifications={opportunity?.specifications}
									companyName={opportunity.company?.name}
									opportunityName={opportunity.title}
									mainText={opportunity.description}
									connectButton={true}
									companyEmail={opportunity.company?.contactEmail}
									opportunityId={opportunity?.id}
									opportunity={opportunity}
									key={key}
								/>
							);
						})}
						{totalOpportunities > 7 && (
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
			</div>
		</div>
	);
};

export default OpportunitiesListing;
