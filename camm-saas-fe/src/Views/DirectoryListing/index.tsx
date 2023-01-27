import React, { useContext, useEffect, useState } from "react";
import OpportunityDetails from "../../Components/OpportunityDetails";
import cx from "classnames";
import Button from "../../Components/Utils/Buttons/Button";
import Pagination from "../../Components/Utils/Pagination";
import { PaginationItems } from "../../Models/Utils/paginationItems";
import Opportunity from "../../Models/Opportunity";
import { AuthContext } from "../../auth";
import Specification from "../../Models/Specification";
import { Link, useNavigate } from "react-router-dom";
import { TabTitle } from "../../Components/Utils/BrowserTitles";
import Company from "../../Models/Company";
import OpportunityCompanyCard from "../../Components/OpportunityUserCard";

type searchFilters = {
	specification_ids?: string[];
	specification_types?: string[];
};

type filterItem = {
	id: string;
	filterTitle: string;
	filters: Specification[];
};

const DirectoryListing = () => {
	const [filterList, setFilterList] = useState<filterItem[]>([]);
	const { token } = useContext(AuthContext);
	const [filtersOpen, setFiltersOpen] = useState<string[]>([]);
	const [filtersOpenType, setFiltersOpenType] = useState<string[]>([]);

	const [specificationsTypes, setSpecificationsTypes] = useState<string[]>([]);
	const [filtersSelected, setFiltersSelected] = useState<searchFilters>();
	const [pageToGet, setPageToGet] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [CompaniesPerPage, setCompaniesPerPage] = useState<PaginationItems>({
		toItem: 1,
		fromItem: 1,
		totalPages: 1,
	});
	const [totalCompanies, setTotalCompanies] = useState(1);
	const navigate = useNavigate();
	const [companyList, setCompanyList] = useState<Company[]>([]);
	const [searchCompany, setSearchCompany] = useState("");
	const [getMembers, setGetMembers] = useState(true);
	const [getNonMembers, setGetNonMembers] = useState(true);

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
		setGetMembers(false);
		setGetNonMembers(false);
	};

	useEffect(() => {
		if (!filtersSelected?.specification_ids && !getMembers && !getNonMembers)
			getCompanies();
	}, [filtersSelected, getMembers, getNonMembers]);

	const handleSearch = () => {
		getCompanies();
	};

	useEffect(() => {
		getCompanies();
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
		getCompanies();
	}, [pageToGet]);

	function getCompanies() {
		if (searchCompany) {
			Company.searchCompanies(
				token,
				searchCompany,
				pageToGet,
				filtersSelected,
				6
			).then((response) => {
				setTotalPages(response?.totalPages);
				setCompaniesPerPage({
					toItem: response?.toCompany,
					fromItem: response?.fromCompany,
					totalPages: response?.totalPages,
				});
				setTotalCompanies(response?.totalCompanies);
				setCompanyList(response?.companies);
			});
		} else {
			if (getMembers && getNonMembers) {
				Company.getCompanies(token, pageToGet, filtersSelected, 6).then(
					(response) => {
						setTotalPages(response?.totalPages);
						setCompaniesPerPage({
							toItem: response?.toCompany,
							fromItem: response?.fromCompany,
							totalPages: response?.totalPages,
						});
						setTotalCompanies(response?.totalCompanies);
						setCompanyList(response?.companies);
					}
				);
			}

			if (!getMembers && getNonMembers) {
				Company.getCompaniesNonMembers(token, pageToGet, filtersSelected).then(
					(response) => {
						setTotalPages(response?.totalPages);
						setCompaniesPerPage({
							toItem: response?.toCompany,
							fromItem: response?.fromCompany,
							totalPages: response?.totalPages,
						});
						setTotalCompanies(response?.totalCompanies);
						setCompanyList(response?.companies);
					}
				);
			}
			if (getMembers && !getNonMembers) {
				Company.getMembers(token, pageToGet, filtersSelected).then(
					(response) => {
						setTotalPages(response?.totalPages);
						setCompaniesPerPage({
							toItem: response?.toCompany,
							fromItem: response?.fromCompany,
							totalPages: response?.totalPages,
						});
						setTotalCompanies(response?.totalCompanies);
						setCompanyList(response?.companies);
					}
				);
			}
			if (!getMembers && !getNonMembers) {
				setTotalPages(0);
				setCompaniesPerPage({
					toItem: 0,
					fromItem: 0,
					totalPages: 0,
				});
				setTotalCompanies(0);
				setCompanyList([]);
			}
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
								<div className="flex justify-between items-center text-[16px] hover:underline cursor-pointer border-b-[1px] border-grey leading-[36px] pt-[5px] ">
									<p>Members</p>
									<input
										onChange={(event) => {
											setGetMembers(event?.target?.checked);
										}}
										checked={getMembers}
										style={{
											backgroundImage: getMembers
												? `url(${"/assets/tick.svg"}`
												: "",
										}}
										type="checkbox"
										className={cx(
											"mb-[5px] appearance-none h-4 w-4 border  rounded-sm bg-white focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-contain float-left bg-center mr-2 cursor-pointer",
											getMembers ? "border-brightRed" : "border-grey"
										)}
									/>
								</div>
								<div className="flex justify-between items-center text-[16px] hover:underline cursor-pointer border-b-[1px] border-grey leading-[36px] pt-[5px] ">
									<p>Non Members</p>
									<input
										onChange={(event) => {
											setGetNonMembers(event?.target?.checked);
										}}
										checked={getNonMembers}
										style={{
											backgroundImage: getNonMembers
												? `url(${"/assets/tick.svg"}`
												: "",
										}}
										type="checkbox"
										className={cx(
											"mb-[5px] appearance-none h-4 w-4 border  rounded-sm bg-white focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-contain float-left bg-center mr-2 cursor-pointer",
											getNonMembers ? "border-brightRed" : "border-grey"
										)}
									/>
								</div>
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

				<div className="border-l border-gray-1 mt-[24px]  px-4">
					<div className="flex items-center">
						<img
							onClick={() => navigate("/")}
							className="cursor-pointer h-[15px] w-[18px] mr-[19px]"
							src="./assets/backArrow.svg"
						/>
						<div>Home / </div>
						<div className="text-brightRed ml-[3px] ">Companies</div>
					</div>
					<div className="flex w-full justify-between items-center mt-[10px]  mb-[36px]">
						<p className="text-[24px] leading-[48px] font-medium">Companies</p>
						<div className="flex pl-5">
							<input
								onChange={(e) => setSearchCompany(e.target.value)}
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
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-[15px]">
						{companyList.map((company, key) => {
							return (
								<div
									className="flex bg-gray-3 md:w-[320px]"
									key={key}
									onClick={(event) => {
										event.stopPropagation();
									}}
								>
									<Link
										to={
											company?.isMember
												? `/member-profile/${company?.id}`
												: `/company/${company?.id}`
										}
										target="_blank"
									>
										<img
											className="mt-[10px] md:ml-[10px] md:w-[300px] md:h-[210px] w-full h-[76px]"
											src={
												company.mainImage
													? company.mainImage
													: "/assets/imagePlaceholder.png"
											}
										/>
										<div>
											<p className="mt-[14px] ml-[10px] font-normal text-base">
												{company.name}
											</p>
											<p className="mt-[14px] ml-[10px] font-normal text-base">
												{company.country}
											</p>
											<p className="mt-[14px] ml-[10px] font-normal text-base">
												{company.city}
											</p>
										</div>
									</Link>
								</div>
							);
						})}
					</div>
					{totalCompanies > 7 && (
						<Pagination
							pageToGet={pageToGet}
							setPageToGet={setPageToGet}
							totalPages={totalPages}
							itemsPerPage={CompaniesPerPage}
							totalItems={totalCompanies}
						/>
					)}
				</div>
			</div>
		</div>
	);
};

export default DirectoryListing;
