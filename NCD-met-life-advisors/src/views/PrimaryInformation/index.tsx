import axios from "axios";
import React, { FC, useEffect, useState } from "react";
import InputMask from "react-input-mask";
import Button from "../../components/Button";
import Member from "../../models/Member";
import Payment from "../../models/Payment";
import {
  states,
  formatDate,
  formatDateString,
  getMaxDate,
  dateIsValid,
  smartyStreetsApi,
} from "../../utils";
import Select from "react-select";
import { AutoComplete } from "antd";

type PrimaryInformationProps = {
  member: Member;
  payment: Payment;
  setPayment: React.Dispatch<React.SetStateAction<Payment>>;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  zipCodeState: string;
};

const PrimaryInformation: FC<PrimaryInformationProps> = ({
  member,
  payment,
  setPayment,
  setStep,
  zipCodeState,
}: PrimaryInformationProps) => {
  const [hasBillingAddress, setHasBillingAddress] = useState(false);

  const [errorAddress, setErrorAddress] = useState("");
  const [errorAddress2, setErrorAddress2] = useState("");
  const [errorCity, setErrorCity] = useState("");
  const [errorPhone, setErrorPhone] = useState("");
  const [errorDate, setErrorDate] = useState("");
  const [errorAddressBilling, setErrorAddressBilling] = useState("");
  const [errorCityBilling, setErrorCityBilling] = useState("");
  const [addressOptions, setAddressOptions] =
    useState<{ value: string; label: string }[]>();
  const [address2Options, setAddress2Options] =
    useState<{ value: string; label: string }[]>();
  const [billingAddressOptions, setBillingAddress2Options] =
    useState<{ value: string; label: string }[]>();
  const [submitted, setSubmitted] = useState(false);
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [city, setCity] = useState(member?.city);
  const [address2, setAddress2] = useState(payment.paymentCity);
  const [billingCity, setBillingCity] = useState(payment.paymentCity);
  const [billingState, setBillingState] = useState(payment.paymentState);

  const requiredFieldsNoBillingAddress = [
    "firstName",
    "lastName",
    "dateOfBirth",
    "gender",
    "address1",
    "city",
    "state",
    "phone1",
  ];
  const nonRequiredFields = ["address2"];
  const requiredFieldsBillingAddress = [
    "paymentAddress",
    "paymentCity",
    "paymentState",
  ];

  function validateFullPage() {
    let memberJson = JSON.parse(JSON.stringify(member));
    let missing = false;
    let newMissingFields: string[] = [];
    requiredFieldsNoBillingAddress.forEach((field) => {
      if (!memberJson[field]) newMissingFields.push(field);
      if (field === "address2")
        if (!handleChangeAddress(memberJson[field])) missing = true;
      if (field === "city")
        if (!handleChangeCity(memberJson[field])) missing = true;
      if (field === "phone1")
        if (!handleChangePhone(memberJson[field])) missing = true;
    });
    nonRequiredFields.forEach((field) => {
      if (field === "address2" && memberJson[field])
        if (!handleChangeAddress2(memberJson[field])) missing = true;
    });
    if (hasBillingAddress) {
      let paymentJson = JSON.parse(JSON.stringify(payment));
      requiredFieldsBillingAddress.forEach((field) => {
        if (!paymentJson[field]) newMissingFields.push(field);
        if (field === "paymentAddress" && memberJson[field])
          if (handleChangeAddressBilling(memberJson[field])) missing = true;
        if (field === "paymentCity" && memberJson[field])
          if (handleChangeCityBilling(memberJson[field])) missing = true;
      });
    }
    setMissingFields(newMissingFields);
    if (missing) return false;
    if (newMissingFields.length > 0) return false;
    return true;
  }

  function isValidAddress(address: string) {
    let regex = /^[A-Za-z0-9]+.*[A-Za-z0-9]+$/i;
    return regex.test(address);
  }

  const handleChangeAddress = (value: string) => {
    if (!isValidAddress(value)) {
      setErrorAddress("Invalid Address");
      return false;
    } else {
      setErrorAddress("");
      return true;
    }
  };

  const handleChangeAddress2 = (value: string) => {
    if (value && !isValidAddress(value)) {
      setErrorAddress2("Invalid Address");
      return false;
    } else {
      setErrorAddress2("");
      return true;
    }
  };

  const handleChangeAddressBilling = (value: string) => {
    if (!isValidAddress(value)) {
      setErrorAddressBilling("Invalid Address");
      return false;
    } else {
      setErrorAddressBilling("");
      return true;
    }
  };

  function isValidCity(city: string) {
    let regex = /^[A-Za-z]+.*[A-Za-z]+$/i;
    return regex.test(city);
  }

  const handleChangeCity = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!isValidCity(event?.target?.value)) {
      setErrorCity("Invalid City Input");
      return false;
    } else {
      setErrorCity("");
      return true;
    }
  };
  const handleChangePhone = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (
      event?.target?.value.slice(3).replaceAll("_", "").replaceAll("-", "")
        .length < 10
    ) {
      setErrorPhone("Invalid Phone Number");
      return false;
    } else {
      setErrorPhone("");
      return true;
    }
  };

  const handleChangeCityBilling = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!isValidCity(event?.target?.value)) {
      setErrorCityBilling("Invalid City Input");
      return false;
    } else {
      setErrorCityBilling("");
      return true;
    }
  };

  const handleChangeDate = (date: Date) => {
    if (isNaN(date.getTime())) {
      setErrorDate("Please input a valid date");
      return false;
    }
    if (date > new Date()) {
      setErrorDate("Date can't be further than today");
      return false;
    }
    if (date > new Date(getMaxDate())) {
      setErrorDate("A primary dependent must be 18 years or older");
      return false;
    }
    setErrorDate("");
    return true;
  };

  const smartyStreets = (
    search: string,
    state: string,
    setter: React.Dispatch<
      React.SetStateAction<
        | {
            value: string;
            label: string;
          }[]
        | undefined
      >
    >
  ) => {
    axios
      .get(smartyStreetsApi, {
        params: {
          include_only_states: state,
          search: search,
        },
      })
      .then((response) => {
        let newAddressOptions: {
          label: string;
          value: string;
          responseObject: string;
        }[] = [];
        response?.data?.suggestions?.forEach(
          (suggestion: {
            street_line: string;
            secondary: string;
            city: string;
            state: string;
          }) => {
            newAddressOptions.push({
              value: suggestion?.street_line,
              responseObject: JSON.stringify({
                streetLine: suggestion?.street_line,
                secondary: suggestion?.secondary,
                city: suggestion?.city,
                state: suggestion?.state,
              }),
              label:
                suggestion?.street_line +
                ", " +
                (suggestion?.secondary ? suggestion?.secondary + ", " : "") +
                suggestion?.city +
                ", " +
                suggestion?.state,
            });
          }
        );
        setter(newAddressOptions);
      });
  };

  useEffect(() => {
    member.city = city;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [city]);

  useEffect(() => {
    member.address2 = address2;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address2]);

  useEffect(() => {
    payment.paymentCity = billingCity;
    payment.paymentState = billingState;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [billingCity, billingState]);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
        if (validateFullPage()) setStep((current) => current + 1);
      }}
      noValidate
    >
      <div className="xl:pt-17 flex min-h-[70vh] w-full flex-col px-2 py-2">
        <div className="mb-4 flex w-full items-center justify-center self-start rounded-[32px] border-4 border-celadonBlue bg-backgroundSolidGrey p-4 text-center">
          <h1 className="flex flex-row items-center justify-center gap-4 text-[32px] font-bold text-navyBlue">
            Primary Member Information
          </h1>
        </div>
        <div className="flex w-full flex-col rounded-[32px] border-4 border-lightBlue bg-backgroundSolidGrey p-4">
          <div className="overflow-y-auto xl:overflow-y-hidden">
            <div className="flex flex-col gap-3 xl:flex-row xl:gap-5">
              <div className="flex w-full flex-col xl:w-auto">
                <label className="text-xl font-bold text-navyBlue xl:mb-3">
                  First Name
                </label>
                <input
                  className={`h-[29px] rounded-[59px]  border border-solid border-celadonBlue pl-2 text-xl font-normal text-navyBlue focus:outline-none xl:w-[243px] ${
                    missingFields.includes("firstName") && "border-red"
                  }`}
                  placeholder="Enter your first name"
                  onChange={(event) => {
                    member.firstName = event?.target?.value;
                    if (submitted) validateFullPage();
                  }}
                  required
                  defaultValue={member.firstName}
                />
                {missingFields.includes("firstName") && (
                  <h2 style={{ color: "red" }}>This field is required.</h2>
                )}
              </div>
              <div className="flex w-full flex-col xl:w-auto">
                <label className="text-xl font-bold text-navyBlue xl:mb-3">
                  Last Name
                </label>
                <input
                  className={`h-[29px] rounded-[59px]  border border-solid border-celadonBlue pl-2 text-xl font-normal text-navyBlue focus:outline-none xl:w-[241px] ${
                    missingFields.includes("lastName") && "border-red"
                  }`}
                  placeholder="Enter your last name"
                  onChange={(event) => {
                    member.lastName = event?.target?.value;
                    if (submitted) validateFullPage();
                  }}
                  defaultValue={member.lastName}
                  required
                />
                {missingFields.includes("lastName") && (
                  <h2 style={{ color: "red" }}>This field is required.</h2>
                )}
              </div>
              <div className="flex w-full flex-col xl:w-auto">
                <label className="text-xl font-bold text-navyBlue xl:mb-3">
                  Birth Date
                </label>
                <input
                  type="date"
                  className={`h-[29px] rounded-[59px]  border border-solid border-celadonBlue pl-2 text-xl font-normal text-navyBlue focus:outline-none xl:w-[259px] ${
                    missingFields.includes("dateOfBirth") && "border-red"
                  }`}
                  onChange={(event) => {
                    if (submitted) validateFullPage();
                    if (
                      handleChangeDate(
                        new Date(formatDateString(event?.target?.value))
                      )
                    ) {
                      member.dateOfBirth = formatDate(
                        new Date(formatDateString(event?.target?.value))
                      );
                    }
                  }}
                  defaultValue={
                    member.dateOfBirth && dateIsValid(member.dateOfBirth)
                      ? new Date(member.dateOfBirth).toISOString().split("T")[0]
                      : "1977-01-01"
                  }
                  max={getMaxDate()}
                  required
                />
                {errorDate && <h2 style={{ color: "red" }}>{errorDate}</h2>}
                {missingFields.includes("dateOfBirth") && (
                  <h2 style={{ color: "red" }}>This field is required.</h2>
                )}
              </div>
              <div className="flex w-full flex-col xl:w-auto">
                <label className="text-xl font-bold text-navyBlue xl:mb-3">
                  Gender
                </label>
                <select
                  className={`h-[29px] rounded-[59px]  border border-solid border-celadonBlue pl-2 text-xl font-normal text-navyBlue focus:outline-none xl:w-[221px] ${
                    missingFields.includes("gender") && "border-red"
                  }`}
                  onChange={(event) => {
                    member.gender = event?.target?.value;
                    if (submitted) validateFullPage();
                  }}
                  defaultValue={member.gender}
                  required
                >
                  <option value={""} hidden disabled selected>
                    Select gender
                  </option>
                  <option value={"M"}>Male</option>
                  <option value={"F"}>Female</option>
                </select>
                {missingFields.includes("gender") && (
                  <h2 style={{ color: "red" }}>This field is required.</h2>
                )}
              </div>
            </div>
            <div className="mt-3 flex flex-col gap-3 xl:flex-row xl:gap-5">
              <div className="mt-3 flex w-full flex-col xl:w-auto">
                <label className="text-xl font-bold text-navyBlue xl:mb-3">
                  Address 1
                </label>
                <AutoComplete
                  className="text-navyBlue xl:w-[504px]"
                  placeholder={
                    <span className="font-inter text-xl text-[#9da3af]">
                      Enter your address
                    </span>
                  }
                  key={"address1"}
                  options={addressOptions}
                  onChange={(event) => {
                    member.address1 = event;
                    if (member.state)
                      smartyStreets(event, member.state, setAddressOptions);
                    if (submitted) validateFullPage();
                  }}
                  onBlur={(event) => {
                    const target = event.target as HTMLInputElement;
                    handleChangeAddress(target?.value);
                  }}
                  onSelect={(event, option) => {
                    const newOption = option as {
                      value: string;
                      responseObject: string;
                      label: string;
                    };
                    const parsedOption = JSON.parse(newOption.responseObject);
                    const streetLine = parsedOption.streetLine;
                    const secondary = parsedOption.secondary; // Apartment or street, could be used in address 2 if requested.
                    const cityResponse = parsedOption.city;
                    member.address1 = streetLine;
                    handleChangeAddress(streetLine);
                    if (secondary) {
                      setAddress2(secondary);
                      handleChangeAddress2(secondary);
                    }
                    if (cityResponse) {
                      setCity(cityResponse);
                      handleChangeCity(cityResponse);
                    }
                  }}
                  children={
                    <input
                      className={`h-[29px] rounded-[59px] border border-solid border-celadonBlue pl-2 font-inter text-xl font-normal text-navyBlue  focus:outline-none  ${
                        missingFields.includes("address1") && "border-red"
                      }`}
                      required
                    />
                  }
                  clearIcon={<></>}
                  defaultValue={member.address1}
                />
                {errorAddress && (
                  <h2 style={{ color: "red" }}>{errorAddress}</h2>
                )}
                {missingFields.includes("address1") && (
                  <h2 style={{ color: "red" }}>This field is required.</h2>
                )}
              </div>
              <div className="mt-3 flex w-full flex-col xl:w-auto">
                <label className="text-xl font-bold text-navyBlue xl:mb-3">
                  Address 2
                </label>
                <input
                  placeholder={"Enter your address"}
                  key={"address2"}
                  className={`h-[29px] rounded-[59px] border border-solid border-celadonBlue pl-2 font-inter text-xl font-normal text-navyBlue text-navyBlue focus:outline-none xl:w-[504px]  ${
                    missingFields.includes("address2") && "border-red"
                  }`}
                  value={address2 ? address2 : ""}
                  onChange={(event) => {
                    setAddress2(event?.target?.value);
                    if (submitted) validateFullPage();
                  }}
                  onBlur={(event) => {
                    handleChangeAddress2(event?.target?.value);
                  }}
                  defaultValue={member.address2}
                />
                {errorAddress2 && (
                  <h2 style={{ color: "red" }}>{errorAddress2}</h2>
                )}
                {missingFields.includes("address2") && (
                  <h2 style={{ color: "red" }}>This field is required.</h2>
                )}
              </div>
            </div>
            <div className="mt-3 flex flex-col gap-3 xl:flex-row xl:gap-5">
              <div className="flex w-full flex-col xl:w-auto">
                <label className="text-xl font-bold text-navyBlue xl:mb-3">
                  Zip Code
                </label>
                <input
                  className={`h-[29px] rounded-[59px]  border border-solid border-celadonBlue pl-2 text-xl font-normal text-navyBlue focus:outline-none xl:w-[243px] ${
                    missingFields.includes("address1") && "border-red"
                  }`}
                  defaultValue={member.zipCode}
                  required
                  disabled
                />
              </div>
              <div className="flex w-full flex-col xl:w-auto">
                <label className="text-xl font-bold text-navyBlue xl:mb-3">
                  City
                </label>
                <input
                  className={`h-[29px] rounded-[59px]  border border-solid border-celadonBlue pl-2 text-xl font-normal text-navyBlue focus:outline-none xl:w-[243px] ${
                    missingFields.includes("address1") && "border-red"
                  }`}
                  placeholder="Enter your city"
                  value={city ? city : ""}
                  onChange={(event) => {
                    setCity(event?.target?.value);
                    if (submitted) validateFullPage();
                  }}
                  onBlur={(event) => {
                    handleChangeCity(event);
                  }}
                  defaultValue={member.city}
                  required
                />
                {errorCity && <h2 style={{ color: "red" }}>{errorCity}</h2>}
                {missingFields.includes("city") && (
                  <h2 style={{ color: "red" }}>This field is required.</h2>
                )}
              </div>
              <div className="flex w-full flex-col xl:w-auto">
                <label className="text-xl font-bold text-navyBlue xl:mb-3">
                  State
                </label>
                <select
                  className={`h-[29px] rounded-[59px]  border border-solid border-celadonBlue pl-2 text-xl font-normal text-navyBlue focus:outline-none xl:w-[243px] ${
                    missingFields.includes("state") && "border-red"
                  }`}
                  onChange={(event) => {
                    member.state = event?.target?.value;
                    if (submitted) validateFullPage();
                  }}
                  defaultValue={member.state}
                  disabled
                  required
                >
                  <option value={""} className="text-#9da3af" hidden selected>
                    Select State
                  </option>

                  {states.map((state) => {
                    return (
                      <option value={state?.abbreviation}>{state?.name}</option>
                    );
                  })}
                </select>
                {missingFields.includes("state") && (
                  <h2 style={{ color: "red" }}>This field is required.</h2>
                )}
              </div>
              <div className="flex w-full flex-col xl:w-auto">
                <label className="text-xl font-bold text-navyBlue xl:mb-3">
                  Phone Number
                </label>
                <InputMask
                  mask="+1 999-999-9999"
                  alwaysShowMask={true}
                  className={`h-[29px] rounded-[59px]  border border-solid border-celadonBlue pl-2 text-xl font-normal text-navyBlue focus:outline-none xl:w-[243px] ${
                    missingFields.includes("phone1") && "border-red"
                  }`}
                  onChange={(event) => {
                    member.phone1 = event?.target?.value.slice(3);
                    if (submitted) validateFullPage();
                  }}
                  onBlur={(event) => {
                    handleChangePhone(event);
                  }}
                  defaultValue={member.phone1}
                  required
                />
                {errorPhone && <h2 style={{ color: "red" }}>{errorPhone}</h2>}
                {missingFields.includes("phone1") && (
                  <h2 style={{ color: "red" }}>This field is required.</h2>
                )}
              </div>
            </div>
            {hasBillingAddress && (
              <>
                <div className="mt-3 flex flex-col gap-3 xl:flex-row xl:gap-5">
                  <div className="flex w-full flex-col xl:w-auto">
                    <label className="text-xl font-bold text-navyBlue xl:mb-3">
                      Billing Address
                    </label>
                    <AutoComplete
                      className="text-navyBlue xl:w-[504px]"
                      key={"billing"}
                      placeholder={
                        <span className="font-inter text-xl text-[#9da3af]">
                          Enter your address
                        </span>
                      }
                      options={billingAddressOptions}
                      onChange={(event) => {
                        setPayment((current) => {
                          current.paymentAddress = event;
                          return current;
                        });
                        smartyStreets(
                          event,
                          payment.paymentState ? payment.paymentState : "",
                          setBillingAddress2Options
                        );
                        if (submitted) validateFullPage();
                      }}
                      onBlur={(event) => {
                        const target = event.target as HTMLInputElement;
                        handleChangeAddressBilling(target?.value);
                      }}
                      onSelect={(event, option) => {
                        const newOption = option as {
                          value: string;
                          responseObject: string;
                          label: string;
                        };
                        const parsedResponseObject = JSON.parse(
                          newOption.responseObject
                        );
                        const streetLine = parsedResponseObject.streetLine;
                        const secondary = parsedResponseObject.secondary; // Apartment or street, could be used in address 2 if requested.
                        const cityResponse = parsedResponseObject.city;
                        const stateResponse = parsedResponseObject.state;
                        member.address1 = streetLine;
                        handleChangeAddressBilling(streetLine);
                        if (cityResponse) {
                          setPayment((current) => {
                            current.paymentCity = cityResponse;
                            return current;
                          });
                          setBillingCity(cityResponse);
                          handleChangeCityBilling(cityResponse);
                        }
                        if (stateResponse) {
                          setPayment((current) => {
                            current.paymentState = stateResponse;
                            return current;
                          });
                          setBillingState(stateResponse);
                        }
                      }}
                      children={
                        <input
                          className={`h-[29px] rounded-[59px] border border-solid border-celadonBlue pl-2 font-inter text-xl font-normal text-navyBlue  focus:outline-none  ${
                            missingFields.includes("paymentAddress") &&
                            "border-red"
                          }`}
                          required
                        />
                      }
                      clearIcon={<></>}
                      defaultValue={payment.paymentAddress}
                    />
                    {errorAddress && (
                      <h2 style={{ color: "red" }}>{errorAddressBilling}</h2>
                    )}
                    {missingFields.includes("paymentAddress") && (
                      <h2 style={{ color: "red" }}>This field is required.</h2>
                    )}
                  </div>
                  <div className="flex w-full flex-col xl:w-auto">
                    <label className="text-xl font-bold text-navyBlue xl:mb-3">
                      Billing City
                    </label>
                    <input
                      className={`h-[29px] rounded-[59px]  border border-solid border-celadonBlue pl-2 text-xl font-normal text-navyBlue focus:outline-none xl:w-[243px] ${
                        missingFields.includes("paymentCity") && "border-red"
                      }`}
                      value={billingCity}
                      onChange={(event) => {
                        setPayment((current) => {
                          current.paymentCity = event?.target?.value;
                          return current;
                        });
                        setBillingCity(event?.target?.value);
                        if (submitted) validateFullPage();
                      }}
                      onBlur={(event) => {
                        handleChangeCityBilling(event);
                      }}
                      defaultValue={payment.paymentCity}
                      required
                    />
                    {errorCity && (
                      <h2 style={{ color: "red" }}>{errorCityBilling}</h2>
                    )}
                    {missingFields.includes("paymentCity") && (
                      <h2 style={{ color: "red" }}>This field is required.</h2>
                    )}
                  </div>
                  <div className="flex w-full flex-col xl:w-auto">
                    <label className="text-xl font-bold text-navyBlue xl:mb-3">
                      Billing State
                    </label>
                    <select
                      className={`h-[29px] rounded-[59px]  border border-solid border-celadonBlue pl-2 text-xl font-normal text-navyBlue focus:outline-none xl:w-[243px] ${
                        missingFields.includes("paymentState") && "border-red"
                      }`}
                      value={billingState ? billingState : ""}
                      onChange={(event) => {
                        setPayment((current) => {
                          current.paymentState = event?.target?.value;
                          return current;
                        });
                        setBillingState(event?.target?.value);
                        if (submitted) validateFullPage();
                      }}
                      defaultValue={payment.paymentState}
                      required
                    >
                      <option value={""} hidden selected>
                        Select State
                      </option>

                      {states.map((state) => {
                        return (
                          <option value={state?.abbreviation}>
                            {state?.name}
                          </option>
                        );
                      })}
                    </select>
                    {missingFields.includes("paymentState") && (
                      <h2 style={{ color: "red" }}>This field is required.</h2>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="sticky bottom-[5.5rem] z-[50] mt-10 flex flex-col items-center gap-5 bg-backgroundSolidGrey py-2 md:static md:grid md:grid-cols-3 md:bg-none md:py-0">
            <div className="items-star order-first flex flex-row justify-self-start">
              <input
                type="radio"
                className="mt-2 ml-2 h-[24px] w-[24px] border-solid border-celadonBlue text-celadonBlue accent-celadonBlue checked:bg-lightBlue sm:mt-0"
                checked={hasBillingAddress}
                onClick={() => {
                  setHasBillingAddress(!hasBillingAddress);
                }}
              />
              <label className="ml-2 max-w-[213px]">
                My billing address is different than the address listed above
              </label>
            </div>
            <div className="flex h-[40px] w-[231px] flex-row self-center justify-self-center text-2xl md:self-end">
              <Button text="Submit" submit={true} mainPath />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PrimaryInformation;
