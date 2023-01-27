import React, { FC, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProgressBar from "../../components/ProgressBar";
import ConfirmCart from "../ConfirmCart";
import Coverage from "../Coverage";
import CoverageInformation from "../CoverageInformation";
import DependentInformation from "../DependentInformation";
import PrimaryInformation from "../PrimaryInformation";
import SelectPlan from "../SelectPlan";
import HowManyPeople from "../HowManyPeople";
import Member from "../../models/Member";
import Confirmation from "../Confirmation";
import PaymentInformation from "../Payment";
import Agreements from "../Agreements";
import Agent from "../../models/Agent";
import Plan from "../../models/Plan";
import Dependent from "../../models/Dependent";
import HomePage from "../Homepage";
import {
  bundleAssociationPlansIDs,
  dentalAssociationPlansIDs,
  dentalPlansIDs,
  NCDCompleteByMetLife,
  NCDEssentialsByMetLife,
  NCDValueByMetLife,
  NCDValueByMetLifeNYCT,
  NCDEssentialsByMetLifeNYCT,
  NCDCompleteByMetLifeNYCT,
  notValidDentalAndNotValidVisionSteps,
  notValidDentalAndValidVisionSteps,
  sessionIDLambdaURL,
  validDentalAndNoValidVisionSteps,
  validDentalAndValidVisionSteps,
  visionAssociationPlansIDs,
  visionPlanIDs,
  visionPlanIDsForNonValidStates,
  dentalPlansIDsNYCT,
} from "../../utils";
import Payment from "../../models/Payment";
import axios from "axios";
import { v4 as uuid } from "uuid";
import { Header } from "../../components/Header";
import { metlifeDentalData } from "../../metlifeJsonData";
import { metlifeDataNYCT } from "../../metlifeJsonDataNYCT";
import { associationData } from "../../associationPlans";
import { visionData } from "../../vspVision";

type FlowProps = {
  agent: Agent;
  memberInstance: Member;
};

const Flow: FC<FlowProps> = ({ agent, memberInstance }: FlowProps) => {
  const [stepsNames, setStepsNames] = useState([
    "Start",
    "Dental Coverage",
    "Vision Coverage",
    "Amount of Dependents",
    "Dental",
    "Confirm Cart",
    "Coverage",
    "Primary",
    "Dependents",
    "Payment",
    "Confirmation",
    "Agreements",
    "Completed",
  ]);
  const [step, setStep] = useState(1);
  const [wantsDental, setWantsDental] = useState(false);
  const [wantsVision, setWantsVision] = useState(false);
  const [zipCodeState, setZipCodeState] = useState("");
  const [validDentalInState, setValidDentalInState] = useState(true);
  const [validVisionInState, setValidVisionInState] = useState(true);
  const [backgroundURL, setBackgroundURL] = useState("");
  const [dependents, setDependents] = useState<Dependent[]>([]);
  const [amountOfDependentsType, setAmountOfDependentsType] = useState("");
  const [amountOfDependents, setAmountOfDependents] = useState(0);
  const [dentalPlans, setDentalPlans] = useState<Plan[]>();
  const [visionPlans, setVisionPlans] = useState<Plan[]>();
  const [dentalAssociationPlans, setDentalAssociationPlans] =
    useState<Plan[]>();
  const [visionAssociationPlans, setVisionAssociationPlans] =
    useState<Plan[]>();
  const [dentalVisionAssociationPlans, setDentalVisionAssociationPlans] =
    useState<Plan[]>();
  const [associatedPlan, setAssociatedPlan] = useState<Plan>(new Plan());

  const [selectedPlanDental, setSelectedPlanDental] = useState<Plan>(
    new Plan()
  );
  const [selectedPlanVision, setSelectedPlanVision] = useState<Plan>(
    new Plan()
  );
  const [selectedPlans, setSelectedPlans] = useState<Plan[]>([]);
  const [agentState, setAgentState] = useState<Agent>();
  const [availableStatesForAgent, setAvailableStatesForAgent] = useState<
    string[]
  >([]);

  const [member, setMember] = useState<Member>(memberInstance);
  const [payment, setPayment] = useState<Payment>(new Payment());

  const [generatedAppId, setGeneratedAppID] = useState<string>();
  const [loadingAppIdData, setLoadingAppIdData] = useState<boolean>(true);
  const [loadingPlans, setLoadingPlans] = useState<boolean>(false);

  const { agentId, appId } = useParams();
  const navigate = useNavigate();

  const clearState = () => {
    setWantsDental(false);
    setWantsVision(false);
    setZipCodeState("");
    setValidDentalInState(true);
    setValidVisionInState(true);
    setDependents([]);
    setAmountOfDependentsType("");
    setAmountOfDependents(0);
    setDentalPlans(undefined);
    setVisionPlans(undefined);
    setDentalAssociationPlans(undefined);
    setVisionAssociationPlans(undefined);
    setDentalVisionAssociationPlans(undefined);
    setAssociatedPlan(new Plan());
    setSelectedPlanDental(new Plan());
    setSelectedPlanVision(new Plan());
    setSelectedPlans([]);
    setPayment(new Payment());
  };

  useEffect(() => {
    if (!appId) {
      setGeneratedAppID(uuid());
      setLoadingAppIdData(false);
    } else {
      setLoadingAppIdData(true);
      axios
        .get(sessionIDLambdaURL, {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          params: {
            TableName: "metlife-applications",
            Key: appId,
          },
        })
        .then((response) => {
          let memberViaAppId = Object.assign(
            new Member(),
            JSON.parse(response?.data?.Item?.member)
          );
          let dentalPlansViaAppId = Object.assign(
            new Array<Plan>(),
            JSON.parse(response?.data?.Item?.availableDentalPlans)
          );
          let visionPlansViaAppId = Object.assign(
            new Array<Plan>(),
            JSON.parse(response?.data?.Item?.availableVisionPlans)
          );
          let dentalVisionAssociationPlansViaAppId = Object.assign(
            new Array<Plan>(),
            JSON.parse(
              response?.data?.Item?.availableDentalVisionAssociationPlans
            )
          );
          let dentalAssociationPlansViaAppId = Object.assign(
            new Array<Plan>(),
            JSON.parse(response?.data?.Item?.availableDentalAssociationPlans)
          );
          let visionAssociationPlansViaAppId = Object.assign(
            new Array<Plan>(),
            JSON.parse(response?.data?.Item?.availableVisionAssociationPlans)
          );
          setZipCodeState(response?.data?.Item?.state);
          setDentalPlans(dentalPlansViaAppId);
          setVisionPlans(visionPlansViaAppId);
          setDentalAssociationPlans(dentalAssociationPlansViaAppId);
          setVisionAssociationPlans(visionAssociationPlansViaAppId);
          setDentalVisionAssociationPlans(dentalVisionAssociationPlansViaAppId);
          setWantsDental(response?.data?.Item?.wantsDental);
          setWantsVision(response?.data?.Item?.wantsVision);
          setValidDentalInState(response?.data?.Item?.validDental);
          setValidVisionInState(response?.data?.Item?.validVision);
          setMember(memberViaAppId);
          setSelectedPlanDental(
            Object.assign(
              new Plan(),
              JSON.parse(response?.data?.Item?.planDental)
            )
          );
          setSelectedPlanVision(
            Object.assign(
              new Plan(),
              JSON.parse(response?.data?.Item?.planVision)
            )
          );
          setAssociatedPlan(
            Object.assign(
              new Plan(),
              JSON.parse(response?.data?.Item?.associationPlan)
            )
          );
          setDependents(
            Object.assign(
              new Array<Dependent>(),
              JSON.parse(response?.data?.Item?.dependents)
            )
          );
          setAmountOfDependentsType(
            response?.data?.Item?.amountOfDependentsType
          );

          setAmountOfDependents(response?.data?.Item?.amountOfDependents);
          setStep(response?.data?.Item?.step);
          setStepsNames(JSON.parse(response?.data?.Item?.stepsNames));
        });
    }
    agent.loginAgent(parseInt(agentId!)).then(() => {
      setAgentState(agent);
      agent.getAgentLicense(parseInt(agentId!)).then((response) => {
        let availableStatesForAgent = new Array<string>();
        JSON.parse(response)?.forEach((element: { STATE: string }) => {
          availableStatesForAgent.push(element?.STATE);
        });
        setAvailableStatesForAgent(availableStatesForAgent);
      });
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (step <= 4) {
      setTimeout(() => {
        setLoadingAppIdData(false);
      }, 5000);
    } else if (
      appId &&
      zipCodeState &&
      dentalPlans &&
      visionPlans &&
      dentalAssociationPlans &&
      visionAssociationPlans &&
      dentalVisionAssociationPlans &&
      member &&
      selectedPlanDental &&
      selectedPlanVision &&
      associatedPlan &&
      dependents &&
      amountOfDependentsType &&
      stepsNames
    ) {
      setLoadingAppIdData(false);
    }
  }, [
    appId,
    zipCodeState,
    dentalPlans,
    visionPlans,
    visionAssociationPlans,
    dentalAssociationPlans,
    dentalVisionAssociationPlans,
    member,
    selectedPlanDental,
    selectedPlanVision,
    associatedPlan,
    dependents,
    amountOfDependentsType,
    stepsNames,
    step,
  ]);

  useEffect(() => {
    setDependents([]);
  }, [amountOfDependentsType]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    memberInstance = member;
  }, [member]);

  useEffect(() => {
    if (!validDentalInState)
      setStepsNames((current) =>
        current.filter(
          (value) =>
            value !== "Dental Coverage" &&
            value !== "Amount Dental" &&
            value !== "Dental" &&
            value !== "Dependents Dental"
        )
      );
    if (!validVisionInState)
      setStepsNames((current) =>
        current.filter(
          (value) =>
            value !== "Amount Vision" &&
            value !== "Vision" &&
            value !== "Dependents Vision"
        )
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [validDentalInState, validVisionInState]);

  async function getPlanHandlerDental(
    plansIDs: number[],
    plansList: Plan[],
    setter: React.Dispatch<React.SetStateAction<Plan[] | undefined>>,
    dependentsType: string,
    zipCode: string | undefined,
    state?: string
  ) {
    const reg = /^0{1}/;
    plansIDs.forEach(async (id) => {
      const newPlan = new Plan();
      // await plan
      //   .getPlanDetails(id, dependentsType, agent?.id, zipCode, state)
      //   .then(() => {
      //     plansList.push(plan);
      //     plansList.sort((plan, secondPlan) => {
      //       if (plan.rate && secondPlan.rate)
      //         return plan.rate - secondPlan.rate;
      //       return 0;
      //     });
      //   });
      metlifeDentalData?.forEach((plan) => {
        if (
          id === NCDValueByMetLife &&
          plan?.ProductID === id &&
          dependentsType === plan?.AmountOfPeople
        ) {
          newPlan.id = plan?.ProductID;
          newPlan.benefitID = plan?.BenefitID;
          newPlan.benefitLabel = plan?.AmountOfPeople;
          newPlan.rate = plan?.Price;
          newPlan.label = plan?.Label;
          plansList.push(newPlan);
          plansList.sort((plan, secondPlan) => {
            if (plan.rate && secondPlan.rate)
              return plan.rate - secondPlan.rate;
            return 0;
          });
        } else if (
          plan?.ProductID === id &&
          zipCode?.slice(0, 3).replace(reg, "").replace(reg, "") ===
            plan?.Zipcode.toString() &&
          dependentsType === plan?.AmountOfPeople
        ) {
          newPlan.id = plan?.ProductID;
          newPlan.benefitID = plan?.BenefitID;
          newPlan.benefitLabel = plan?.AmountOfPeople;
          newPlan.rate = plan?.Price;
          newPlan.label = plan?.Label;
          plansList.push(newPlan);
          plansList.sort((plan, secondPlan) => {
            if (plan.rate && secondPlan.rate)
              return plan.rate - secondPlan.rate;
            return 0;
          });
        }
      });
    });
    setter(plansList);
  }

  async function getPlanHandlerDentalNYCT(
    plansIDs: number[],
    plansList: Plan[],
    setter: React.Dispatch<React.SetStateAction<Plan[] | undefined>>,
    dependentsType: string,
    zipCode: string | undefined,
    state?: string
  ) {
    const reg = /^0{1}/;
    plansIDs.forEach(async (id) => {
      const newPlan = new Plan();
      // await plan
      //   .getPlanDetails(id, dependentsType, agent?.id, zipCode, state)
      //   .then(() => {
      //     plansList.push(plan);
      //     plansList.sort((plan, secondPlan) => {
      //       if (plan.rate && secondPlan.rate)
      //         return plan.rate - secondPlan.rate;
      //       return 0;
      //     });
      //   });
      metlifeDataNYCT?.forEach((plan) => {
        if (
          id === NCDValueByMetLifeNYCT &&
          plan?.ProductID === id &&
          dependentsType === plan?.AmountOfPeople
        ) {
          newPlan.id = plan?.ProductID;
          newPlan.benefitID = plan?.BenefitID;
          newPlan.benefitLabel = plan?.AmountOfPeople;
          newPlan.rate = plan?.Price;
          newPlan.label = plan?.Label;
          plansList.push(newPlan);
          plansList.sort((plan, secondPlan) => {
            if (plan.rate && secondPlan.rate)
              return plan.rate - secondPlan.rate;
            return 0;
          });
        } else if (
          plan?.ProductID === id &&
          zipCode?.slice(0, 3).replace(reg, "").replace(reg, "") ===
            plan?.Zipcode.toString() &&
          dependentsType === plan?.AmountOfPeople
        ) {
          newPlan.id = plan?.ProductID;
          newPlan.benefitID = plan?.BenefitID;
          newPlan.benefitLabel = plan?.AmountOfPeople;
          newPlan.rate = plan?.Price;
          newPlan.label = plan?.Label;
          plansList.push(newPlan);
          plansList.sort((plan, secondPlan) => {
            if (plan.rate && secondPlan.rate)
              return plan.rate - secondPlan.rate;
            return 0;
          });
        }
      });
    });
    setter(plansList);
  }

  async function getPlanHandlerVision(
    plansIDs: number[],
    plansList: Plan[],
    setter: React.Dispatch<React.SetStateAction<Plan[] | undefined>>,
    dependentsType: string,
    zipCode: string | undefined,
    state?: string
  ) {
    let visionDependents = [
      "Member plus Spouse",
      "Member plus Children",
    ].includes(dependentsType)
      ? "Member + 1"
      : dependentsType;
    plansIDs.forEach(async (id) => {
      const newPlan = new Plan();
      // await plan
      //   .getPlanDetails(id, dependentsType, agent?.id, zipCode, state)
      //   .then(() => {
      //     plansList.push(plan);
      //     plansList.sort((plan, secondPlan) => {
      //       if (plan.rate && secondPlan.rate)
      //         return plan.rate - secondPlan.rate;
      //       return 0;
      //     });
      //   });
      visionData?.forEach((plan) => {
        if (state !== "NY" && state !== "OR") {
          if (
            plan?.ProductID === id &&
            visionDependents === plan?.AmountOfPeople
          ) {
            newPlan.id = plan?.ProductID;
            newPlan.benefitID = plan?.BenefitID;
            newPlan.benefitLabel = plan?.AmountOfPeople;
            newPlan.rate = plan?.Price;
            newPlan.label = plan?.Label;
            plansList.push(newPlan);
            plansList.sort((plan, secondPlan) => {
              if (plan.rate && secondPlan.rate)
                return plan.rate - secondPlan.rate;
              return 0;
            });
          }
        } else {
          if (
            plan?.ProductID === id &&
            visionDependents === plan?.AmountOfPeople &&
            state === plan?.State
          ) {
            newPlan.id = plan?.ProductID;
            newPlan.benefitID = plan?.BenefitID;
            newPlan.benefitLabel = plan?.AmountOfPeople;
            newPlan.rate = plan?.Price;
            newPlan.label = plan?.Label;
            plansList.push(newPlan);
            plansList.sort((plan, secondPlan) => {
              if (plan.rate && secondPlan.rate)
                return plan.rate - secondPlan.rate;
              return 0;
            });
          }
        }
      });
    });
    setter(plansList);
  }

  async function getPlanHandlerAssociation(
    plansIDs: number[],
    plansList: Plan[],
    setter: React.Dispatch<React.SetStateAction<Plan[] | undefined>>,
    dependentsType: string,
    zipCode: string | undefined,
    state?: string
  ) {
    let visionDependents = [
      "Member plus Spouse",
      "Member plus Children",
    ].includes(dependentsType)
      ? "Member + 1"
      : dependentsType;
    plansIDs.forEach(async (id) => {
      const newPlan = new Plan();
      // await plan
      //   .getPlanDetails(id, dependentsType, agent?.id, zipCode, state)
      //   .then(() => {
      //     plansList.push(plan);
      //     plansList.sort((plan, secondPlan) => {
      //       if (plan.rate && secondPlan.rate)
      //         return plan.rate - secondPlan.rate;
      //       return 0;
      //     });
      //   });
      associationData?.forEach((plan) => {
        if (id === 38923) {
          if (
            plan?.ProductID === id &&
            visionDependents === plan?.AmountOfPeople
          ) {
            newPlan.id = plan?.ProductID;
            newPlan.benefitID = plan?.BenefitID;
            newPlan.benefitLabel = plan?.AmountOfPeople;
            newPlan.rate = plan?.Price;
            newPlan.label = plan?.Label;
            plansList.push(newPlan);
            plansList.sort((plan, secondPlan) => {
              if (plan.rate && secondPlan.rate)
                return plan.rate - secondPlan.rate;
              return 0;
            });
          }
        } else if (
          plan?.ProductID === id &&
          dependentsType === plan?.AmountOfPeople
        ) {
          newPlan.id = plan?.ProductID;
          newPlan.benefitID = plan?.BenefitID;
          newPlan.benefitLabel = plan?.AmountOfPeople;
          newPlan.rate = plan?.Price;
          newPlan.label = plan?.Label;
          plansList.push(newPlan);
          plansList.sort((plan, secondPlan) => {
            if (plan.rate && secondPlan.rate)
              return plan.rate - secondPlan.rate;
            return 0;
          });
        }
      });
    });
    setter(plansList);
  }

  async function getAvailablePlans(
    validDental: boolean,
    validVision: boolean,
    state?: string,
    memberViaAppID?: Member,
    amountOfDependentsTypeViaAppID?: string
  ) {
    const dentalPlans: Plan[] = [];
    const visionPlans: Plan[] = [];
    const dentalAssociationFee: Plan[] = [];
    const visionAssociationFee: Plan[] = [];
    const dentalAndVisionAssociationFee: Plan[] = [];
    let zipCode = memberViaAppID ? memberViaAppID?.zipCode : member?.zipCode;
    let dependentsType = amountOfDependentsTypeViaAppID
      ? amountOfDependentsTypeViaAppID
      : amountOfDependentsType;
    if (validDental) {
      if (state !== "NY" && state !== "CT") {
        getPlanHandlerDental(
          dentalPlansIDs,
          dentalPlans,
          setDentalPlans,
          dependentsType,
          zipCode
        );
      } else {
        getPlanHandlerDentalNYCT(
          dentalPlansIDsNYCT,
          dentalPlans,
          setDentalPlans,
          dependentsType,
          zipCode
        );
      }
      getPlanHandlerAssociation(
        dentalAssociationPlansIDs,
        dentalAssociationFee,
        setDentalAssociationPlans,
        dependentsType,
        zipCode
      );
    }
    if (validVision)
      getPlanHandlerVision(
        visionPlanIDs,
        visionPlans,
        setVisionPlans,
        dependentsType,
        zipCode
      );
    else {
      getPlanHandlerVision(
        visionPlanIDsForNonValidStates,
        visionPlans,
        setVisionPlans,
        dependentsType,
        zipCode,
        state
      );
    }
    getPlanHandlerAssociation(
      visionAssociationPlansIDs,
      visionAssociationFee,
      setVisionAssociationPlans,
      dependentsType,
      zipCode
    );
    getPlanHandlerAssociation(
      bundleAssociationPlansIDs,
      dentalAndVisionAssociationFee,
      setDentalVisionAssociationPlans,
      dependentsType,
      zipCode
    );
    setLoadingPlans(false);
  }

  useEffect(() => {
    if (loadingAppIdData) return;
    setLoadingPlans(true);
    getAvailablePlans(validDentalInState, validVisionInState, zipCodeState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amountOfDependentsType]);

  useEffect(() => {
    if (visionPlans && wantsVision) {
      setSelectedPlanVision(visionPlans[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visionPlans]);

  useEffect(() => {
    setSelectedPlans(
      (current) => (current = [selectedPlanDental, selectedPlanVision])
    );
    let associationProduct;
    if (!selectedPlanVision?.id && selectedPlanDental?.id) {
      switch (selectedPlanDental?.id) {
        case NCDValueByMetLife || NCDValueByMetLifeNYCT:
          if (dentalAssociationPlans)
            associationProduct = dentalAssociationPlans[0];
          break;
        case NCDValueByMetLifeNYCT:
          if (dentalAssociationPlans)
            associationProduct = dentalAssociationPlans[0];
          break;
        case NCDEssentialsByMetLife || NCDEssentialsByMetLifeNYCT:
          if (dentalAssociationPlans)
            associationProduct = dentalAssociationPlans[1];
          break;
        case NCDEssentialsByMetLifeNYCT:
          if (dentalAssociationPlans)
            associationProduct = dentalAssociationPlans[1];
          break;
        case NCDCompleteByMetLife:
          if (dentalAssociationPlans)
            associationProduct = dentalAssociationPlans[1];
          break;
        case NCDCompleteByMetLifeNYCT:
          if (dentalAssociationPlans)
            associationProduct = dentalAssociationPlans[1];
          break;
        default:
          break;
      }
    } else if (!selectedPlanDental?.id && selectedPlanVision?.id) {
      if (visionAssociationPlans) {
        associationProduct = visionAssociationPlans[0];
      }
    } else {
      switch (selectedPlanDental?.id) {
        case NCDValueByMetLife:
          if (dentalVisionAssociationPlans)
            associationProduct = dentalVisionAssociationPlans[0];
          break;
        case NCDValueByMetLifeNYCT:
          if (dentalVisionAssociationPlans)
            associationProduct = dentalVisionAssociationPlans[0];
          break;
        case NCDEssentialsByMetLife:
          if (dentalVisionAssociationPlans)
            associationProduct = dentalVisionAssociationPlans[1];
          break;
        case NCDEssentialsByMetLifeNYCT:
          if (dentalVisionAssociationPlans)
            associationProduct = dentalVisionAssociationPlans[1];
          break;
        case NCDCompleteByMetLife:
          if (dentalVisionAssociationPlans)
            associationProduct = dentalVisionAssociationPlans[1];
          break;
        case NCDCompleteByMetLifeNYCT:
          if (dentalVisionAssociationPlans)
            associationProduct = dentalVisionAssociationPlans[1];
          break;
        default:
          break;
      }
    }
    if (associationProduct) {
      setAssociatedPlan(associationProduct);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPlanDental, selectedPlanVision, associatedPlan]);

  function getAssociationPlans(): Plan[] | undefined {
    if (wantsDental && wantsVision) return dentalVisionAssociationPlans;
    if (wantsDental && !wantsVision) return dentalAssociationPlans;
    if (!wantsDental && wantsVision) return visionAssociationPlans;
    else return undefined;
  }

  const renderStep = () => {
    switch (stepsNames[step - 1]) {
      case "Start":
        return (
          <HomePage
            member={member}
            agent={agent}
            setValidDentalInState={setValidDentalInState}
            setValidVisionInState={setValidVisionInState}
            setZipCodeState={setZipCodeState}
            setStep={setStep}
          />
        );
      case "Amount of Dependents":
        return (
          <HowManyPeople
            amountOfDependents={amountOfDependents}
            setAmountOfDependents={setAmountOfDependents}
            setAmountOfDependentsType={setAmountOfDependentsType}
            setStep={setStep}
            setStepsNames={setStepsNames}
          />
        );
      case "Dental Coverage":
        return (
          <Coverage
            type="Dental"
            setStep={setStep}
            setStepsNames={setStepsNames}
            setSelectedPlan={setSelectedPlanDental}
            setWants={setWantsDental}
          />
        );
      case "Vision Coverage":
        return (
          <Coverage
            type="Vision"
            setStep={setStep}
            setStepsNames={setStepsNames}
            setSelectedPlan={setSelectedPlanVision}
            setWants={setWantsVision}
          />
        );
      case "Dental":
        return (
          <SelectPlan
            key={"dental"}
            setSelectedPlan={setSelectedPlanDental}
            setSelectedPlanVision={setSelectedPlanVision}
            wantsVision={wantsVision}
            plansProp={dentalPlans}
            visionPlans={visionPlans}
            associationPlans={getAssociationPlans()}
            type="Dental"
            setStep={setStep}
          />
        );
      case "Confirm Cart":
        return (
          <ConfirmCart
            selectedPlans={selectedPlans}
            associatedPlan={associatedPlan}
            setStep={setStep}
          />
        );
      case "Coverage":
        return <CoverageInformation member={member} setStep={setStep} />;
      case "Primary":
        return (
          <PrimaryInformation
            member={member}
            payment={payment}
            setPayment={setPayment}
            setStep={setStep}
            zipCodeState={zipCodeState}
          />
        );
      case "Dependents":
        return (
          <DependentInformation
            key={"1"}
            member={member}
            agent={agent}
            setAmountOfDependents={setAmountOfDependents}
            amountOfDependents={amountOfDependents}
            amountOfDependentsType={amountOfDependentsType}
            setDependents={setDependents}
            setSelectedPlanVision={setSelectedPlanVision}
            validVisionInState={validVisionInState}
            dependents={dependents}
            setStep={setStep}
          />
        );
      case "Payment":
        return (
          <PaymentInformation
            member={member}
            payment={payment}
            setPayment={setPayment}
            setStep={setStep}
          />
        );
      case "Confirmation":
        return (
          <Confirmation
            selectedPlans={selectedPlans}
            associatedPlan={associatedPlan}
            dependents={dependents}
            member={member}
            setStep={setStep}
          />
        );
      case "Agreements":
        return (
          <Agreements
            agent={agent}
            member={member}
            selectedPlans={selectedPlans}
            associatedPlan={associatedPlan}
            dependents={dependents}
            zipCodeState={zipCodeState}
            availableStatesForAgent={availableStatesForAgent}
            payment={payment}
            setStep={setStep}
          />
        );
      default:
        return <div>Work In Progress</div>;
    }
  };

  const renderImage = () => {
    if (window.innerWidth > 390)
      switch (stepsNames[step - 1]) {
        case "Dental Coverage":
          return setBackgroundURL(
            `linear-gradient(90deg, rgba(0, 55, 100, 0.75) 0%, rgba(83, 191, 231, 0.75) 100%), url("/dentalBackground.jpg")`
          );
        case "Vision Coverage":
          return setBackgroundURL(
            `linear-gradient(90deg, rgba(0, 55, 100, 0.75) 0%, rgba(83, 191, 231, 0.75) 100%), url("/visionBackground.jpg")`
          );
        case "Dental":
          return setBackgroundURL(
            `linear-gradient(90deg, rgba(83, 191, 231, 0.75) 0%, rgba(0, 55, 100, 0.75) 100%)`
          );
        default:
          setBackgroundURL(``);
      }
    else {
      switch (stepsNames[step - 1]) {
        case "Dental Coverage":
          return setBackgroundURL(
            `linear-gradient(90deg, rgba(0, 55, 100, 0.75) 0%, rgba(83, 191, 231, 0.75) 100%), url("/dental1.jpg")`
          );
        case "Vision Coverage":
          return setBackgroundURL(
            `linear-gradient(90deg, rgba(0, 55, 100, 0.75) 0%, rgba(83, 191, 231, 0.75) 100%), url("/vision1.jpg")`
          );
        case "Dental":
          return setBackgroundURL(
            `linear-gradient(90deg, rgba(83, 191, 231, 0.75) 0%, rgba(0, 55, 100, 0.75) 100%)`
          );
        default:
          setBackgroundURL(``);
      }
    }
  };

  useEffect(() => {
    renderImage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window.innerWidth]);

  useEffect(() => {
    renderImage();
    if (step <= 5) {
      let newSteps: string[] = [];
      if (validDentalInState && validVisionInState) {
        newSteps = validDentalAndValidVisionSteps;
      }
      if (!validDentalInState && validVisionInState) {
        newSteps = notValidDentalAndValidVisionSteps;
      }
      if (validDentalInState && !validVisionInState) {
        newSteps = validDentalAndNoValidVisionSteps;
      }
      if (!validDentalInState && !validVisionInState) {
        newSteps = notValidDentalAndNotValidVisionSteps;
      }
      if (amountOfDependentsType === "Member") {
        newSteps = newSteps.filter((current) => current !== "Dependents");
      }
      if (!wantsDental && step > 2) {
        newSteps = newSteps.filter((step) => step !== "Dental");
      }
      if (!wantsVision && step > 3) {
        newSteps = newSteps.filter((step) => step !== "Vision");
      }
      setStepsNames(newSteps);
    }
    if (
      stepsNames[step - 1] === "Dental Coverage" ||
      stepsNames[step - 1] === "Start"
    ) {
      setSelectedPlanVision(new Plan());
    }
    if (stepsNames[step - 1] === "Start") {
      clearState();
    }

    if (step <= 2) {
      setDependents([]);
      setWantsDental(false);
      setWantsVision(false);
    }
    if (
      stepsNames[step - 1] === "Amount of Dependents" ||
      stepsNames[step - 1] === "Dental" ||
      step < 3
    ) {
      setAssociatedPlan(new Plan());
    }
    if (step >= 1 && !loadingAppIdData) {
      let memberToSave = member;
      memberToSave.payment = undefined;
      let memberValue = JSON.stringify(memberToSave);
      let dependentsValue = JSON.stringify(dependents);
      let planDentalValue = JSON.stringify(selectedPlanDental);
      let planVisionValue = JSON.stringify(selectedPlanVision);
      let associationPlanValue = JSON.stringify(associatedPlan);
      let stepsNamesValue = JSON.stringify(stepsNames);
      let availableDentalPlansValue = JSON.stringify(dentalPlans);
      let availableVisionPlansValue = JSON.stringify(visionPlans);
      let availableDentalAssociationPlansValue = JSON.stringify(
        dentalAssociationPlans
      );
      let availableVisionAssociationPlansValue = JSON.stringify(visionPlans);
      let availableDentalVisionAssociationPlansValue = JSON.stringify(
        dentalVisionAssociationPlans
      );

      axios
        .post(
          sessionIDLambdaURL,
          {
            TableName: "metlife-applications",
            Item: {
              app_id: generatedAppId ? generatedAppId : appId,
              step: step,
              state: zipCodeState,
              wantsDental: wantsDental,
              wantsVision: wantsVision,
              validDental: validDentalInState,
              validVision: validVisionInState,
              availableDentalPlans: availableDentalPlansValue,
              availableVisionPlans: availableVisionPlansValue,
              availableDentalVisionAssociationPlans:
                availableDentalVisionAssociationPlansValue,
              availableDentalAssociationPlans:
                availableDentalAssociationPlansValue,
              availableVisionAssociationPlans:
                availableVisionAssociationPlansValue,
              member: memberValue,
              dependents: dependentsValue,
              amountOfDependentsType: amountOfDependentsType,
              amountOfDependents: amountOfDependents,
              planDental: planDentalValue,
              planVision: planVisionValue,
              associationPlan: associationPlanValue,
              stepsNames: stepsNamesValue,
            },
          },
          {
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
          }
        )
        .then(() => {
          if (generatedAppId && step >= 1) {
            navigate(`/${agentId}/${generatedAppId}`);
          }
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  useEffect(() => {
    member.state = zipCodeState;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zipCodeState]);

  return (
    <div className="relative h-full">
      <div
        className={`z-0 flex h-auto w-full flex-col items-center bg-cover bg-center bg-no-repeat ${
          backgroundURL && "bg-opacity-75"
        }`}
        style={{
          backgroundImage: backgroundURL,
        }}
      >
        <Header agentState={agentState} />
        <div className="relative z-40 mb-[100px] flex flex-col items-center justify-center self-center justify-self-center font-inter">
          {loadingAppIdData || loadingPlans ? (
            <div className="flex w-full items-center justify-center self-center text-center text-4xl text-navyBlue lg:h-[70vh]">
              <p>LOADING...</p>
            </div>
          ) : (
            renderStep()
          )}
        </div>
        <div
          className={`fixed bottom-0 z-50 ml-auto mr-auto w-full bg-orange pt-1`}
        >
          <ProgressBar
            step={step}
            // stepsWithDescription={stepsNames}
            setStep={setStep}
            agent={agentState}
          />
        </div>
      </div>
    </div>
  );
};

export default Flow;
