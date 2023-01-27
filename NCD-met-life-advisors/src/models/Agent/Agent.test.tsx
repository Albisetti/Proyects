import Agent from ".";

test("Given the correct agent values, agentLogin should return an Agent", async () => {
  const agentForTest = new Agent(600539);
  const agentLoginResponse = await agentForTest.loginAgent();
  expect(agentLoginResponse?.status === 200).toBe(true);
});
