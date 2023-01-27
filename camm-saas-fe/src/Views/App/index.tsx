import React, { useState, useContext } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginModal from "../../Components/LoginModal";
import SignUpModal from "../../Components/SignUpModal";
import Header from "../../Components/Header";
import EmailConfirmation from "../Users/EmailConfirmation";
import PasswordResetResult from "../Users/PasswordResetResult";
import ManageUsers from "../Admin/ManageUsers";
import ManageCompanies from "../Admin/ManageCompany";
import WelcomeToCAMM from "../WelcomeToCAMM";
import UserProfile from "../Users/UserProfile";
import { AuthContext } from "../../auth";
import ManageOpportunities from "../Admin/ManageOpportunities";
import MemberProfile from "../MemberProfile";
import Company from "../../Models/Company";
import Directory from "../Directory";
import NotFound from "../NotFound";
import Opportunities from "../Opportunities/OpportunitiesListing";
import DirectoryListing from "../DirectoryListing";
import CompanyProfile from "../Company/CompanyProfile";
import CreateOpportunity from "../Opportunities/CreateOpportunity";
import ForgotPasswordModal from "../../Components/ForgotPasswordModal";
import ConfirmPassword from "../Users/ConfirmPassword";
import { TabTitle } from "../../Components/Utils/BrowserTitles";
import ProfileNotFound from "../ProfileNotFound";
import Companies from "../Companies";
import Members from "../Members";
import OpportunityProfile from "../Opportunities/Opportunity";
import RequestedOpportunity from "../Opportunities/RequestedOpportunity";

const companyTest = new Company(
	undefined,
	"Laval International",
	"4965 Concession Rd. 8",
	undefined,
	undefined,
	"Tecumseh",
	"Ontario",
	"Canada",
	undefined,
	undefined,
	undefined,
	"Our versatile manufacturing centers allows us to start & finish your job all under one roof. We have integrated our facility to retain control of all our core processes. LAVAL has the equipment, experience & commitment to finish your moulds to your specifications and tolerances. Our variety of manufacturing centers allows us to choose the most cost effective method to transform a raw block of steel into your customized production tool.",
	{
		facebookURL: "facebook.com",
		instagramURL: "instagram.com",
		linkedinURL: "linkedin.com",
		twitterURL: "twitter.com",
	},
	"https://pbs.twimg.com/profile_images/1113485423999967233/EQaJb34__400x400.png"
);

const App = () => {
	const [showAuthModal, setShowAuthModal] = useState({
		signUp: true,
		logIn: true,
	});

	useState("Saving...");

	const { user, isLoggedIn } = useContext(AuthContext);

	return (
		<>
			<BrowserRouter>
				<Header setShowAuthModal={setShowAuthModal} />
				<Routes>
					<Route path="/" element={<WelcomeToCAMM />}></Route>
					<Route
						path="/login"
						element={
							<LoginModal
								showAuthModal={showAuthModal}
								setShowAuthModal={setShowAuthModal}
							/>
						}
					></Route>
					<Route
						path="/signup"
						element={
							<SignUpModal
								showAuthModal={showAuthModal}
								setShowAuthModal={setShowAuthModal}
							/>
						}
					></Route>
					<Route
						path="/forgot-password"
						element={<ForgotPasswordModal showAuthModal={showAuthModal} />}
					></Route>
					<Route
						path="/password-reset-result"
						element={<PasswordResetResult />}
					></Route>
					<Route
						path="/forgot-password-email"
						element={<EmailConfirmation />}
					></Route>
					<Route path="/confirm-email" element={<EmailConfirmation />}></Route>
					<Route
						path="/confirm-password/:slug"
						element={<ConfirmPassword />}
					></Route>
					{isLoggedIn && (
						<>
							{/* User Routes */}
							{/* <Route path="/user" element={<UserProfile user={user} />}></Route>
							<Route path="/user/:slug" element={<UserProfile />}></Route> */}

							{/* Admin Routes */}
							<Route
								path="/manage-companies"
								element={<ManageCompanies />}
							></Route>
							<Route path="/companies" element={<Companies />}></Route>
							<Route
								path="/directory-listing"
								element={<DirectoryListing />}
							></Route>

							<Route path="/members" element={<Members />}></Route>
							<Route
								path="/manage-opportunities"
								element={<ManageOpportunities />}
							></Route>
							<Route path="/manage-users" element={<ManageUsers />}></Route>

							{/* Company / Member Routes */}
							<Route
								path="/member-profile/:slug"
								element={<MemberProfile />}
							></Route>
							<Route
								path="/opportunity/:slug"
								element={<OpportunityProfile />}
							></Route>
							<Route path="/company/:slug" element={<CompanyProfile />}></Route>

							<Route
								path="/member-profile-not-found"
								element={<ProfileNotFound />}
							></Route>
							<Route path="/company/:slug" element={<CompanyProfile />}></Route>

							{/* Opportunity Routes */}
							<Route path="/opportunities" element={<Opportunities />}></Route>
							<Route
								path="/create-opportunity"
								element={<CreateOpportunity />}
							></Route>
							<Route
								path="/opportunity-requested"
								element={<RequestedOpportunity />}
							></Route>

							{/* Directory Routes */}
							<Route path="/directory" element={<Directory />}></Route>
							<Route
								path="/directory-listing"
								element={<DirectoryListing />}
							></Route>
						</>
					)}

					{/* 404 Route */}
					<Route path="*" element={<NotFound />} />
				</Routes>
			</BrowserRouter>
		</>
	);
};
export default App;
