import React, { FC, useEffect, useState } from "react";
import Dependent from "../../../models/Dependent";
import {
  dateIsValid,
  formatDate,
  formatDateString,
  getMaxDate,
  getMaxDateChildren,
  getMinDate,
} from "../../../utils";
import Button from "../../Button";

type DependentListProps = {
  index: number;
  dependent: Dependent;
  dependents: Dependent[];
  setDependents: React.Dispatch<React.SetStateAction<Dependent[]>>;
  amountOfDependents: number;
  setAmountOfDependents: React.Dispatch<React.SetStateAction<number>>;
  spouseSelected: Boolean;
  amountOfDependentsType: string;
  setSpouseSelected: React.Dispatch<React.SetStateAction<Boolean>>;
  setErrorList: React.Dispatch<React.SetStateAction<Boolean[]>>;
  errorList: Boolean[];
  missingFields: { [field: string]: boolean };
  validateFullPage: () => void;
  submitted: boolean;
};

const DependentList: FC<DependentListProps> = ({
  index,
  dependent,
  dependents,
  setSpouseSelected,
  spouseSelected,
  amountOfDependentsType,
  setDependents,
  setAmountOfDependents,
  amountOfDependents,
  setErrorList,
  errorList,
  missingFields,
  validateFullPage,
  submitted,
}: DependentListProps) => {
  const [error, setError] = useState("");

  useEffect(() => {
    if (amountOfDependentsType === "Member plus Spouse")
      dependent.relationship = "Spouse";
    else if (amountOfDependentsType === "Member plus Children")
      dependent.relationship = "Child";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amountOfDependentsType]);

  const handleChangeDate = (date: Date, dependent: Dependent) => {
    if (date > new Date()) {
      setError("Date can't be further than today");
      return false;
    }
    if (dependent.relationship === "Spouse") {
      if (date > new Date(getMaxDate().replace(/-/g, "/"))) {
        setError("A Spouse dependent must be 18 years or older");
        let tempErrorList = [...errorList];
        tempErrorList[index] = true;
        setErrorList(tempErrorList);
        return false;
      }
    } else if (dependent.relationship === "Child") {
      if (
        date > new Date(getMaxDateChildren().replace(/-/g, "/")) ||
        date < new Date(getMinDate().replace(/-/g, "/"))
      ) {
        setError("A Child dependent must be between the ages of 0 and 25");
        let tempErrorList = [...errorList];
        tempErrorList[index] = true;
        setErrorList(tempErrorList);
        return false;
      }
    }
    setError("");
    let tempErrorList = [...errorList];
    tempErrorList[index] = false;
    setErrorList(tempErrorList);
    return true;
  };

  const defaultRelationshipValue = () => {
    switch (amountOfDependentsType) {
      case "Member plus Spouse":
        return "Spouse";
      case "Member plus Children":
        return "Child";
      default:
        return dependent.relationship;
    }
  };

  return (
    <>
      <div className="flex w-full flex-col items-start justify-start gap-8 xl:w-auto xl:flex-row">
        <div className="flex w-full flex-col xl:w-auto">
          <label className="text-xl font-bold text-navyBlue xl:mb-3">
            First Name
          </label>
          <input
            className={`h-[29px] rounded-[59px]  border border-solid border-celadonBlue pl-2 text-xl font-normal text-navyBlue focus:outline-none xl:w-[365px] ${
              missingFields && missingFields["firstName"] && "border-red"
            }`}
            placeholder="Enter the dependent first name"
            onChange={(event) => {
              dependent.firstName = event.target.value;
              if (submitted) validateFullPage();
            }}
            defaultValue={dependent.firstName}
            required
          />
          {missingFields && missingFields["firstName"] && (
            <h2 style={{ color: "red" }}>This field is required.</h2>
          )}
        </div>
        <div className="flex w-full flex-col xl:w-auto">
          <label className="text-xl font-bold text-navyBlue xl:mb-3">
            Last Name
          </label>
          <input
            className={`h-[29px] rounded-[59px]  border border-solid border-celadonBlue pl-2 text-xl font-normal text-navyBlue focus:outline-none xl:w-[365px] ${
              missingFields && missingFields["lastName"] && "border-red"
            }`}
            placeholder="Enter the dependent last name"
            onChange={(event) => {
              dependent.lastName = event.target.value;
              if (submitted) validateFullPage();
            }}
            defaultValue={dependent.lastName}
            required
          />
          {missingFields && missingFields["lastName"] && (
            <h2 style={{ color: "red" }}>This field is required.</h2>
          )}
        </div>
      </div>
      <div className="flex w-full flex-col items-start justify-start gap-4 xl:mt-4 xl:w-auto xl:max-w-full xl:flex-row xl:flex-wrap">
        <div className="flex w-full flex-col xl:w-auto">
          <label className="text-xl font-bold text-navyBlue xl:mb-3">
            Birth Date
          </label>
          <input
            type="date"
            className={`h-[29px] rounded-[59px]  border border-solid border-celadonBlue pl-2 text-xl font-normal text-navyBlue focus:outline-none xl:w-[241px] ${
              missingFields && missingFields["dateOfBirth"] && "border-red"
            }`}
            onChange={(event) => {
              let newDateOfBirth = new Date(
                formatDateString(event?.target?.value)
              );
              if (handleChangeDate(newDateOfBirth, dependent)) {
                dependent.dateOfBirth = formatDate(
                  new Date(formatDateString(event?.target?.value))
                );
              }
              if (submitted) validateFullPage();
            }}
            defaultValue={
              dependent.dateOfBirth && dateIsValid(dependent.dateOfBirth)
                ? new Date(dependent.dateOfBirth).toISOString().split("T")[0]
                : ""
            }
            min={dependent?.relationship === "Child" ? getMinDate() : ""}
            max={
              dependent?.relationship === "Spouse"
                ? getMaxDate()
                : getMaxDateChildren()
            }
            required
          />
          {missingFields && missingFields["dateOfBirth"] && (
            <h2 style={{ color: "red" }}>This field is required.</h2>
          )}
          {error && (
            <h2 className="xl:max-w-[241px]" style={{ color: "red" }}>
              {error}
            </h2>
          )}
        </div>
        <div className="flex w-full flex-col xl:w-auto">
          <label className="text-xl font-bold text-navyBlue xl:mb-3">
            Gender
          </label>
          <select
            className={`h-[29px] rounded-[59px]  border border-solid border-celadonBlue pl-2 text-xl font-normal text-navyBlue focus:outline-none xl:w-[241px] ${
              missingFields && missingFields["gender"] && "border-red"
            }`}
            onChange={(event) => {
              dependent.gender = event.target.value;
              if (submitted) validateFullPage();
            }}
            defaultValue={dependent.gender}
          >
            <option value={""} hidden>
              Select gender
            </option>
            <option value={"M"}>Male</option>
            <option value={"F"}>Female</option>
          </select>
          {missingFields && missingFields["gender"] && (
            <h2 style={{ color: "red" }}>This field is required.</h2>
          )}
        </div>
        <div className="flex w-full flex-col xl:w-auto">
          <label className="text-xl font-bold text-navyBlue xl:mb-3">
            Relationship
          </label>
          <select
            className={`h-[29px] rounded-[59px]  border border-solid border-celadonBlue pl-2 text-xl font-normal text-navyBlue focus:outline-none xl:w-[241px] ${
              missingFields && missingFields["relationship"] && "border-red"
            }`}
            onChange={(event) => {
              if (
                event.target.value === "Spouse" &&
                dependent.relationship !== "Spouse"
              ) {
                setSpouseSelected(true);
              }

              if (
                event.target.value !== "Spouse" &&
                dependent.relationship === "Spouse"
              ) {
                setSpouseSelected(false);
              }
              dependent.relationship = event.target.value;
              if (dependent?.dateOfBirth) {
                handleChangeDate(new Date(dependent.dateOfBirth), dependent);
              }
              if (submitted) validateFullPage();
            }}
            defaultValue={defaultRelationshipValue()}
            disabled={
              amountOfDependentsType === "Member plus Spouse" ||
              amountOfDependentsType === "Member plus Children"
            }
            required
          >
            <option value={""} hidden>
              Select Relationship
            </option>

            <option value={"Spouse"} hidden={spouseSelected ? true : false}>
              Spouse
            </option>
            <option value={"Child"}>Child</option>
          </select>
          {missingFields && missingFields["relationship"] && (
            <h2 style={{ color: "red" }}>This field is required.</h2>
          )}
        </div>
      </div>
      {amountOfDependentsType === "Member plus Children" && index >= 1 && (
        <div className="mt-4 flex h-[30px] w-[100px] items-center justify-center font-bold">
          <Button
            text="REMOVE"
            action={() => {
              setDependents((current) => {
                return current?.filter((value) => value?.id !== dependent?.id);
              });
              setAmountOfDependents(amountOfDependents - 1);
            }}
          />
        </div>
      )}
      {amountOfDependentsType === "Family" && index >= 2 && (
        <div className="mt-4 flex h-[30px] w-[100px] items-center justify-center font-bold">
          <Button
            text="REMOVE"
            action={() => {
              setDependents((current) => {
                return current?.filter((value) => value?.id !== dependent?.id);
              });
              setSpouseSelected(false);
              setAmountOfDependents(amountOfDependents - 1);
            }}
          />
        </div>
      )}
      {index + 1 !== amountOfDependents && (
        <div className="my-8 h-[2px] w-full bg-navyBlue" />
      )}
    </>
  );
};

export default DependentList;
