import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Agent from "./models/Agent";
import Member from "./models/Member";
import AgentLogin from "./views/AgentLogin";
import Completed from "./views/Completed";
import Flow from "./views/Flow";

function App() {
  const member = new Member();
  const agent = new Agent();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AgentLogin agent={agent} />} />
        <Route path="/:agentId">
          <Route
            index
            element={<Flow agent={agent} memberInstance={member} />}
          />
          <Route
            path=":appId"
            element={<Flow agent={agent} memberInstance={member} />}
          />
        </Route>
        <Route
          path="/completed/:agentId"
          element={<Completed agent={agent} memberInstance={member} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
