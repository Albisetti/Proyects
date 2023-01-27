import React, { FC } from "react";
import Button from "../../components/Button";
import Agent from "../../models/Agent";
import { useNavigate, useParams } from "react-router-dom";
import { Header } from "../../components/Header";
import ProgressBar from "../../components/ProgressBar";
import Member from "../../models/Member";

type AgreementsProps = {
  agent: Agent;
  memberInstance: Member;
};

const Completed: FC<AgreementsProps> = ({
  agent,
  memberInstance,
}: AgreementsProps) => {
  const navigate = useNavigate();
  const { agentId } = useParams();
  return (
    <div className="relative">
      <Header agentState={agent} />
      <div className="border-b-2 border-b-orange"></div>
      <div className="h-screen w-full bg-gradient-to-r from-[#003764] to-[#53BFE7] bg-cover bg-center bg-no-repeat pt-16 lg:h-[99.8vh] lg:pt-20">
        <div className="flex flex-row justify-center gap-4 p-2 font-montserrat lg:container lg:h-[82vh]">
          <div className="flex basis-full flex-col gap-3 lg:basis-2/4">
            <div className="flex h-[250px] w-full flex-col items-center justify-center self-center rounded-[32px] border-4 border-celadonBlue bg-backgroundSolidGrey p-4 text-center">
              <img src="/ncd_logo.svg" className="h-32" alt="NCD Logo" />
              <div className="text-xl font-medium text-black">
                Welcome to NCD!
              </div>
              <div className="text-sm text-textGrey">
                Your Application has been received
              </div>
              <div className="mt-2 h-[40px] w-[230px] font-bold">
                <Button
                  text="Start a new application"
                  action={() => {
                    navigate(`/${agentId}`);
                  }}
                />
              </div>
            </div>
            <div className="rounded-[32px] border-4 border-celadonBlue bg-backgroundSolidGrey p-4">
              <div className="my-2">
                <p className="font-semibold">
                  Member ID:{" "}
                  <span className="font-normal">{memberInstance.id}</span>
                </p>
                <p className="font-semibold">
                  Primary Member:{" "}
                  <span className="font-normal">
                    {memberInstance.firstName} {memberInstance.lastName}
                  </span>
                </p>
              </div>
              <p className="font-semibold">New Members:</p>
              <p className="my-2">
                Please be on the lookout for your Enrollment Confirmation
                Letter.
              </p>
              <div className="my-2">
                <p>
                  If you submitted an email address, you'll be getting an email
                  from{" "}
                </p>
                <a className="text-lightBlue" href="mailto:membercare@NCD.com">
                  Metlife.Welcome@NCD.com
                </a>
              </div>
              <p className="my-2">
                If you did not submit an email, you'll be receiving your New
                Member Enrollment Kit in the mail very soon.
              </p>
              <p className="my-2">
                For immediate needs or specific questions, you can contact NCD
                Member Care department in the following ways:
              </p>
              <div className="my-2">
                <p>
                  Phone:{" "}
                  <a href="tel:1-800-485-3855" className="text-lightBlue">
                    1-800-485-3855
                  </a>
                </p>
                <p>
                  Email:{" "}
                  <a
                    className="text-lightBlue"
                    href="mailto:Metlife.MemberCare@ncd.com"
                  >
                    Metlife.MemberCare@ncd.com
                  </a>
                </p>
              </div>
              <p className="my-2 font-semibold">Agents:</p>
              <p className="my-2">
                If you need assistance with this application or have immediate
                questions, please contact{" "}
                <a
                  className="text-lightBlue"
                  href="mailto:AppTechSupport@NCD.com"
                >
                  AppTechSupport@NCD.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`fixed bottom-0 z-50 ml-auto mr-auto w-full bg-orange pt-1`}
      >
        <ProgressBar
          step={1}
          agent={agent}
          // stepsWithDescription={stepsNames}
        />
      </div>
    </div>
  );
};

export default Completed;
