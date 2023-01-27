import { IPlan } from "./PlanInterface";
import axios from "axios";
import { E123ApiURL } from "../../utils";

export default class Plan implements IPlan {
  id?: number;
  label?: string;
  benefitID?: number;
  benefitLabel?: string;
  periodID?: number;
  periodLabel?: string;
  rate?: number;
  type?: string;

  constructor(
    id?: number,
    label?: string,
    benefitID?: number,
    benefitLabel?: string,
    periodID?: number,
    periodLabel?: string,
    rate?: number,
    type?: string
  ) {
    this.id = id;
    this.label = label;
    this.benefitID = benefitID;
    this.benefitLabel = benefitLabel;
    this.periodID = periodID;
    this.periodLabel = periodLabel;
    this.rate = rate;
    this.type = type;
  }

  getPlanDetails = async (
    productID = this.id,
    amountOfDependentsLabel: string,
    agentID?: number,
    zipcode?: string,
    state = ""
  ) => {
    return await axios
      .get(
        `${E123ApiURL}?apiurl=https://www.1administration.com/api/rate/index.cfc?method=getRates&corpid=1376&username=NCDAPI&password=Welcome123!&NCDAPI=249f9b16aff0f0b9-BB2E0109-9437-9934-32F20D7B8756F326`,
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            Authorization: "Basic TkNEQVBJOldlbGNvbWUxMjMh",
          },
          params: {
            PAYLOAD: {
              PRODUCT: { PRODUCTID: productID, agentid: agentID },
              PRIMARY: { ZIPCODE: zipcode, STATE: state },
              SPOUSE: {},
            },
          },
        }
      )
      .then((response) => {
        let rates;
        this.id = response?.data?.ID;
        this.label = response?.data?.LABEL;
        rates = response?.data?.RATES?.filter(
          (rate: { BENEFITLABEL: string }) => {
            if (
              rate.BENEFITLABEL === "Member + 1" &&
              (amountOfDependentsLabel === "Member plus Spouse" ||
                amountOfDependentsLabel === "Member plus Children")
            ) {
              return true;
            }
            return rate.BENEFITLABEL === amountOfDependentsLabel;
          }
        );
        this.benefitID = rates[0].BENEFITID;
        this.benefitLabel = rates[0].BENEFITLABEL;
        this.periodID = rates[0].PERIODID;
        this.periodLabel = rates[0].PERIODLABEL;
        this.rate = rates[0].RATE;
        this.type = rates[0].TYPE;
        return this;
      })
      .catch((error) => {
        return this;
      });
  };
}
