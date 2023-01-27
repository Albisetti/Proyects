import { IPayment } from "./PaymentInterface";

export default class Payment implements IPayment {
  paymentType?: string;
  ccNumber?: string;
  ccExpMonth?: string;
  ccExpYear?: string;
  ccSecurityCode?: string;
  achType?: string;
  achRouting?: string;
  achAccount?: string;
  achBankName?: string;
  paymentAddress?: string;
  paymentCity?: string;
  paymentState?: string;
  paymentZipCode?: string;

  constructor(
    paymentType?: string,
    ccNumber?: string,
    ccExpMonth?: string,
    ccExpYear?: string,
    ccSecurityCode?: string,
    achType?: string,
    achRouting?: string,
    achAccount?: string,
    achBankName?: string,
    paymentAddress?: string,
    paymentCity?: string,
    paymentState?: string,
    paymentZipCode?: string
  ) {
    this.paymentType = paymentType;
    this.ccNumber = ccNumber;
    this.ccExpMonth = ccExpMonth;
    this.ccExpYear = ccExpYear;
    this.ccSecurityCode = ccSecurityCode;
    this.achType = achType;
    this.achRouting = achRouting;
    this.achAccount = achAccount;
    this.achBankName = achBankName;
    this.paymentAddress = paymentAddress;
    this.paymentCity = paymentCity;
    this.paymentState = paymentState;
    this.paymentZipCode = paymentZipCode;
  }
}
