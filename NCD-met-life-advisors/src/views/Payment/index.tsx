import React, { FC, useEffect, useState } from "react";
import Button from "../../components/Button";
import Member from "../../models/Member";
import Payment from "../../models/Payment";
import { formatDate } from "../../utils";
import moment from "moment";

type PaymentInformationProps = {
  member: Member;
  payment: Payment;
  setPayment: React.Dispatch<React.SetStateAction<Payment>>;
  setStep: React.Dispatch<React.SetStateAction<number>>;
};

const PaymentInformation: FC<PaymentInformationProps> = ({
  member,
  payment,
  setPayment,
  setStep,
}: PaymentInformationProps) => {
  const [paymentType, setPaymentType] = useState("ACH");

  const [creditCardNumber, setCreditCardNumber] = useState("");
  const [ccv, setCcv] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [routingNumber, setRoutingNumber] = useState("");
  const [routingNumberError, setRoutingNumberError] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [expiredCard, setExpiredCard] = useState(false);
  const [accountNumberError, setAccountNumberError] = useState("");
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const currentDate = moment();

  const requiredFieldsACH = [
    "achRouting",
    "achAccount",
    "achType",
    "achBankName",
  ];
  const requiredFieldsCC = [
    "ccNumber",
    "ccExpMonth",
    "ccExpYear",
    "ccSecurityCode",
  ];

  useEffect(() => {
    setPayment((current) => {
      current = new Payment();
      current.paymentType = paymentType;
      return current;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentType]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month, year]);

  function validateFullPage() {
    let paymentJson = JSON.parse(JSON.stringify(payment));
    let newMissingFields: string[] = [];
    if (paymentType === "ACH") {
      requiredFieldsACH.forEach((field) => {
        if (!paymentJson[field]) newMissingFields.push(field);
      });
    }
    if (paymentType === "CC") {
      requiredFieldsCC.forEach((field) => {
        if (!paymentJson[field]) newMissingFields.push(field);
      });
    }
    setMissingFields(newMissingFields);
    if (newMissingFields.length > 0) return false;
    return true;
  }

  return (
    <div className="xl:pt-17 flex min-h-[70vh] w-full flex-col px-2 py-2">
      <div className="mb-4 flex w-full items-center justify-center self-start rounded-[32px] border-4 border-celadonBlue bg-backgroundSolidGrey p-4 text-center">
        <h1 className="flex flex-row items-center justify-center gap-4 text-[32px] font-bold text-navyBlue">
          Payment Information
        </h1>
      </div>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (
            moment(`${year}-${month}-01`, "YY-MM-DD").isBefore(currentDate) &&
            paymentType === "CC"
          ) {
            setExpiredCard(true);
          } else {
            setExpiredCard(false);
            member.payment = payment;
            member.paymentProcess =
              member.billingDate === formatDate(new Date()) ? "Y" : "N";
            setSubmitted(true);
            if (validateFullPage()) setStep((current) => current + 1);
          }
        }}
        noValidate
      >
        <div className="flex w-full flex-col items-center justify-center gap-1">
          <div className="flex flex-col rounded-[32px] border-4 border-celadonBlue bg-backgroundSolidGrey py-9 pl-9 pr-9 xl:pr-[287px]">
            <div className="ml-3 flex flex-col font-montserrat font-bold text-navyBlue xl:max-h-[690px] xl:max-w-5xl">
              <div className="flex flex-col items-center gap-7 xl:flex-row">
                <div className="text-xl font-bold text-navyBlue">
                  Please select a payment method
                </div>
                <div>
                  <fieldset className="flex flex-row gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="method"
                        value="ACH"
                        className="h-[25px] w-[25px] accent-lightBlue checked:bg-lightBlue"
                        checked={paymentType === "ACH"}
                        onChange={(event) => {
                          setPaymentType(event?.target?.value);
                          setCreditCardNumber("");
                          setCcv("");
                          setMonth("");
                          setYear("");
                          setAccountNumber("");
                          setAccountNumberError("");
                          setRoutingNumber("");
                          setRoutingNumberError("");
                          if (submitted) validateFullPage();
                        }}
                      />
                      <span className="pl-2 font-bold text-lightBlue">
                        ACH (Preferred)
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="method"
                        value="CC"
                        className="h-[25px] w-[25px] accent-lightBlue checked:bg-lightBlue"
                        checked={paymentType === "CC"}
                        onChange={(event) => {
                          setPaymentType(event?.target?.value);
                          setCreditCardNumber("");
                          setCcv("");
                          setMonth("");
                          setYear("");
                          setAccountNumber("");
                          setAccountNumberError("");
                          setRoutingNumber("");
                          setRoutingNumberError("");
                          if (submitted) validateFullPage();
                        }}
                      />
                      <span
                        className={`pl-2 ${
                          paymentType === "CC"
                            ? "text-navyBlue"
                            : "text-[#4B4B4B]"
                        }`}
                      >
                        Credit Card
                      </span>
                    </label>
                  </fieldset>
                </div>
              </div>
              {paymentType === "ACH" && (
                <div className="flex flex-col gap-4  pt-4 pb-2 pr-2">
                  <div className="text-xl font-medium text-navyBlue">
                    Bank Account Information
                  </div>
                  <div className="flex flex-col gap-2 xl:flex-row xl:flex-wrap xl:gap-5">
                    <div className="flex flex-col">
                      <label className="flex flex-col font-normal">
                        <span className="pb-3 text-xl font-bold text-black">
                          Routing Number
                        </span>
                        <input
                          className={`h-[29px] rounded-[59px]  border border-solid border-celadonBlue pl-2 text-xl font-normal text-navyBlue focus:outline-none xl:w-[241px] ${
                            missingFields.includes("achRouting") && "border-red"
                          }`}
                          placeholder="Enter number"
                          type={"number"}
                          value={routingNumber}
                          onChange={(event) => {
                            if (event?.target?.value?.length > 9) return;
                            if (event?.target?.value?.length < 9)
                              setRoutingNumberError(
                                "Routing number must be 9 digits long"
                              );
                            if (event?.target?.value?.length === 9)
                              setRoutingNumberError("");
                            setRoutingNumber(event?.target?.value);
                            setPayment((current) => {
                              current.achRouting = event?.target?.value;
                              return current;
                            });
                            if (submitted) validateFullPage();
                          }}
                          required
                        />
                      </label>
                      {routingNumberError && (
                        <h2 className="font-light" style={{ color: "red" }}>
                          {routingNumberError}
                        </h2>
                      )}
                      {missingFields.includes("achRouting") && (
                        <h2 className="font-light" style={{ color: "red" }}>
                          This field is required.
                        </h2>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <label className="flex flex-col font-normal">
                        <span className="pb-3 text-xl font-bold text-black">
                          Account Number
                        </span>
                        <input
                          className={`h-[29px] rounded-[59px]  border border-solid border-celadonBlue pl-2 text-xl font-normal text-navyBlue focus:outline-none xl:w-[241px] ${
                            missingFields.includes("achAccount") && "border-red"
                          }`}
                          placeholder="Enter number"
                          type={"number"}
                          value={accountNumber}
                          onChange={(event) => {
                            if (event?.target?.value?.length > 17) return;
                            if (event?.target?.value?.length < 5)
                              setAccountNumberError(
                                "Account number must between 5 and 17 digits long"
                              );
                            if (
                              event?.target?.value?.length >= 5 &&
                              event?.target?.value?.length <= 17
                            )
                              setAccountNumberError("");
                            setAccountNumber(event?.target?.value);
                            setPayment((current) => {
                              current.achAccount = event?.target?.value;
                              return current;
                            });
                            if (submitted) validateFullPage();
                          }}
                          required
                        />
                      </label>
                      {accountNumberError && (
                        <h2 className="font-light" style={{ color: "red" }}>
                          {accountNumberError}
                        </h2>
                      )}
                      {missingFields.includes("achAccount") && (
                        <h2 className="font-light" style={{ color: "red" }}>
                          This field is required.
                        </h2>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <label className="flex flex-col font-normal">
                        <span className="pb-3 text-xl font-bold text-black">
                          Account Type
                        </span>
                        <select
                          className={`h-[29px] rounded-[59px]  border border-solid border-celadonBlue pl-2 text-xl font-normal text-navyBlue focus:outline-none xl:w-[241px] ${
                            missingFields.includes("achType") && "border-red"
                          }`}
                          onChange={(event) => {
                            setPayment((current) => {
                              current.achType = event?.target?.value;
                              return current;
                            });
                            if (submitted) validateFullPage();
                          }}
                          defaultValue={""}
                          required
                        >
                          <option value={""} className="" hidden>
                            Select type
                          </option>
                          <option value={"C"}>Checking</option>
                          <option value={"S"}>Savings</option>
                        </select>
                        {missingFields.includes("achType") && (
                          <h2 style={{ color: "red" }}>
                            This field is required.
                          </h2>
                        )}
                      </label>
                    </div>
                  </div>
                  <div className="flex flex-col gap-8 xl:flex-row">
                    <label className="flex flex-col font-normal">
                      <span className="pb-3 text-xl font-bold text-black">
                        Name of the bank where debit is authorized
                      </span>
                      <input
                        className={`h-[29px] rounded-[59px]  border border-solid border-celadonBlue pl-2 text-xl font-normal text-navyBlue focus:outline-none xl:w-[514px] ${
                          missingFields.includes("achBankName") && "border-red"
                        }`}
                        placeholder="Enter bank name"
                        onChange={(event) => {
                          setPayment((current) => {
                            current.achBankName = event?.target?.value;
                            return current;
                          });
                          if (submitted) validateFullPage();
                        }}
                        required
                      />
                      {missingFields.includes("achBankName") && (
                        <h2 style={{ color: "red" }}>
                          This field is required.
                        </h2>
                      )}
                    </label>
                    <div className="sticky bottom-[5.5rem] z-[50] flex flex-row justify-between bg-backgroundSolidGrey py-2 md:static md:bg-none md:py-0">
                      <div className="h-[46px] w-[241px] self-end pl-2 font-inter text-2xl font-normal">
                        <Button
                          text="Submit"
                          disabled={
                            accountNumberError || routingNumberError
                              ? true
                              : false
                          }
                          submit
                          mainPath
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row font-normal text-black">
                    <img
                      src="/lock.png"
                      alt="lock"
                      className="mt-1 h-[20px] w-fit"
                    />
                    <div className="ml-4 mt-1">
                      {" "}
                      Your Account information is protected using industry
                      standard SSL Encryption technology.
                    </div>
                  </div>
                  <div className="mb-[37px] flex max-h-[199px] max-w-[376px] flex-col">
                    <div className="pb-[10px] text-xl font-bold text-celadonBlue">
                      Example check
                    </div>
                    <img src="/exampleCheck.png" alt="example check" />
                  </div>
                </div>
              )}
              {paymentType === "CC" && (
                <div className="flex flex-col gap-4 p-2">
                  <div>Credit Card Information</div>
                  <div className="flex flex-col flex-wrap gap-2 xl:flex-row xl:flex-nowrap xl:gap-5">
                    <div className="flex flex-col">
                      <label className="flex flex-col font-normal">
                        <span className="pb-3 text-xl font-bold text-black">
                          Card Number
                        </span>
                        <input
                          className={`h-[29px] rounded-[59px]  border border-solid border-celadonBlue pl-2 text-xl font-normal text-navyBlue focus:outline-none xl:w-[241px] ${
                            missingFields.includes("ccNumber") && "border-red"
                          }`}
                          type="number"
                          inputMode="numeric"
                          pattern={"[0-9s]{13,19}"}
                          autoComplete="cc-number"
                          placeholder="xxxx xxxx xxxx xxxx"
                          value={creditCardNumber}
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
                            if (
                              event?.target?.value.substring(0, 2) === "34" ||
                              event?.target?.value.substring(0, 2) === "37"
                            ) {
                              if (event?.target?.value.length > 15) return;
                            } else {
                              if (event?.target?.value.length > 16) return;
                            }
                            setCreditCardNumber(event?.target?.value);
                            setPayment((current) => {
                              current.ccNumber = event?.target?.value;
                              return current;
                            });
                            if (submitted) validateFullPage();
                          }}
                          required
                        />
                        {missingFields.includes("ccNumber") && (
                          <h2 style={{ color: "red" }}>
                            This field is required.
                          </h2>
                        )}
                      </label>
                    </div>
                    <div className="flex flex-col">
                      <label className="flex flex-col font-normal">
                        <span className="pb-3 text-xl font-bold text-black">
                          Month
                        </span>
                        <input
                          className={`h-[29px] rounded-[59px]  border border-solid border-celadonBlue pl-2 text-xl font-normal text-navyBlue focus:outline-none xl:w-[102px] ${
                            missingFields.includes("ccExpMonth") && "border-red"
                          }`}
                          placeholder="xx"
                          type={"number"}
                          value={month}
                          onChange={(event) => {
                            if (event?.target?.value.length > 2) return;
                            let date;
                            if (parseInt(event?.target?.value) < 10) {
                              date = new Date(
                                new Date().getFullYear() +
                                  "-" +
                                  "0" +
                                  event?.target?.value +
                                  "-" +
                                  new Date().getDate()
                              );
                            } else {
                              date = new Date(
                                new Date().getFullYear() +
                                  "-" +
                                  event?.target?.value +
                                  "-" +
                                  new Date().getDate()
                              );
                            }
                            if (
                              isNaN(date.getTime()) &&
                              event?.target?.value &&
                              event?.target?.value !== "0"
                            )
                              return;
                            if (
                              ["2", "3", "4", "5", "6", "7", "8", "9"].includes(
                                event?.target?.value
                              )
                            )
                              return;

                            setMonth(event?.target?.value);
                            setPayment((current) => {
                              current.ccExpMonth = event?.target?.value;
                              return current;
                            });

                            if (submitted) validateFullPage();
                          }}
                          onBlur={() => {
                            if (!year || !month) return;
                            if (
                              moment(
                                `${year}-${month}-01`,
                                "YY-MM-DD"
                              ).isBefore(currentDate)
                            ) {
                              setExpiredCard(true);
                            } else {
                              setExpiredCard(false);
                            }
                          }}
                          required
                        />
                        {missingFields.includes("ccExpMonth") && (
                          <h2 style={{ color: "red" }}>
                            This field is required.
                          </h2>
                        )}
                      </label>
                    </div>
                    <div className="flex flex-col">
                      <label className="flex flex-col font-normal">
                        <span className="pb-3 text-xl font-bold text-black">
                          Year
                        </span>
                        <input
                          className={`h-[29px] rounded-[59px]  border border-solid border-celadonBlue pl-2 text-xl font-normal text-navyBlue focus:outline-none xl:w-[170px] ${
                            missingFields.includes("ccExpYear") && "border-red"
                          }`}
                          placeholder="xx"
                          type={"number"}
                          value={year}
                          onChange={(event) => {
                            if (event?.target?.value.length > 2) return;
                            setYear(event?.target?.value);
                            setPayment((current) => {
                              current.ccExpYear = event?.target?.value;
                              return current;
                            });
                            if (submitted) validateFullPage();
                          }}
                          onBlur={() => {
                            if (!year || !month) return;
                            if (
                              moment(
                                `${year}-${month}-01`,
                                "YY-MM-DD"
                              ).isBefore(currentDate)
                            ) {
                              setExpiredCard(true);
                            } else {
                              setExpiredCard(false);
                            }
                          }}
                          required
                        />
                        {missingFields.includes("ccExpYear") && (
                          <h2 style={{ color: "red" }}>
                            This field is required.
                          </h2>
                        )}
                      </label>
                    </div>
                    <div className="flex flex-col">
                      <label className="flex flex-col font-normal">
                        <span className="pb-3 text-xl font-bold text-black">
                          CCV
                        </span>
                        <input
                          className={`h-[29px] rounded-[59px]  border border-solid border-celadonBlue pl-2 text-xl font-normal text-navyBlue focus:outline-none xl:w-[170px] ${
                            missingFields.includes("ccSecurityCode") &&
                            "border-red"
                          }`}
                          placeholder={
                            creditCardNumber.substring(0, 2) === "34" ||
                            creditCardNumber.substring(0, 2) === "37"
                              ? "xxxx"
                              : "xxx"
                          }
                          type={"number"}
                          value={ccv}
                          onChange={(event) => {
                            if (payment?.ccNumber) {
                              if (
                                creditCardNumber.substring(0, 2) === "34" ||
                                creditCardNumber.substring(0, 2) === "37"
                              ) {
                                if (event?.target?.value.length > 4) {
                                  return;
                                }
                              } else {
                                if (event?.target?.value.length > 3) return;
                              }
                            }
                            setCcv(event?.target?.value);
                            setPayment((current) => {
                              current.ccSecurityCode = event?.target?.value;
                              return current;
                            });
                            if (submitted) validateFullPage();
                          }}
                          required
                        />
                        {missingFields.includes("ccSecurityCode") && (
                          <h2 style={{ color: "red" }}>
                            This field is required.
                          </h2>
                        )}
                      </label>
                    </div>
                    <div className="flex flex-row justify-between">
                      <div className="h-[46px] w-[241px] self-end pl-2 font-inter text-2xl font-normal">
                        <Button
                          text="Submit"
                          disabled={
                            accountNumberError || routingNumberError
                              ? true
                              : false
                          }
                          submit
                          mainPath
                        />
                      </div>
                    </div>
                  </div>
                  {expiredCard && (
                    <h2 style={{ color: "red" }}>This card is expired.</h2>
                  )}
                  <div className="flex flex-row font-normal text-black">
                    <img
                      src="/lock.png"
                      alt="lock"
                      className="mt-1 h-[20px] w-fit"
                    />
                    <div className="ml-4 mt-1">
                      {" "}
                      Your Account information is protected using industry
                      standard SSL Encryption technology.
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PaymentInformation;
