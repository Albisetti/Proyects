import React, { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import Agent from "../../models/Agent";
import Dependent from "../../models/Dependent";
import Member from "../../models/Member";
import Payment from "../../models/Payment";
import Plan from "../../models/Plan";

type AgreementsProps = {
  agent: Agent;
  member: Member;
  payment: Payment;
  selectedPlans: Plan[];
  associatedPlan: Plan;
  zipCodeState: string;
  dependents: Dependent[];
  availableStatesForAgent: string[];
  setStep: React.Dispatch<React.SetStateAction<number>>;
};

const Agreements: FC<AgreementsProps> = ({
  agent,
  member,
  selectedPlans,
  associatedPlan,
  dependents,
  zipCodeState,
  availableStatesForAgent,
  payment,
  setStep,
}: AgreementsProps) => {
  const [agreement, setAgreement] = useState(false);
  const [didNotAgreeToTheTerms, setDidNotAgreeToTheTerms] = useState(false);

  const [creatingMember, setCreatingMember] = useState(false);
  const [invalidAnimation, setInvalidAnimation] = useState(false);
  const [memberAccordionOpen, setMemberAccordionOpen] = useState<Boolean>();
  const [dependentsAccordionsOpen, setDependentsAccordionsOpen] = useState<
    Dependent[]
  >([]);
  const [dependentsArray, setDependentsArray] =
    useState<Dependent[]>(dependents);
  const [totalValue, setTotalValue] = useState(0);

  useEffect(() => {
    setDependentsArray(dependents);
    let value = 0;
    [...selectedPlans, associatedPlan].forEach((plan) => {
      if (plan?.rate) {
        value = value + plan?.rate;
      }
    });
    setTotalValue(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPlans]);

  const navigate = useNavigate();
  return (
    <div className="xl:pt-17 gap flex min-h-[70vh] w-full flex-col gap-1 px-2 py-2">
      <div className="mb-4 flex w-full items-center justify-center self-start rounded-[32px] border-4 border-celadonBlue bg-backgroundSolidGrey p-4 text-center">
        <h1 className="flex flex-row items-center justify-center gap-4 text-[32px] font-bold text-navyBlue">
          Agreements
        </h1>
      </div>
      <div className="flex w-full flex-col gap-4 rounded-[32px] border-4 border-celadonBlue bg-backgroundSolidGrey p-2 xl:p-8">
        <div className="min-h-[250px] max-w-[1117px] text-base font-normal text-black sm:max-h-[340px] sm:overflow-y-auto xl:h-full">
          <div className="mb-2 text-2xl font-bold">
            AUTHORIZATION OF COVERAGE AND PAYMENT
          </div>
          <div className="mb-2">
            I hereby apply for the coverage(s) denoted above and do hereby
            declare that all above answers are true and complete. With respect
            to payment for the selected coverage(s), I authorize NCD Agency,
            LLC. to automatically charge the recurring monthly premiums for the
            Plan selected by me, along with the association membership fees,
            against my credit card or bank account as designated above. This
            payment option will remain in effect for the duration of my coverage
            and the authorization will remain in effect until revoked by me in
            writing by notifying NCD Agency, LLC. As part of my acceptance of
            coverage based upon the information provided, I acknowledge the
            terms of coverage set forth in the NCD Membership Agreement set
            forth in the attached document.
          </div>{" "}
          <div className="mb-2">
            {" "}
            By my completion of the application for coverage and the actual
            payment by me of the required charges for the Dental and/or Vision
            Insurance through my credit card or bank account (as designated), I
            agree to the terms of the enrollment, the Authorization, and the NCD
            Agreement. The Dental Insurance coverage will be effective based on
            my acceptance of the terms of Authorization as acknowledged by my
            payment of the required charges as required and acceptance by the
            insurance carrier.
          </div>
          <div className="mb-2 text-2xl font-bold">
            NCD MEMBER AGREEMENT
          </div>{" "}
          <div className="mb-2">
            The applicant for coverage agrees and acknowledges that the terms of
            coverage set forth below apply to the benefits applied for by the
            applicant to which the applicant also acknowledges has been read to
            him/her and has accepted such terms of coverage.
          </div>{" "}
          <div className="mb-2">
            A. Authorization of Payment – The first initial charge will be
            withdrawn immediately by NCD Agency, LLC. as well as all subsequent
            withdrawals and the withdrawals will occur on the same day each
            month (unless requested otherwise). If authorization is to be
            revoked, the applicant recognizes that it can take up to 10 days to
            process the request. Accordingly, the applicant acknowledges that
            any notice to withdraw payment authorization given at the end of a
            billing cycle may not prevent the next month’s charge being made
            against your account. If the debit to my account is dishonored with
            or without cause, the applicant does not hold NCD Agency, LLC.
            liable even if it results in the loss of insurance coverage. If you
            wish to change the form of payment, please contact NCD Agency, LLC.
            at 1-800-979-8266.
          </div>{" "}
          <div className="mb-2">
            B. Effective Date of Coverage – The applicant’s insurance coverage
            will not go into effect until the application is approved by the
            insurance company and the initial payment is received by NCD Agency,
            LLC. If payment is not received, the application will be voided, and
            no coverage issued. Submission and acceptance of the credit card or
            bank account information does not by itself constitute acceptance of
            coverage.
          </div>
          <div className="mb-2">
            {" "}
            C. Underwriter Information. Dental insurance coverage is
            underwritten by Metropolitan Life Insurance Company, New York, NY
            10166 (MetLife), vision insurance coverage is underwritten by Vision
            Service Plan Insurance Company, Rancho Cordova, CA 95670 (VSP), and
            offered through NCD Agency, LLC. There is no ownership affiliation
            between MetLife, VSP and NCD Agency, LLC.
          </div>
          <div className="mb-2">
            D. Enrollment Application - The Dental Insurance Plan of Benefits
            and Vision Insurance Plan of Benefits are one of the many benefits
            being offered by the National Wellness and Fitness Association. In
            order to apply for the insurance coverage, you must be a member. By
            completing this application for coverage and the authorization for
            payment of the charges, the applicant acknowledges his/her
            membership in the Association and monthly membership fee.
          </div>
          <div className="mb-2">
            E. Data Privacy – We believe in protecting your information. The
            online application system provided on this website is protected by a
            strong SSL and encryption of sensitive information.
          </div>{" "}
          <div className="mb-2">
            F. Automatic Renewal - Once enrolled, the plan will continue to
            automatically renew, unless you, the applicant, send a cancellation
            notice or the plan is otherwise terminated.
          </div>
          <div className="mb-2">
            G. Right to Return Period – If you are not completely satisfied with
            this coverage and have not filed a claim, you may cancel the policy
            within thirty (30) days of the coverage effective date and receive a
            refund of insurance premiums.
          </div>
          <div className="mb-2">
            H. Certificate – Once insured, you will be receiving a Certificate
            of Insurance. The Certificate is a description of coverage. The
            master group insurance policy will govern on all matters of
            benefits, limitations, exclusions, and terms for keeping coverage in
            force. You will be provided with instructions which will allow you,
            once you are accepted for coverage, to download your certificate
            electronically.{" "}
          </div>
          <div className="mb-2">
            I. ID Cards – You will be provided with an ID Card once your
            coverage becomes effective and becomes in-force. Your card will be
            sent to you via USPS mail and/or by email.{" "}
          </div>
          <div className="mb-4">
            J. Cancellation of Coverage – A five (5) day notice requirement in
            advance of the scheduled billing date is required in order to
            terminate your insurance coverage. Membership fees paid are retained
            to the association and a separate notice requirement has to be made
            directly to the association.
          </div>
          <div className="mb-2">
            Dental insurance policies featuring the Preferred Dentist Program
            are underwritten by Metropolitan Life Insurance Company, New York,
            NY 10166. Like most insurance policies, insurance policies offered
            by MetLife and its affiliates contain certain exclusions,
            exceptions, reductions, limitations, waiting periods and terms for
            keeping them in force. Please contact for costs and complete
            details. Coverage may not be available in all state
          </div>
        </div>
        <div className="sticky bottom-[5.5rem] z-[50] w-full bg-backgroundSolidGrey pb-2">
          <div className="my-4 h-[2px] w-full bg-navyBlue" />
          <div className="flex flex-col items-center justify-between xl:flex-row">
            <div className="flex max-w-3xl flex-col items-center justify-center gap-4 self-start sm:flex-row">
              <div className="order-last flex flex-col items-center justify-center sm:order-first">
                <div className="h-[52px] w-[176px]">
                  <Button
                    text={"PURCHASE"}
                    action={() => {
                      if (!agreement) {
                        setDidNotAgreeToTheTerms(true);
                        return;
                      }
                      setCreatingMember(true);
                      member.dependents = dependents;
                      member.payment = payment;
                      member
                        .createMember(
                          selectedPlans,
                          associatedPlan,
                          agent.id!,
                          zipCodeState,
                          availableStatesForAgent
                        )
                        .then((result) => {
                          setCreatingMember(false);
                          if (result === true)
                            navigate(`/completed/${agent.id}`);
                          if (result === false) {
                            setInvalidAnimation(true);
                            setTimeout(() => setInvalidAnimation(false), 10000);
                          }
                        });
                    }}
                    mainPath
                    disabled={creatingMember}
                    loadingIcon={creatingMember}
                  />
                </div>
                <div className="flex flex-col items-center justify-center">
                  <div className="flex flex-col items-center justify-center font-bold">
                    {didNotAgreeToTheTerms && (
                      <p
                        className="text-base font-normal"
                        style={{ color: "red" }}
                      >
                        You must agree to the terms and conditions
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div
                className="flex cursor-pointer flex-row gap-2"
                onClick={() => {
                  setAgreement(!agreement);
                  setDidNotAgreeToTheTerms(false);
                }}
              >
                <input
                  type="radio"
                  className="min-h-[29px] min-w-[29px] border-[3px] border-solid border-lightBlue text-lightBlue accent-lightBlue checked:bg-lightBlue"
                  checked={agreement}
                  onClick={() => {
                    setAgreement(!agreement);
                  }}
                />
                <div className="text-sm text-navyBlue">
                  By providing your email address, you agree and opt-in to
                  receive membership materials (including policy or certificate
                  of issuance documents, if applicable), and other
                  correspondence electronically. If you prefer to have your
                  membership materials and documents mailed, please call Member
                  Services at (800) 656-2204 Option #2. By checking the box, I
                  acknowledge that I understand and agree to the authorization.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
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
                <span>
                  There was an error while completing the purchase, please check
                  your data and try again later
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Agreements;
