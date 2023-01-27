/* eslint-disable indent */
import React, { FC, useState, useContext } from "react";
import { PaginationItems } from "../../Models/Utils/paginationItems";
import CompanyMedia from "../../Models/CompanyMedia";
import Modal from "../Utils/Modal";

type companyMediaListProps = {
	companyMediaList: CompanyMedia[];
	setCompanyMediasPerPage: React.Dispatch<
		React.SetStateAction<PaginationItems>
	>;
	mediaPerPage: PaginationItems;
	setTotalCompanyMedia: React.Dispatch<React.SetStateAction<number>>;
	totalCompanyMedias: number;
};

const CompanyMediaGallery: FC<companyMediaListProps> = ({
	companyMediaList,
	setCompanyMediasPerPage,
	mediaPerPage,
	setTotalCompanyMedia,
	totalCompanyMedias,
}: companyMediaListProps) => {
	const [expandModalUrl, setExpandModalUrl] = useState<string>();
	const [expandModalType, setExpandModalType] = useState<string>();
	const [expandImageModal, setExpandImageModal] = useState<boolean>(false);

	return (
		<>
			<Modal
				modalActive={expandImageModal}
				modalActiveControl={() => setExpandImageModal(false)}
				darkBg={false}
			>
				{expandModalType === "image" ? (
					<img
						src={expandModalUrl}
						className="bg-cover bg-no-repeat bg-center h-full w-full pt-2"
					/>
				) : (
					<video
						controls
						className="w-full h-full pt-2"
						src={expandModalUrl}
					></video>
				)}
			</Modal>
			<div className="grid grid-cols-2 gap-[10px] w-[320px]">
				{companyMediaList?.map((companyMedia: CompanyMedia, key) => {
					switch (companyMedia?.mime_type) {
						case "image/jpg":
						case "image/jpeg":
						case "image/png":
							return (
								<img
									src={companyMedia?.url}
									className="bg-cover bg-no-repeat bg-center h-[80px] w-[160px] cursor-pointer"
									onClick={() => {
										if (!companyMedia?.url) return;
										setExpandModalUrl(companyMedia?.url);
										setExpandImageModal(true);
										setExpandModalType("image");
									}}
								/>
							);
						case "video/webm":
						case "video/mpeg":
						case "video/mp4":
							//TODO video media
							return (
								<video
									width="120"
									height="80"
									controls
									src={companyMedia?.url}
									onClick={() => {
										if (!companyMedia?.url) return;
										setExpandModalUrl(companyMedia?.url);
										setExpandImageModal(true);
										setExpandModalType("video");
									}}
								></video>
							);

						default:
							break;
					}
				})}
			</div>
		</>
	);
};

export default CompanyMediaGallery;
