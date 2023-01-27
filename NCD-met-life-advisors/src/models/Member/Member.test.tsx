import Member from ".";
import { formatDate } from "../../utils";
import Agent from "../Agent";
import Dependent from "../Dependent";
import Payment from "../Payment";
import Plan from "../Plan";

test("Given the correct member values, create member should return a success response", async () => {
  const memberForTest = new Member(
    undefined,
    new Agent(600539),
    undefined,
    new Date(),
    "firstName",
    undefined,
    "lastName",
    "03/03/1970",
    "M",
    "Address",
    "Address 2",
    "Houston",
    "TX",
    "99500",
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    "testemail@gmail.com",
    "111111111111",
    undefined,
    undefined,
    [
      new Dependent(
        undefined,
        "FirstName",
        undefined,
        "LastName",
        undefined,
        undefined,
        undefined,
        undefined,
        "F",
        "03/03/1970",
        "Spouse"
      ),
    ],
    new Payment("CC", "4111111111111111", "06", "23", "729"),
    "Y",
    formatDate(new Date()),
    formatDate(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1))
  );
  const createMemberResponse = await memberForTest.createMember(
    [
      new Plan(
        38398,
        "NCD Essentials by MetLife",
        51,
        "Member",
        1,
        "per Month",
        52,
        "Product"
      ),
    ],
    new Plan(
      38398,
      "NCD Essentials by MetLife",
      51,
      "Member",
      1,
      "per Month",
      52,
      "Product"
    ),
    600539,
    "NV",
    ["NV"]
  );
  expect(createMemberResponse).toBe(true);
});
