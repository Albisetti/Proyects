import React, { FC, useState, useContext, useEffect } from "react";
import User from "../../Models/User";
import { AuthContext } from "../../auth";
import Select from "react-select";

import Button from "../Utils/Buttons/Button";
import Company from "../../Models/Company";

type ApproveUserModalProps = {
	user: User;
	setActiveUserEditModal: () => void;
};

const ApproveUserModal: FC<ApproveUserModalProps> = ({
	user,
	setActiveUserEditModal,
}: ApproveUserModalProps) => {
	const { token } = useContext(AuthContext);

	const [approveStatus, setApproveStatus] = useState(
		"Do you wish to approve this user?"
	);

	const [organizationSearch, setOrganizationSearch] = useState<string>();
	const [organizationOptions, setOrganizationOptions] =
		useState<{ value: number; label: string }[]>();
	const [organizationForUser, setOrganizationForUser] = useState<number>();

	const handleSubmit = () => {
		if (user?.id) {
			user
				.update(
					token,
					undefined,
					undefined,
					undefined,
					undefined,
					undefined,
					undefined,
					undefined,
					undefined,
					undefined,
					undefined,
					undefined,
					organizationForUser
				)
				.then(() => {
					if (user?.id) {
						user.approve(token, user.id).then((response) => {
							if (response) {
								setActiveUserEditModal();
							} else {
								setApproveStatus("Oops! Something went wrong, try again later");
							}
						});
					}
				});
		}
	};

	useEffect(() => {
		if (!organizationSearch) return;
		Company.searchCompanies(token, organizationSearch, 1).then((response) => {
			const newOrganizationOptionsArray: { value: number; label: string }[] =
				[];
			response?.companies?.forEach((company) => {
				if (!company?.id || !company?.name) return;
				const newCompanyForArray = { value: company?.id, label: company?.name };
				newOrganizationOptionsArray.push(newCompanyForArray);
			});
			setOrganizationOptions(newOrganizationOptionsArray);
		});
	}, [organizationSearch]);

	useEffect(() => {
		const organizationList: { value: number; label: string }[] = [];
		Company.getCompanies(token, 1).then((response) => {
			response?.companies?.map((company) => {
				if (company.id && company.name)
					organizationList.push({
						value: company.id,
						label: company.name,
					});
			});
			setOrganizationOptions(organizationList);
		});
	}, []);

	return (
		<div className="font-roboto text-[18px] text-gray bg-white">
			<div className="mb-6">{approveStatus}</div>
			<div className="flex flex-col mb-6">
				<div className="mb-2">
					<span className="text-black font-bold">Name: </span>
					{user?.firstName} {user?.lastName}
				</div>
				<div className="mb-2">
					<span className="text-black font-bold">Email: </span>
					{user?.email}
				</div>
				<div className="mb-2">
					<span className="text-black font-bold">
						Organization written by user:{" "}
					</span>
					{user?.askedRelatedCompany}
				</div>
				<div className="mb-2">
					<span className="text-black font-bold">
						Organization Selected by admin:{" "}
					</span>
					<Select
						options={organizationOptions}
						onChange={(event) => {
							setOrganizationForUser(event?.value);
						}}
						onInputChange={(event) => {
							setOrganizationSearch(event);
						}}
						className="focus:border-brightRed form-control block w-full text-xl font-normal bg-white bg-clip-padding rounded transition ease-in-out m-0  focus:bg-white  focus:outline-none"
					/>
				</div>
			</div>
			<div className="flex justify-center gap-5">
				<Button text="cancel" action={() => setActiveUserEditModal()} />
				<Button text="confirm" action={() => handleSubmit()} />
			</div>
		</div>
	);
};

export default ApproveUserModal;
