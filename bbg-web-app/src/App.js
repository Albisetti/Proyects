import Header1 from "./components/Header/Header1";
import React from "react";
import { Route, withRouter } from "react-router";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import "./styles/index.scss";
import "react-datepicker/dist/react-datepicker.css";
import "react-day-picker/lib/style.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Claims from "./components/Pages/Claims";

import CreateClaim from "./components/Pages/Claims/Components/CreateClaim/Claims";
import FactoryWorkflow from "./components/Pages/Claims/Components/FactoryWorkflow/FactoryWorkflow";
import Program from "./components/Pages/Programs/Program";
import Administrators from "./components/Administrators";
import Login from "./components/Pages/Login/Login";
import Builders from "./components/Pages/Builders";
import Addressses from "./components/Pages/ReportingRebates/Components/Addresses";
import Bundles from "./components/Pages/ReportingRebates/Components/Bundles/Bundles";
import Assignment from "./components/Pages/ReportingRebates/Components/Assignment";
import ProofPointAssignment from "./components/Pages/ReportingRebates/Components/ProofPointAssignment";
import Prepare from "./components/Pages/ReportingRebates/Components/Prepare";
import SubContractor from "./components/Pages/SubContractor";
import Suppliers from "./components/Pages/Suppliers";
import WithClearCache from "./ClearCache";
import TerritoryManager from "./components/Pages/TerritoryManager";
import { AuthProvider } from "./contexts/auth";
import PublicRoute from "./components/routes/PublicRoute";
import BuilderTMRoute from "./components/routes/BuilderTMRoute";
import AdminRoute from "./components/routes/AdminRoute";
import BatchCorrection from "./components/Pages/ReportingRebates/BatchCorrection";
import ConversionRevenue from "./components/Pages/Claims/Components/ConversionRevenue/ConversionRevenue";
import History from "./components/Pages/Claims/Components/ClaimHistory/History";
import ClosePeriod from "./components/Pages/Claims/Components/ClosePeriod/ClosePeriod";
import Training from "./components/Pages/Resources/Training";
import BuilderProgram from "./components/Pages/Programs/BuilderPrograms";
import TMRoute from "./components/routes/TMRoute";
import ConfirmAccount from "./components/ConfirmAccount";
import ResetPassword from "./components/ResetPassword";

import ImpersonationContainer from "./components/ForceImpersonationModal/ImpersonationContainer";
import AdminTmRoute from "./components/routes/AdminTMRoute";
//import Reporting from "./components/Pages/Analytics/Reporting";
import Programs from "./components/Portal/Programs";
import PortalProgram from "./components/Portal/PortalProgram";
import SingleEvent from "./components/Pages/Resources/SingleEvent";

const HeaderWithRouter = withRouter(Header1);

const MainApp = () => {
    const contextClass = {
        success: "bg-primary",
        error: "bg-brickRed",
        info: "bg-brickGreen",
        warning: "bg-orange-400",
        default: "bg-indigo-600",
        dark: "bg-white-600 font-gray-300",
    };

    return (
        <div
            className="min-h-screen"
            style={{
                background: `rgba(43, 37, 37, 0.07)  no-repeat`,
                backgroundSize: "100%",
            }}
        >
            <ToastContainer
                toastClassName={({ type }) =>
                    contextClass[type || "default"] +
                    " relative flex p-1 min-h-10 rounded-md justify-between overflow-hidden cursor-pointer"
                }
                bodyClassName={() => "text-sm font-white font-med block p-3"}
                position="top-right"
                hideProgressBar={true}
                autoClose={3000}
            />

            <Router>
                <AuthProvider>
                    <HeaderWithRouter />
                    {/* <SubNavWithRouter /> */}
                    <Switch>
                        <PublicRoute exact path="/login" component={Login} />
                        <Route path="/forgot/:code" component={ResetPassword} />
                        <Route
                            path="/confirm/:code"
                            component={ConfirmAccount}
                        />
                        <BuilderTMRoute exact path="/" component={Dashboard} />
                        {/* <BuilderTMRoute
                            exact
                            path="/reporting"
                            component={Reporting}
                        /> */}
                        <AdminRoute exact path="/claims" component={Claims} />
                        <AdminRoute
                            exact
                            path="/claims/createclaim"
                            component={CreateClaim}
                        />
                        <AdminRoute
                            exact
                            path="/claims/factoryworkflow"
                            component={FactoryWorkflow}
                        />
                        <AdminRoute
                            exact
                            path="/claims/claimhistory"
                            component={History}
                        />
                        <AdminRoute
                            exact
                            path="/claims/closeperiod"
                            component={ClosePeriod}
                        />
                        <AdminRoute
                            exact
                            path="/claims/conversionrevenue"
                            component={ConversionRevenue}
                        />
                        <AdminRoute
                            exact
                            path="/programs"
                            component={Program}
                        />
                        <BuilderTMRoute
                            exact
                            path="/portal/programs"
                            component={Programs}
                        />
                        <BuilderTMRoute
                            exact
                            path="/portal/programs/:id"
                            component={PortalProgram}
                        />
                        <AdminRoute
                            exact
                            path="/profiles/admin"
                            component={Administrators}
                        />

                        <BuilderTMRoute
                            exact
                            path="/profiles/builders"
                            component={Builders}
                        />
                        <AdminRoute
                            exact
                            path="/profiles/suppliers"
                            component={Suppliers}
                        />
                        <TMRoute
                            exact
                            path="/builderPrograms"
                            component={BuilderProgram}
                        />
                        <AdminTmRoute
                            exact
                            path="/profiles/territoryManagers"
                            component={TerritoryManager}
                        />
                        <BuilderTMRoute
                            exact
                            path="/reporting/addresses"
                            component={Addressses}
                        />
                        <BuilderTMRoute
                            exact
                            path="/reporting/bundles"
                            component={Bundles}
                        />
                        <BuilderTMRoute
                            exact
                            path="/reporting/assignment"
                            component={Assignment}
                        />
                        <BuilderTMRoute
                            exact
                            path="/reporting/proofpointassignment"
                            component={ProofPointAssignment}
                        />
                        <BuilderTMRoute
                            exact
                            path="/reporting/prepare"
                            component={Prepare}
                        />
                        <BuilderTMRoute
                            exact
                            path="/profiles/subcontractors"
                            component={SubContractor}
                        />
                        <AdminRoute
                            exact
                            path="/reporting/batchcorrections"
                            component={BatchCorrection}
                        />
                        <BuilderTMRoute
                            exact
                            path="/resources"
                            component={Training}
                        />
                        <BuilderTMRoute
                            exact
                            path="/resources/:id"
                            component={SingleEvent}
                        />
                    </Switch>
                    <ImpersonationContainer />
                </AuthProvider>
            </Router>
        </div>
    );
};

const ClearCacheComponent = WithClearCache(MainApp);

function App() {
    return <ClearCacheComponent />;
}

export default App;
