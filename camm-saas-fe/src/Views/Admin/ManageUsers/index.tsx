import React, { FC, useContext, useState, useEffect } from "react";
import User from "../../../Models/User";
import { AuthContext } from "../../../auth";
import UserList from "../../../Components/UserList";
import { useNavigate } from "react-router-dom";
import Button from "../../../Components/Utils/Buttons/Button";
import Pagination from "../../../Components/Utils/Pagination";
import { PaginationItems } from "../../../Models/Utils/paginationItems";
import AddUserModal from "../../../Components/AddUserModal";
import Modal from "../../../Components/Utils/Modal";
import { TabTitle } from "../../../Components/Utils/BrowserTitles";
import Company from "../../../Models/Company";

const ManageUsers: FC = () => {
	const { token } = useContext(AuthContext);
	const [pageToGet, setPageToGet] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [totalUsers, setTotalUsers] = useState(1);
	const [searchUser, setSearchUser] = useState("");
	const [activeAddModal, setActiveAddModal] = useState(false);
	const [userList, setUserList] = useState<User[]>([]);
	const [usersPerPage, setUsersPerPage] = useState<PaginationItems>({
		toItem: 1,
		fromItem: 1,
		totalPages: 1,
	});
	const [companyList, setCompanyList] = useState<Company[]>();
	const navigate = useNavigate();

	function getUsers() {
		User.getUsers(
			token,
			pageToGet,
			[{ name: "confirmed_at", direction: "asc" }],
			["company"]
		).then((response) => {
			setTotalPages(response?.totalPages);
			setUsersPerPage({
				toItem: response?.toUser,
				fromItem: response?.fromUser,
				totalPages: response?.totalPages,
			});
			setTotalUsers(response.totalUsers);
			setUserList(response?.users);
		});
	}

	useEffect(() => {
		if (searchUser) {
			User.searchUsers(token, searchUser, pageToGet, ["company"]).then(
				(response) => {
					setTotalPages(response?.totalPages);
					setUsersPerPage({
						toItem: response?.toUser,
						fromItem: response?.fromUser,
						totalPages: response?.totalPages,
					});
					setTotalUsers(response.totalUsers);
					setUserList(response?.users);
				}
			);
		} else {
			getUsers();
		}
	}, [pageToGet, searchUser]);

	useEffect(() => {
		Company.getCompanies(token, 1).then((res) => {
			//TODO: apparently their is a second getCompany somwhere, could we combine and reduce the amount of calls made?
			setCompanyList(res.companies);
		});
	}, []);
	TabTitle("CAMM - Manage Users");
	return (
		<div className="container w-full h-full mt-[110px] font-roboto mb-[30px]">
			<Modal
				modalActive={activeAddModal}
				modalActiveControl={() => setActiveAddModal(false)}
			>
				<AddUserModal
					active={activeAddModal}
					setActiveAddModal={() => setActiveAddModal(false)}
					getUsers={getUsers}
					companyList={companyList}
				/>
			</Modal>

			<div className=" ml-[39px] mr-[41px]">
				<div className="flex items-center" onClick={() => navigate("/")}>
					<img
						className="cursor-pointer h-[15px] w-[18px] mr-[19px]"
						src="./assets/backArrow.svg"
					></img>
					<div>Home / </div>
					<div className="text-brightRed ml-[3px] ">Users </div>
				</div>
				<div className="flex justify-between items-center mt-[28px] mb-[24px] ">
					<div className="text-[36px] leading-[48px]">Users</div>
					<div className="flex justify-center items-center gap-[11px]">
						<Button
							text="add new user"
							action={() => {
								setActiveAddModal(true);
							}}
						/>

						<div className="relative">
							<input
								onChange={(event) => {
									setSearchUser(event?.target?.value);
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
					<UserList
						userList={userList}
						setUsersPerPage={setUsersPerPage}
						usersPerPage={usersPerPage}
						setTotalUsers={setTotalUsers}
						totalUsers={totalUsers}
						companyList={companyList}
					/>
				</div>
				{totalUsers > 50 && (
					<Pagination
						pageToGet={pageToGet}
						setPageToGet={setPageToGet}
						totalPages={totalPages}
						itemsPerPage={usersPerPage}
						totalItems={totalUsers}
					/>
				)}
			</div>
		</div>
	);
};

export default ManageUsers;
