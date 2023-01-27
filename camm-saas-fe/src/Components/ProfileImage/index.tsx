import React, { FC } from "react";

type ProfileImageProps = {
	image?: string;
	size: string;
};

const ProfileImage: FC<ProfileImageProps> = ({
	image,
	size,
}: ProfileImageProps) => {
	return (
		<div
			style={{
				backgroundImage: `url(${
					image && image !== "undefined" ? image : "/assets/profile-image.svg"
				})`,
				height: `${size}`,
				width: `${size}`,
			}}
			className="rounded-full bg-cover bg-no-repeat bg-center"
		/>
	);
};

export default ProfileImage;
