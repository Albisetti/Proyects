export const states = [
  {
    name: "Alabama",
    abbreviation: "AL",
  },
  {
    name: "Alaska",
    abbreviation: "AK",
  },
  {
    name: "Arizona",
    abbreviation: "AZ",
  },
  {
    name: "Arkansas",
    abbreviation: "AR",
  },
  {
    name: "California",
    abbreviation: "CA",
  },
  {
    name: "Colorado",
    abbreviation: "CO",
  },
  {
    name: "Connecticut",
    abbreviation: "CT",
  },
  {
    name: "Delaware",
    abbreviation: "DE",
  },
  {
    name: "Florida",
    abbreviation: "FL",
  },
  {
    name: "Georgia",
    abbreviation: "GA",
  },
  {
    name: "Hawaii",
    abbreviation: "HI",
  },
  {
    name: "Idaho",
    abbreviation: "ID",
  },
  {
    name: "Illinois",
    abbreviation: "IL",
  },
  {
    name: "Indiana",
    abbreviation: "IN",
  },
  {
    name: "Iowa",
    abbreviation: "IA",
  },
  {
    name: "Kansas",
    abbreviation: "KS",
  },
  {
    name: "Kentucky",
    abbreviation: "KY",
  },
  {
    name: "Louisiana",
    abbreviation: "LA",
  },
  {
    name: "Maine",
    abbreviation: "ME",
  },
  {
    name: "Maryland",
    abbreviation: "MD",
  },
  {
    name: "Massachusetts",
    abbreviation: "MA",
  },
  {
    name: "Michigan",
    abbreviation: "MI",
  },
  {
    name: "Minnesota",
    abbreviation: "MN",
  },
  {
    name: "Mississippi",
    abbreviation: "MS",
  },
  {
    name: "Missouri",
    abbreviation: "MO",
  },
  {
    name: "Montana",
    abbreviation: "MT",
  },
  {
    name: "Nebraska",
    abbreviation: "NE",
  },
  {
    name: "Nevada",
    abbreviation: "NV",
  },
  {
    name: "New Hampshire",
    abbreviation: "NH",
  },
  {
    name: "New Jersey",
    abbreviation: "NJ",
  },
  {
    name: "New Mexico",
    abbreviation: "NM",
  },
  {
    name: "New York",
    abbreviation: "NY",
  },
  {
    name: "North Carolina",
    abbreviation: "NC",
  },
  {
    name: "North Dakota",
    abbreviation: "ND",
  },
  {
    name: "Ohio",
    abbreviation: "OH",
  },
  {
    name: "Oklahoma",
    abbreviation: "OK",
  },
  {
    name: "Oregon",
    abbreviation: "OR",
  },
  {
    name: "Pennsylvania",
    abbreviation: "PA",
  },
  {
    name: "Rhode Island",
    abbreviation: "RI",
  },
  {
    name: "South Carolina",
    abbreviation: "SC",
  },
  {
    name: "South Dakota",
    abbreviation: "SD",
  },
  {
    name: "Tennessee",
    abbreviation: "TN",
  },
  {
    name: "Texas",
    abbreviation: "TX",
  },
  {
    name: "Utah",
    abbreviation: "UT",
  },
  {
    name: "Vermont",
    abbreviation: "VT",
  },
  {
    name: "Virginia",
    abbreviation: "VA",
  },
  {
    name: "Washington",
    abbreviation: "WA",
  },
  {
    name: "West Virginia",
    abbreviation: "WV",
  },
  {
    name: "Wisconsin",
    abbreviation: "WI",
  },
  {
    name: "Wyoming",
    abbreviation: "WY",
  },
];

export function padTo2Digits(num: number) {
  return num.toString().padStart(2, "0");
}

export function formatDateString(dateString: string) {
  return dateString.replaceAll("-", "/");
}

export function formatDate(date: Date) {
  return [
    padTo2Digits(date.getMonth() + 1),
    padTo2Digits(date.getDate()),
    date.getFullYear(),
  ].join("/");
}

export function displayDate(dateToDisplay: string) {
  let date = new Date(dateToDisplay);
  date = new Date(date.getTime() + Math.abs(date.getTimezoneOffset() * 60000));
  return date;
}

export function getMinDateBilling() {
  let currentDate = new Date();
  let monthString = "";
  let dayString = "";
  let maxYear = currentDate.getFullYear();
  let month = currentDate.getMonth() + 1;
  let day = currentDate.getDate();
  if (month < 10) monthString = "0" + month.toString();
  else monthString = month.toString();
  if (day < 10) dayString = "0" + day.toString();
  else dayString = day.toString();
  return maxYear + "-" + monthString + "-" + dayString;
}

export function getMaxDateBilling() {
  let currentDate = new Date();
  let validDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 3,
    1
  );
  let monthString = "";
  let dayString = "";
  let maxYear = validDate.getFullYear();
  let month = validDate.getMonth() + 1;
  let day = validDate.getDate();
  if (month < 10) monthString = "0" + month.toString();
  else monthString = month.toString();
  if (day < 10) dayString = "0" + day.toString();
  else dayString = day.toString();
  return maxYear + "-" + monthString + "-" + dayString;
}

