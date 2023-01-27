import React, { FC } from "react";

type HeroProps = {
	image?: string;
};

const Hero: FC<HeroProps> = ({ image }: HeroProps) => {
	return (
		<div
			style={{
				backgroundImage: `url(${
					image ? image : "/assets/coverPlaceholder.png"
				})`,
			}}
			className="w-full h-full bg-no-repeat bg-cover bg-center"
		></div>
	);
};

export default Hero;
