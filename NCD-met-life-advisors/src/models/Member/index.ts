import { IMember } from "./MemberInterface";
import axios from "axios";
import Agent from "../Agent";
import { IDependent } from "../Dependent/DependentInterface";
import Dependent from "../Dependent";
import Payment from "../Payment";
import Plan from "../Plan";
import {
  E123ApiURL,
  memberCreateErrorHandlerZapierWebhookURL,
} from "../../utils";

export default class Member implements IMember {
  corpID?: number;
  agent?: Agent;
  id?: string;
  createdDate?: Date;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  dateOfBirth?: string;
  gender?: string;
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  otherAddress1?: string;
  otherAddress2?: string;
  otherCity?: string;
  otherState?: string;
  otherZipCode?: string;
  email?: string;
  phone1?: string;
  phone2?: string;
  phone3?: string;
  dependents?: IDependent[];
  payment?: Payment;
  paymentProcess?: string;
  billingDate?: string;
  effectiveDate?: string;

  constructor(
    corpID?: number,
    agent?: Agent,
    id?: string,
    createdDate?: Date,
    firstName?: string,
    middleName?: string,
    lastName?: string,
    dateOfBirth = "01/01/1977",
    gender?: string,
    address1?: string,
    address2?: string,
    city?: string,
    state?: string,
    zipCode?: string,
    otherAddress1?: string,
    otherAddress2?: string,
    otherCity?: string,
    otherState?: string,
    otherZipCode?: string,
    email?: string,
    phone1?: string,
    phone2?: string,
    phone3?: string,
    dependents?: Dependent[],
    payment?: Payment,
    paymentProcess?: string,
    billingDate?: string,
    effectiveDate?: string
  ) {
    this.corpID = corpID;
    this.agent = agent;
    this.id = id;
    this.createdDate = createdDate;
    this.firstName = firstName;
    this.middleName = middleName;
    this.lastName = lastName;
    this.dateOfBirth = dateOfBirth;
    this.gender = gender;
    this.address1 = address1;
    this.address2 = address2;
    this.city = city;
    this.state = state;
    this.zipCode = zipCode;
    this.otherAddress1 = otherAddress1;
    this.otherAddress2 = otherAddress2;
    this.otherCity = otherCity;
    this.otherState = otherState;
    this.otherZipCode = otherZipCode;
    this.email = email;
    this.phone1 = phone1;
    this.phone2 = phone2;
    this.phone3 = phone3;
    this.dependents = dependents;
    this.payment = payment;
    this.paymentProcess = paymentProcess;
    this.billingDate = billingDate;
    this.effectiveDate = effectiveDate;
  }

  /**
   * @name createMember
   * @description this function uses the instance of member to save it on the database
   * */
  createMember = async (
    plans: Plan[],
    associationPlan: Plan,
    agentID: number,
    zipCodeState: string,
    availableStatesForAgent: string[]
  ) => {
    let validAgent = false;
    if (availableStatesForAgent.includes(zipCodeState)) validAgent = true;
    const dependents = this.dependents?.map((dependent) => {
      return {
        FIRSTNAME: dependent.firstName,
        MIDDLENAME: dependent.middleName,
        LASTNAME: dependent.lastName,
        RELATIONSHIP: dependent.relationship,
        GENDER: dependent.gender,
        DOB: dependent.dateOfBirth,
      };
    });
    const products = [...plans, associationPlan].map((plan) => {
      if (!plan?.id) return null;
      return {
        PDID: plan.id,
        PERIODID: plan.periodID,
        BENEFITID: plan.benefitID,
        ENROLLERID: !validAgent ? agentID : null,
        dtBilling: this.billingDate,
        dtEffective: this.effectiveDate,
      };
    });
    if (!associationPlan || this.dateOfBirth === "NaN/NaN/NaN") {
      return false;
    }
    return axios
      .post(
        `${E123ApiURL}?apiurl=https://NCDAPI:Welcome123!@api.1administration.com/v1/325737/member/0.json?NCDAPI=249f9b16aff0f0b9-BB2E0109-9437-9934-32F20D7B8756F326`,
        {
          CORPID: 1376,
          AGENT: validAgent ? agentID : 622635,
          FIRSTNAME: this.firstName,
          MIDDLENAME: this.middleName,
          LASTNAME: this.lastName,
          DOB: this.dateOfBirth,
          GENDER: this.gender,
          ADDRESS1: this.address1,
          ADDRESS2: this.address2,
          CITY: this.city,
          STATE: this.state,
          ZIPCODE: this.zipCode,
          EMAIL: this.email,
          PHONE1: this.phone1,
          DEPENDENTS: dependents,
          PAYMENT: this.payment,
          PRODUCTS: products,
          PAYMENTPROCESS: this.paymentProcess,
          LETTER_TEMPLATE_IDS: "28992,26550",
          TrackFlag: "Application",
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            Authorization: "Basic TkNEQVBJOldlbGNvbWUxMjMh",
          },
        }
      )
      .then((data) => {
        this.id = data?.data?.MEMBER?.ID;
        if (!data?.data?.SUCCESS) {
          axios.post(
            `${memberCreateErrorHandlerZapierWebhookURL}`,
            JSON.stringify({
              payload: {
                CORPID: 1376,
                AGENT: validAgent ? agentID : 622635,
                FIRSTNAME: this.firstName,
                MIDDLENAME: this.middleName,
                LASTNAME: this.lastName,
                DOB: this.dateOfBirth,
                GENDER: this.gender,
                ADDRESS1: this.address1,
                ADDRESS2: this.address2,
                CITY: this.city,
                STATE: this.state,
                ZIPCODE: this.zipCode,
                EMAIL: this.email,
                PHONE1: this.phone1,
                DEPENDENTS: dependents,
                PRODUCTS: products,
                PAYMENTPROCESS: this.paymentProcess,
                LETTER_TEMPLATE_IDS: 28992,
              },
              response: { data },
            })
          );
        }
        return data?.data?.SUCCESS;
      })
      .catch((error) => {
        console.log(error);
        axios.post(
          `${memberCreateErrorHandlerZapierWebhookURL}`,
          JSON.stringify({
            payload: {
              CORPID: 1376,
              AGENT: validAgent ? agentID : 622635,
              FIRSTNAME: this.firstName,
              MIDDLENAME: this.middleName,
              LASTNAME: this.lastName,
              DOB: this.dateOfBirth,
              GENDER: this.gender,
              ADDRESS1: this.address1,
              ADDRESS2: this.address2,
              CITY: this.city,
              STATE: this.state,
              ZIPCODE: this.zipCode,
              EMAIL: this.email,
              PHONE1: this.phone1,
              DEPENDENTS: dependents,
              PRODUCTS: products,
              PAYMENTPROCESS: this.paymentProcess,
              LETTER_TEMPLATE_IDS: 28992,
            },
            response: { error },
          })
        );
        return false;
      });
  };
}
