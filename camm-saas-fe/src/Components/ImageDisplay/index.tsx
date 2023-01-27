import React from "react";

type ImageDisplayProps = {
	image?: string | undefined;
};

const ImageDisplay = ({ image }: ImageDisplayProps) => {
	return (
		<div className="flex w-full h-full ">
			<label
				htmlFor="file-input"
				className="cursor-pointer relative h-full w-full group"
			>
				<a href={image} target="_blank" rel="noreferrer">
					<div
						className="w-full h-full absolute top-0 left-0 bg-cover bg-no-repeat bg-center"
						style={{
							backgroundImage: `url(${
								image ? image : "/assets/smallImagePlaceholder.png"
							})`,
						}}
					/>
				</a>
			</label>
		</div>
	);
};

export default ImageDisplay;
