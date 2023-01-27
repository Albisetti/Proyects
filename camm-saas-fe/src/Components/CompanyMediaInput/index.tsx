import React, { ChangeEvent, useContext, useEffect, useState } from "react";
import cx from "classnames";
import CompanyMedia from "../../Models/CompanyMedia";
import { AuthContext } from "../../auth";
import { PaginationItems } from "../../Models/Utils/paginationItems";

type CompanyMediaInputProps = {
	company_id?: number;
	setCompanyMediaList: React.Dispatch<React.SetStateAction<CompanyMedia[]>>; //TODO: test
	companyMediaList: CompanyMedia[];
	setCompanyMediasPerPage: React.Dispatch<
		React.SetStateAction<PaginationItems>
	>;
	mediaPerPage: PaginationItems;
	setTotalCompanyMedia: React.Dispatch<React.SetStateAction<number>>;
	totalCompanyMedias: number;
	setAddingMedia: React.Dispatch<React.SetStateAction<boolean>>;
};
const CompanyMediaInput = ({
	company_id,
	setCompanyMediaList,
	companyMediaList,
	setCompanyMediasPerPage,
	mediaPerPage,
	setTotalCompanyMedia,
	totalCompanyMedias,
	setAddingMedia,
}: CompanyMediaInputProps) => {
	const { token } = useContext(AuthContext);

	const addMedia = (media: ChangeEvent<HTMLInputElement>) => {
		if (media?.target?.files && media?.target?.files?.length > 0) {
			if (company_id) {
				setAddingMedia(true);
				CompanyMedia.addCompanyMedia(
					token,
					company_id,
					media.target.files[0]
				).then((response) => {
					//TODO: test
					if (response !== false && response instanceof CompanyMedia) {
						//TODO: test
						setCompanyMediaList([response, ...companyMediaList]); //TODO: test
						setCompanyMediasPerPage({
							toItem: mediaPerPage.toItem + 1,
							fromItem: mediaPerPage.fromItem,
							totalPages: mediaPerPage.totalPages,
						});
						setTotalCompanyMedia(totalCompanyMedias + 1);
					}
					setAddingMedia(false);
				});
			}
		}
	};

	return (
		<div className="flex flex-col w-full h-full ">
			<label
				htmlFor={"company-media-input"}
				className="text-[10px] pb-[3px] font-semibold"
			>
				Add Media
			</label>
			<input
				className="h-10 "
				id={"company-media-input"}
				onChange={(e) => {
					addMedia(e);
				}}
				type="file"
			/>
		</div>
	);
};

export default CompanyMediaInput;
