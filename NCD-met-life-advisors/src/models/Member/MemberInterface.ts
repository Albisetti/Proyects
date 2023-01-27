import { IAgent } from "../Agent/AgentInterface";
import { IDependent } from "../Dependent/DependentInterface";
import { IPayment } from "../Payment/PaymentInterface";

export interface IMember {
  corpID?: number;
  agent?: IAgent;
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
  payment?: IPayment;
  billingDate?: string;
  effectiveDate?: string;
}
