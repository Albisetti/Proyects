import React, { useContext } from "react";
import { Helmet } from "react-helmet";
import {AuthContext} from "../../contexts/auth"
import BuilderDashboard from "./Components/BuilderDashboard";
import AdminDashboard from "./Components/AdminDashboard";
import TMDashboard from "./Components/TMDashboard";
import {APP_TITLE} from "../../util/constants";

const Dashboard = () => {

  const {type} = useContext(AuthContext)

  return (
    <div
      className=" bg-cover"
      
    >
      <div className=" pb-32">
        {/* <SubNav /> */}
      </div>

      <main className="-mt-32 pb-5 overflow-hidden">
        <div className="max-w-8xl flex flex-col space-y-5 w-8xl mx-auto px-4 sm:px-6 lg:px-32" >
            <Helmet>
                <meta charSet="utf-8" />
                <title>{APP_TITLE} - Dashboard</title>
            </Helmet>
          <div className="flex flex-col rounded-lg rounded-t-none space-y-5" >
    
          
          {type === "BUILDERS"?  <BuilderDashboard />  : type === "ADMIN"? <AdminDashboard/> : type === "TERRITORY_MANAGER"? <TMDashboard/> : null
}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