export function getMaxDate() {
  let currentDate = new Date();
  let monthString = "";
  let dayString = "";
  let maxYear = currentDate.getFullYear() - 18;
  let month = currentDate.getMonth() + 1;
  let day = currentDate.getDate();
  if (month < 10) monthString = "0" + month.toString();
  else monthString = month.toString();
  if (day < 10) dayString = "0" + day.toString();
  else dayString = day.toString();
  return maxYear + "-" + monthString + "-" + dayString;
}

export function getMaxDateChildren() {
  let currentDate = new Date();
  currentDate.setDate(currentDate.getDate() - 1);
  let monthString = "";
  let dayString = "";
  let month = currentDate.getMonth() + 1;
  let day = currentDate.getDate();
  if (month < 10) monthString = "0" + month.toString();
  else monthString = month.toString();
  if (day < 10) dayString = "0" + day.toString();
  else dayString = day.toString();
  return currentDate.getFullYear() + "-" + monthString + "-" + dayString;
}

export function getMinDate() {
  let currentDate = new Date();
  let monthString = "";
  let dayString = "";
  let maxYear = currentDate.getFullYear() - 25;
  let month = currentDate.getMonth() + 1;
  let day = currentDate.getDate();
  if (month < 10) monthString = "0" + month.toString();
  else monthString = month.toString();
  if (day < 10) dayString = "0" + day.toString();
  else dayString = day.toString();
  return maxYear + "-" + monthString + "-" + dayString;
}

export function dateIsValid(date?: string) {
  if (!date) return false;
  return !Number.isNaN(new Date(date).getTime());
}

export function formatPhoneNumber(phoneNumber?: string) {
  let cleaned = ("" + phoneNumber).replace(/\D/g, "");
  let match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return match[1] + "-" + match[2] + "-" + match[3];
  }
  return null;
}

export const nonValidDentalStates = [
  "AK",
  "ME",
  "MD",
  "MT",
  "NH",
  "NM",
  "NC",
  "OR",
  "SD",
  "VT",
  "WA",
  "UT",
];

export const nonValidVisionStates = ["NY", "OR"];

export const sessionIDLambdaURL = `https://jwl1zynux4.execute-api.us-west-2.amazonaws.com/default/metlife-session-handler`;
export const E123ApiURL = `https://api.1administration.workers.dev/proxy/`;
export const agentLoginLambdaURL = `https://49wfkxt669.execute-api.us-west-2.amazonaws.com`;
export const memberCreateErrorHandlerZapierWebhookURL = `https://hooks.zapier.com/hooks/catch/13728512/bxa0eks/`;
export const smartyStreetsApi = `https://us-autocomplete-pro.api.smartystreets.com/lookup?key=96942227415750359`;

export const NCDValueByMetLife = 38796;
export const NCDEssentialsByMetLife = 38398;
export const NCDCompleteByMetLife = 38399;

export const NCDValueByMetLifeNYCT = 39849;
export const NCDEssentialsByMetLifeNYCT = 39847;
export const NCDCompleteByMetLifeNYCT = 39848;

export const VSPPreferredByMetLife = 38593;
export const VSPextra = 39651;

export const dentalPlansIDs = [
  NCDValueByMetLife,
  NCDEssentialsByMetLife,
  NCDCompleteByMetLife,
];

export const dentalPlansIDsNYCT = [
  NCDValueByMetLifeNYCT,
  NCDEssentialsByMetLifeNYCT,
  NCDCompleteByMetLifeNYCT,
];

export const dentalAssociationPlansIDs = [38449, 38450];

export const visionPlanIDs = [VSPPreferredByMetLife];
export const visionPlanIDsForNonValidStates = [VSPextra];
export const visionAssociationPlansIDs = [38923];

export const bundleAssociationPlansIDs = [38928, 38941];

export const validDentalAndValidVisionSteps = [
  "Start",
  "Dental Coverage",
  "Vision Coverage",
  "Amount of Dependents",
  "Dental",
  "Confirm Cart",
  "Coverage",
  "Primary",
  "Dependents",
  "Payment",
  "Confirmation",
  "Agreements",
  "Completed",
];

export const validDentalAndNoValidVisionSteps = [
  "Start",
  "Dental Coverage",
  "Vision Coverage",
  "Amount of Dependents",
  "Dental",
  "Confirm Cart",
  "Coverage",
  "Primary",
  "Dependents",
  "Payment",
  "Confirmation",
  "Agreements",
  "Completed",
];

export const notValidDentalAndValidVisionSteps = [
  "Start",
  "Vision Coverage",
  "Amount of Dependents",
  "Confirm Cart",
  "Coverage",
  "Primary",
  "Dependents",
  "Payment",
  "Confirmation",
  "Agreements",
  "Completed",
];

export const notValidDentalAndNotValidVisionSteps = [
  "Start",
  "Vision Coverage",
  "Amount of Dependents",
  "Confirm Cart",
  "Coverage",
  "Primary",
  "Dependents",
  "Payment",
  "Confirmation",
  "Agreements",
  "Completed",
];
