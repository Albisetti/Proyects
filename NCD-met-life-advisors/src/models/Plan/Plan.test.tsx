import Plan from ".";

test("Given the correct plan values, getPlanDetails should return a plan", async () => {
  const planForTest = new Plan(38398);
  const getPlanDetailsResponse = await planForTest.getPlanDetails(
    planForTest.id,
    "Member",
    600539,
    "99500"
  );
  expect(getPlanDetailsResponse instanceof Plan).toBe(true);
});
