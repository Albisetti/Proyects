import React, { FC, useEffect, useState } from "react";
import Button from "../../components/Button";
import Member from "../../models/Member";
import {
  dateIsValid,
  formatDate,
  formatDateString,
  getMaxDateBilling,
  getMinDateBilling,
} from "../../utils";
import { Tooltip } from "@material-tailwind/react";

type CoverageInformationProps = {
  member: Member;
  setStep: React.Dispatch<React.SetStateAction<number>>;
};

const CoverageInformation: FC<CoverageInformationProps> = ({
  member,
  setStep,
}: CoverageInformationProps) => {
  const [validDates, setValidDates] = useState<Date[]>();
  const [error, setError] = useState("");
  const [errorDate, setErrorDate] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const [billingDate, setBillingDate] = useState(new Date());
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const currentDate = new Date();

  const requiredFields = ["email", "billingDate", "effectiveDate"];

  function getFirstDayOfMonth(year: number, month: number) {
    return new Date(year, month, 1);
  }

  useEffect(() => {
    let calculatedValidDates: Date[] = [];
    [
      currentDate.getMonth() + 1,
      currentDate.getMonth() + 2,
      currentDate.getMonth() + 3,
    ].forEach((month) => {
      calculatedValidDates.push(
        getFirstDayOfMonth(currentDate.getFullYear(), month)
      );
    });
    setValidDates(calculatedValidDates);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function isValidEmail(email: string) {
    let regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/i;
    return regex.test(email);
  }

  const handleChange = (value: string) => {
    if (!isValidEmail(value)) {
      setError("Email is invalid");
      return false;
    } else {
      setError("");
      return true;
    }
  };

  const handleChangeDate = (date: Date) => {
    if (date < new Date(getMinDateBilling())) {
      setErrorDate("Date can't be before today");
      return false;
    }
    let newValidDates: Date[] = [];
    [
      currentDate.getMonth() + 1,
      currentDate.getMonth() + 2,
      currentDate.getMonth() + 3,
    ].forEach((month) => {
      const validDate = getFirstDayOfMonth(currentDate.getFullYear(), month);
      if (validDate > date) {
        newValidDates.push(validDate);
      }
    });
    if (newValidDates.length === 0) {
      setErrorDate(
        "Date can't be further than 3 months from today or the same as the effective date"
      );
      return false;
    }
    if (
      date >
      getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth() + 3)
    ) {
      setErrorDate(
        "Date can't be further than 3 months from today or the same as the effective date"
      );
      return false;
    }
    setValidDates(newValidDates);
    setErrorDate("");
    return true;
  };

  function validateFullPage() {
    let memberJson = JSON.parse(JSON.stringify(member));
    let missingEmail = false;
    let newMissingFields: string[] = [];
    requiredFields.forEach((field) => {
      if (!memberJson[field]) newMissingFields.push(field);
      if (field === "email") {
        if (!handleChange(memberJson[field])) {
          missingEmail = true;
        }
      }
    });
    setMissingFields(newMissingFields);
    if (missingEmail) return false;
    if (newMissingFields.length > 0) return false;
    return true;
  }

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
            Coverage Information - Details
          </h1>
        </div>
        <div className="flex w-full flex-col rounded-[32px] border-4 border-lightBlue bg-backgroundSolidGrey p-4">
          <div className="flex w-full flex-col items-center justify-center gap-5 overflow-y-auto overflow-x-hidden xl:flex-row">
            <div className="flex w-full flex-col self-start">
              <label className="mb-[11px] flex flex-row items-center text-xl font-bold text-navyBlue">
                Product Effective Date{" "}
                <Tooltip
                  content="Effective date must be the 1st of the month following
                  enrollment or the 1st of one of the following two months."
                  className="z-50 bg-black bg-opacity-75 p-2"
                >
                  <img
                    className="ml-1 h-5 w-5"
                    src="/question_mark_icon.svg"
                    alt=""
                  />
                </Tooltip>
              </label>
              <select
                className={`h-[29px] rounded-[59px] border border-solid border-celadonBlue pl-2 text-xl font-normal text-navyBlue focus:outline-none xl:w-[262px] ${
                  missingFields.includes("effectiveDate") && "border-red"
                }`}
                onChange={(event) => {
                  member.billingDate = formatDate(new Date());
                  member.effectiveDate = event.target.value;
                  if (submitted) validateFullPage();
                }}
                defaultValue={member.effectiveDate}
                required
              >
                <option value={""} hidden>
                  Select Date
                </option>
                {validDates?.map((date) => {
                  if (formatDate(date) === member.effectiveDate) {
                    return (
                      <option
                        className={date <= billingDate ? `hidden` : ``}
                        disabled={date <= billingDate}
                        value={formatDate(date)}
                        selected={date <= billingDate ? false : true}
                      >
                        {date.toDateString()}
                      </option>
                    );
                  }
                  return (
                    <option
                      className={date <= billingDate ? `hidden` : ``}
                      disabled={date <= billingDate}
                      value={formatDate(date)}
                    >
                      {date.toDateString()}
                    </option>
                  );
                })}
              </select>
              {missingFields.includes("effectiveDate") && (
                <h2 style={{ color: "red" }}>This field is required.</h2>
              )}
            </div>
            <div className="flex w-full flex-col self-start">
              <label className="mb-[11px] flex flex-row items-center text-lg font-bold text-navyBlue">
                First Billing Date
                <Tooltip
                  content="First billing date must be before the effective date."
                  className="z-50 bg-black bg-opacity-75 p-2"
                >
                  <img
                    className="ml-1 h-5 w-5"
                    src="/question_mark_icon.svg"
                    alt=""
                  />
                </Tooltip>
              </label>
              <input
                type="date"
                className={`h-[29px] rounded-[59px]  border border-solid border-celadonBlue pl-2 text-xl font-normal text-navyBlue focus:outline-none xl:w-[197px] ${
                  missingFields.includes("billingDate") && "border-red"
                }`}
                onChange={(event) => {
                  if (
                    handleChangeDate(
                      new Date(formatDateString(event?.target?.value))
                    )
                  ) {
                    member.billingDate = formatDate(
                      new Date(formatDateString(event?.target?.value))
                    );
                    setBillingDate(
                      new Date(formatDateString(event?.target?.value))
                    );
                  }
                  if (submitted) validateFullPage();
                }}
                defaultValue={
                  member.billingDate && dateIsValid(member.billingDate)
                    ? new Date(member.billingDate).toISOString().split("T")[0]
                    : new Date().toISOString().split("T")[0]
                }
                min={getMinDateBilling()}
                max={getMaxDateBilling()}
                required
              />
              {errorDate && <h2 style={{ color: "red" }}>{errorDate}</h2>}
              {missingFields.includes("billingDate") && (
                <h2 style={{ color: "red" }}>This field is required.</h2>
              )}
            </div>

            <div className="flex w-full flex-col items-center justify-between gap-5 lg:flex-row">
              <div className="flex w-full flex-col self-start pb-5 pr-2">
                <label className="mb-[11px] text-lg font-bold text-navyBlue">
                  Email{" "}
                </label>
                <div className="flex flex-col items-center justify-center gap-5 xl:flex-row">
                  <input
                    type="email"
                    className={`h-[29px] w-full self-start justify-self-start rounded-[59px] border border-solid border-celadonBlue pl-2 text-xl font-normal text-navyBlue focus:outline-none xl:w-[328px] ${
                      missingFields.includes("email") && "border-red"
                    }`}
                    placeholder="Enter your email"
                    onChange={(event) => {
                      member.email = event.target.value;
                      if (submitted) validateFullPage();
                    }}
                    onBlur={(event) => {
                      handleChange(event.target.value);
                    }}
                    defaultValue={member.email}
                    required
                  />
                  <div className="h-[29px] w-[156px] text-base">
                    <Button text="Submit" submit mainPath />
                  </div>
                </div>
                {error && <h2 style={{ color: "red" }}>{error}</h2>}
                {missingFields.includes("email") && (
                  <h2 style={{ color: "red" }}>This field is required.</h2>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CoverageInformation;
