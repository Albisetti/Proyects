import { IAgent } from "./AgentInterface";
import axios from "axios";
import { agentLoginLambdaURL } from "../../utils";

export default class Agent implements IAgent {
  id?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: number;

  constructor(
    id?: number,
    firstName?: string,
    lastName?: string,
    email?: string,
    phoneNumber?: number
  ) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.phoneNumber = phoneNumber;
  }

  /**
   * @name loginAgent
   * @param agentId
   * @description this function takes the ID of an Agent and validates it to give it access
   * */
  loginAgent = async (agentId = this.id) => {
    return await axios
      .get(`${agentLoginLambdaURL}/agent-login/auth/${agentId}`)
      .then((response) => {
        const agent = JSON.parse(response.data);
        this.id = agent.ID;
        this.firstName = agent.FIRSTNAME;
        this.lastName = agent.LASTNAME;
        this.email = agent.EMAIL;
        this.phoneNumber = agent.PHONE1;
        return response;
      })
      .catch((error) => {
        console.log(error);
        return error;
      });
  };

  /**
   * @name getAgentlicnese
   * @param agentId
   * @description Gets the agent licenses
   * */
  getAgentLicense = async (agentId = this.id) => {
    return await axios
      .get(`${agentLoginLambdaURL}/agent-login/get-license/${agentId}`)
      .then((response) => {
        return response.data;
      });
  };
}
