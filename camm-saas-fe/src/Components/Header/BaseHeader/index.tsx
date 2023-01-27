import React, { FC, ReactElement } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../Utils/Buttons/Button";

type HeaderProps = {
	setShowAuthModal: React.Dispatch<
		React.SetStateAction<{
			signUp: boolean;
			logIn: boolean;
		}>
	>;
};

const BaseHeader: FC<HeaderProps> = ({ setShowAuthModal }): ReactElement => {
	const navigate = useNavigate();
	return (
		<>
			<div
				className={`bg-paleRed fixed w-full z-[90]
				 h-[80px] top-0 left-0`}
			>
				<header className=" bg-paleRed justify-between flex ">
					<div className="h-[48px] w-[176px] ml-[36px]  py-[16px] ">
						<a className="flex" href="/">
							<img className="h-[48px] w-[176px] " src="/CammLogo.png" alt="" />
						</a>
					</div>
					<div className="py-[16px] pr-[30px]">
						<div className="grid grid-cols-2 w-[200px] ">
							<Button
								text="sign up"
								action={() => {
									setShowAuthModal &&
										setShowAuthModal({
											signUp: true,
											logIn: false,
										});
									navigate("/signup");
								}}
							/>
							<Button
								text="log in"
								style="outline"
								action={() => {
									setShowAuthModal &&
										setShowAuthModal({
											signUp: false,
											logIn: true,
										});
									navigate("/login");
								}}
							/>
						</div>
					</div>
				</header>
			</div>
		</>
	);
};

export default BaseHeader;
