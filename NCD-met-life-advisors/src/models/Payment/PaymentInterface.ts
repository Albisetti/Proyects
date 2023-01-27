export interface IPayment {
  paymentType?: string;
  ccNumber?: string;
  ccExpMonth?: string;
  ccExpYear?: string;
  ccSecurityCode?: string;
  achType?: string;
  achRouting?: string;
  achAccount?: string;
  achBankName?: string;
}
