import React, { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import { Header } from "../../components/Header";
import ProgressBar from "../../components/ProgressBar";
import Agent from "../../models/Agent";

type AgentLoginProps = {
  agent: Agent;
};

const AgentLogin: FC<AgentLoginProps> = ({ agent }: AgentLoginProps) => {
  const [agentID, setAgentID] = useState<number>();
  const [invalidAgentID, setInvalidAgentID] = useState(false);
  const [invalidAnimation, setInvalidAnimation] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (invalidAgentID === true) {
      setInvalidAgentID(false);
      setInvalidAnimation(true);
      setTimeout(() => setInvalidAnimation(false), 10000);
    }
  }, [invalidAgentID]);
  return (
    <div id="root relative h-screen" className="relative">
      <div className="absolute z-0 flex h-screen w-full flex-col items-center bg-gradient-to-r from-[#003764] to-[#53BFE7] bg-cover bg-center bg-no-repeat">
        <Header />

        <form
          onSubmit={(e) => {
            e.preventDefault();
            agent.id = agentID;
            agent.loginAgent().then((data) => {
              if (data?.status !== 200) setInvalidAgentID(true);
              else {
                setInvalidAgentID(false);
                navigate(`/${agentID}`);
              }
            });
          }}
          className="relative z-50 flex h-[43%] flex-col items-center justify-center self-center justify-self-center font-inter sm:h-[70%]"
        >
          <div>
            <div className="rounded-[32px] border-4 border-celadonBlue bg-backgroundSolidGrey p-2 xs:p-8 sm:w-[499px] sm:px-[117px] sm:py-[60px]">
              <div className="text-center text-xl font-bold text-black">
                Please enter your Agent ID
              </div>
              <div className="mt-3 flex flex-col items-center justify-center text-navyBlue">
                <div className="flex flex-col items-center justify-center gap-4 xs:flex-row">
                  <input
                    className="h-[29px] w-[156px] appearance-none rounded-[59px] border border-solid border-celadonBlue text-center text-[20px] focus:outline-none"
                    placeholder="Enter agent ID"
                    type="number"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    onKeyDown={(event) => {
                      if (
                        event.code === "Slash" ||
                        event.code === "Comma" ||
                        event.code === "Period" ||
                        event.code === "NumpadAdd" ||
                        event.code === "NumpadSubtract"
                      ) {
                        event.preventDefault();
                      }
                    }}
                    onChange={(event) => {
                      setAgentID(parseInt(event.target.value));
                      setInvalidAgentID(false);
                    }}
                  />
                  <div className="h-[29px] w-[145px] text-[20px] text-xl font-medium md:h-[29px] md:w-[88px]">
                    <Button text={"Submit"} submit mainPath />
                  </div>
                </div>
                <a
                  href="mailto:AppTechSupport@NCD.com"
                  className="mt-3 cursor-pointer self-start text-start text-base font-medium leading-5 text-celadonBlue"
                >
                  Can't remember your Agent ID?
                </a>
                <div
                  className={`ant-message ${
                    invalidAnimation ? "visible animate-antMoveIn" : "invisible"
                  }`}
                >
                  <div>
                    <div className="ant-message-notice">
                      <div className="ant-message-notice-content">
                        <div className="ant-message-custom-content ant-message-error flex flex-row">
                          <span
                            role="img"
                            aria-label="close-circle"
                            className="anticon anticon-close-circle"
                          >
                            <svg
                              viewBox="64 64 896 896"
                              focusable="false"
                              data-icon="close-circle"
                              width="1em"
                              height="1em"
                              fill="currentColor"
                              aria-hidden="true"
                            >
                              <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm165.4 618.2l-66-.3L512 563.4l-99.3 118.4-66.1.3c-4.4 0-8-3.5-8-8 0-1.9.7-3.7 1.9-5.2l130.1-155L340.5 359a8.32 8.32 0 01-1.9-5.2c0-4.4 3.6-8 8-8l66.1.3L512 464.6l99.3-118.4 66-.3c4.4 0 8 3.5 8 8 0 1.9-.7 3.7-1.9 5.2L553.5 514l130 155c1.2 1.5 1.9 3.3 1.9 5.2 0 4.4-3.6 8-8 8z"></path>
                            </svg>
                          </span>
                          <span>Please enter a valid agent id</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
        <div className="fixed bottom-0 mt-2 ml-auto mr-auto w-full bg-orange pt-1">
          <ProgressBar step={1} />
        </div>
      </div>
    </div>
  );
};

export default AgentLogin;
