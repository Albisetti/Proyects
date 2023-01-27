import { IDependent } from "./DependentInterface";
export default class Dependent implements IDependent {
  id?: number;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: number;
  gender?: string;
  dateOfBirth?: string;
  relationship?: string;

  constructor(
    id?: number,
    firstName?: string,
    middleName?: string,
    lastName?: string,
    address?: string,
    city?: string,
    state?: string,
    zipCode?: number,
    gender?: string,
    dateOfBirth?: string,
    relationship?: string
  ) {
    this.firstName = firstName;
    this.middleName = middleName;
    this.lastName = lastName;
    this.address = address;
    this.city = city;
    this.state = state;
    this.zipCode = zipCode;
    this.gender = gender;
    this.dateOfBirth = dateOfBirth;
    this.relationship = relationship;
    this.id = id;
  }
}
