import React, { FC, useState, useContext } from "react";
import User from "../../Models/User";
import { AuthContext } from "../../auth";
import TextPill from "../../Components/TextPill";
import PriorDeleteModal from "../DeleteModals/PriorDeleteModal";
import ConfirmedDeletedModal from "../DeleteModals/ConfirmedDeletedModal";
import { PaginationItems } from "../../Models/Utils/paginationItems";
import UserEditModal from "../UserEditModal";
import { useNavigate } from "react-router-dom";
import Modal from "../Utils/Modal";
import ApproveUserModal from "../ApproveUserModal";
import Company from "../../Models/Company";
import { useEffect } from "react";

type UserListProps = {
	userList: User[];
	setUsersPerPage: React.Dispatch<React.SetStateAction<PaginationItems>>;
	setTotalUsers: React.Dispatch<React.SetStateAction<number>>;
	totalUsers: number;
	usersPerPage: PaginationItems;
	companyList?: Company[];
};

const UserList: FC<UserListProps> = ({
	userList,
	setUsersPerPage,
	usersPerPage,
	setTotalUsers,
	totalUsers,
	companyList,
}: UserListProps) => {
	const [allCheckedBoxes, setAllCheckedBoxes] = useState(false);
	const [activeUserEditModal, setActiveUserEditModal] = useState(false);
	const [userSelected, setUserSelected] = useState(new User(""));
	const [activeApproveModal, setActiveApproveModal] = useState(false);
	const [activeDeleteModal, setActiveDeleteModal] = useState(false);
	const [activeConfirmedDeleteModal, setActiveConfirmedDeleteModal] =
		useState(false);
	const [deleted, setDeleted] = useState<User[]>([]);
	const { token } = useContext(AuthContext);
	const navigate = useNavigate();
	const DeleteUserFunction = (key: number, user: User) => {
		userList.splice(key, 1);
		user.delete(token).then((response) => {
			if (response) {
				setDeleted((currentlyDeleted) => [...currentlyDeleted, user]);
				setUsersPerPage({
					toItem: usersPerPage.toItem - 1,
					fromItem: usersPerPage.fromItem,
					totalPages: usersPerPage.totalPages,
				});
				setTotalUsers(totalUsers - 1);
				setActiveDeleteModal(false);
				setActiveConfirmedDeleteModal(true);
			}
		});
	};

	return (
		<div className="w-full h-full font-roboto">
			<Modal
				modalActive={!!activeUserEditModal}
				modalActiveControl={() => setActiveUserEditModal(false)}
			>
				<UserEditModal
					key={"edit"}
					active={activeUserEditModal}
					user={userSelected}
					setActiveUserEditModal={() => setActiveUserEditModal(false)}
					companyList={companyList}
				/>
			</Modal>
			<Modal
				modalActive={activeApproveModal}
				modalActiveControl={() => setActiveApproveModal(false)}
				darkBg={false}
				cross={false}
			>
				<ApproveUserModal
					user={userSelected}
					setActiveUserEditModal={() => setActiveApproveModal(false)}
				/>
			</Modal>

			<div className="flex w-full">
				<div className="flex flex-col mt-[5px] w-full">
					<div className="flex w-full justify-between text-[12px] leading-[24px] font-semibold border-b border-gray-1 pb-[8px]">
						<div className="flex justify-between w-[35%] min-w-[150px]">
							<div className="flex">
								<div className="flex justify-between items-center ">
									<div className="form-group form-check">
										<input
											onClick={() => {
												setAllCheckedBoxes(!allCheckedBoxes);
											}}
											style={{
												backgroundImage: allCheckedBoxes
													? `url(${"/assets/tick.svg"})`
													: "",
											}}
											type="checkbox"
											className=" mb-[5px] appearance-none h-4 w-4 border border-grey rounded-sm bg-white checked:border-brightRed focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
										/>
									</div>
								</div>
								<div className="">USERNAME</div>
							</div>
							<div className="flex">
								<div className="">EMAIL</div>
							</div>
						</div>
						<div className="flex">
							<div className="">COMPANY</div>
						</div>
						<div className="flex justify-between w-[220px] min-w-[120px] text-left">
							<div className="ml-[12px]">STATUS</div>
							<div className="mr-1">ACTION</div>
						</div>
					</div>

					{userList?.map((user: User, key) => (
						<>
							<PriorDeleteModal
								instanceToDelete="user"
								active={activeDeleteModal}
								deleteFunction={() => DeleteUserFunction(key, user)}
								setActiveDeleteModal={() => setActiveDeleteModal(false)}
							/>
							<ConfirmedDeletedModal
								instanceToDelete="User"
								active={activeConfirmedDeleteModal}
								setActiveConfirmedDeleteModal={() =>
									setActiveConfirmedDeleteModal(false)
								}
							/>
							{!deleted.includes(user) && (
								<>
									<div
										className="flex justify-between border-b border-gray-1 py-[6px]"
										key={key}
									>
										<div className="flex justify-between w-[35%] text-[14px] leading-[24px]">
											<div className="flex  min-w-max">
												<div className="flex justify-between items-center ">
													<div className="form-group form-check">
														<input
															checked={
																allCheckedBoxes ? allCheckedBoxes : undefined
															}
															type="checkbox"
															className=" mb-[5px] appearance-none checked:bg-checkboxBackground h-[16px] w-[16px] border border-grey rounded-sm bg-white  checked:border-brightRed focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
														/>
													</div>
												</div>
												<span className="flex">
													{user.firstName} {user.lastName}
												</span>
											</div>
											<div className="flex min-w-max">
												<span className="flex">{user.email}</span>
											</div>
										</div>
										<div className="flex min-w-max">
											<span className="flex">{user.company?.name}</span>
										</div>
										<div className="flex justify-between">
											<div className="mr-12">
												{user?.approved ? (
													<div className="mr-14">
														<TextPill
															text="ACTIVE"
															color="#B2C290"
															textSize="14px"
															textColor="#FFFFFF"
														/>
													</div>
												) : (
													<div className="mr-8">
														<TextPill
															text="PENDING APPROVAL"
															color="#FFA500"
															textSize="14px"
															textColor="#FFFFFF"
														/>
													</div>
												)}
											</div>

											<div className="flex gap-[6px]">
												{!user?.approved && (
													<img
														onClick={() => {
															setUserSelected(user);

															setActiveApproveModal(true);
														}}
														className="cursor-pointer h-[20px] w-[20px]"
														src="./assets/tick.svg"
													></img>
												)}
												<img
													onClick={() => {
														setUserSelected(user);
														setActiveUserEditModal(true);
													}}
													className="cursor-pointer h-[24px] w-[24px]"
													src="./assets/pencilBlack.svg"
												></img>
												<img
													onClick={() => {
														setActiveDeleteModal(true);
													}}
													className="cursor-pointer h-[24px] w-[24px]"
													src="./assets/carbon_trash-can.svg"
												></img>
											</div>
										</div>
									</div>
								</>
							)}
						</>
					))}
				</div>
			</div>
		</div>
	);
};

export default UserList;
