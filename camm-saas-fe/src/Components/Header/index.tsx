import React, { FC, ReactElement, useContext, useEffect } from "react";
import { AuthContext } from "../../auth";
import BaseHeader from "./BaseHeader";
import LoggedInHeader from "../Header/LoggedInHeader";

type HeaderProps = {
	setShowAuthModal: React.Dispatch<
		React.SetStateAction<{
			signUp: boolean;
			logIn: boolean;
		}>
	>;
};

const Header: FC<HeaderProps> = ({ setShowAuthModal }): ReactElement => {
	const { isLoggedIn } = useContext(AuthContext);

	useEffect(() => {
		setShowAuthModal({ signUp: true, logIn: true });
	}, [isLoggedIn]);

	return (
		<>
			{isLoggedIn ? (
				<LoggedInHeader setShowAuthModal={setShowAuthModal} />
			) : (
				<BaseHeader setShowAuthModal={setShowAuthModal} />
			)}
		</>
	);
};
export default Header;
