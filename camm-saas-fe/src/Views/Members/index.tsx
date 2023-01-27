import React, { FC, useContext, useState, useEffect } from "react";
import Company from "../../Models/Company";
import { AuthContext } from "../../auth";
import Button from "../../Components/Utils/Buttons/Button";
import Pagination from "../../Components/Utils/Pagination";
import { PaginationItems } from "../../Models/Utils/paginationItems";
import AddCompanyModal from "../../Components/AddCompanyModal";
import Modal from "../../Components/Utils/Modal";
import { useNavigate } from "react-router-dom";
import { TabTitle } from "../../Components/Utils/BrowserTitles";
import CompanyListNoEdit from "../../Components/CompanyListNoEdit";

const Members: FC = () => {
	const { token } = useContext(AuthContext);
	const [pageToGet, setPageToGet] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [totalCompanies, setTotalCompanies] = useState(1);
	const [searchCompany, setSearchCompany] = useState("");
	const [companyList, setCompanyList] = useState<Company[]>([]);
	const [companiesPerPage, setCompaniesPerPage] = useState<PaginationItems>({
		toItem: 1,
		fromItem: 1,
		totalPages: 1,
	});
	const [activeAddCompanyModal, setActiveAddCompanyModal] = useState(false);
	const navigate = useNavigate();

	function getCompanies() {
		Company.getMembers(token, pageToGet).then((response) => {
			setTotalPages(response?.totalPages);
			setCompaniesPerPage({
				toItem: response?.toCompany,
				fromItem: response?.fromCompany,
				totalPages: response?.totalPages,
			});
			setTotalCompanies(response?.totalCompanies);
			setCompanyList(response?.companies);
		});
	}

	useEffect(() => {
		if (searchCompany) {
			Company.searchCompanies(token, searchCompany, pageToGet).then(
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
		} else {
			getCompanies();
		}
	}, [pageToGet, searchCompany]);
	TabTitle("CAMM - Manage Companies");
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
					<div className="text-brightRed ml-[3px] ">Members </div>
				</div>
				<div className="flex justify-between items-center mt-[28px] mb-[24px] ">
					<div className="text-[36px] leading-[48px]">Members</div>
					<div className="flex justify-center items-center gap-[11px]">
						<div className="relative">
							<input
								onChange={(event) => {
									setSearchCompany(event?.target?.value);
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
					<Modal
						modalActive={activeAddCompanyModal}
						modalActiveControl={() => setActiveAddCompanyModal(false)}
					>
						<AddCompanyModal
							setActiveAddModal={() => setActiveAddCompanyModal(false)}
							getCompanies={getCompanies}
						/>
					</Modal>

					<CompanyListNoEdit
						companyList={companyList}
						setCompaniesPerPage={setCompaniesPerPage}
						companiesPerPage={companiesPerPage}
						setTotalCompanies={setTotalCompanies}
						totalCompanies={totalCompanies}
					/>
				</div>

				{totalCompanies > 50 && (
					<Pagination
						pageToGet={pageToGet}
						setPageToGet={setPageToGet}
						totalPages={totalPages}
						itemsPerPage={companiesPerPage}
						totalItems={totalCompanies}
					/>
				)}
			</div>
		</div>
	);
};

export default Members;
