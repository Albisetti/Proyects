import React, { useState } from "react";
import PropTypes from "prop-types";
import cx from "classnames";

import "./styles.css";

const initialInvalidState = {
  name: false,
  email: false,
  phone: false,
  message: false,
};

function Form({ className }) {
  const [fullName, setFullName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const [buttonText, setButtonText] = useState("Submit");
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [invalid, setInvalid] = useState(initialInvalidState);
  const [error, setError] = useState("");

  const handleChange = (e, func) => {
    func(e.target.value);
    setInvalid(initialInvalidState);
  };

  const invalidFields = () => {
    let invalid = Object.assign({}, invalid);

    if (!fullName) invalid["name"] = true;

    if (!email || !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
      invalid["email"] = true;

    if (
      !phone ||
      !/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(phone)
    )
      invalid["phone"] = true;

    if (!message) invalid["message"] = true;

    setInvalid(invalid);
    return (
      invalid["name"] ||
      invalid["email"] ||
      invalid["phone"] ||
      invalid["message"]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (invalidFields()) return;

    setButtonText("Sending...");
    setButtonDisabled(true);
    setTimeout(() => {
      setButtonText("Sent!");
    }, 2000);

    // fetch("/api/sendgrid/contact", {
    //   method: "post",
    //   body: JSON.stringify({
    //     fullName,
    //     company,
    //     email,
    //     phone,
    //     message,
    //   }),
    // })
    //   .then((res) => res.json())
    //   .then((res) => {
    //     if (res.status !== 202) return setError("Oops! Something went wrong.");
    //     setButtonText("Sent!");
    //   });
  };

  return (
    <form
      className={cx("grid grid-cols-2 gap-8", className)}
      onSubmit={handleSubmit}
      noValidate
    >
      <div
        className={cx("form-control col-span-2 md:col-span-1", {
          ["invalid"]: invalid["name"],
        })}
      >
        <input
          type="text"
          id="fullName"
          name="fullName"
          value={fullName}
          placeholder="Full Name"
          disabled={buttonDisabled}
          onChange={(e) => handleChange(e, setFullName)}
        />
        <span>Please enter your name.</span>
      </div>
      <div className="form-control col-span-2 md:col-span-1">
        <input
          type="text"
          id="company"
          name="company"
          value={company}
          placeholder="Company/Organization"
          disabled={buttonDisabled}
          onChange={(e) => setCompany(e.target.value)}
        />
      </div>
      <div
        className={cx("form-control col-span-2 md:col-span-1", {
          ["invalid"]: invalid["email"],
        })}
      >
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          placeholder="Email Address"
          disabled={buttonDisabled}
          onChange={(e) => handleChange(e, setEmail)}
        />
        <span>Please enter a valid email address.</span>
      </div>
      <div
        className={cx("form-control col-span-2 md:col-span-1", {
          ["invalid"]: invalid["phone"],
        })}
      >
        <input
          type="tel"
          id="phone"
          name="phone"
          value={phone}
          placeholder="Phone Number"
          disabled={buttonDisabled}
          onChange={(e) => handleChange(e, setPhone)}
        />
        <span>Please enter a valid phone number.</span>
      </div>
      <div
        className={cx("form-control col-span-2", {
          ["invalid"]: invalid["message"],
        })}
      >
        <textarea
          rows="6"
          id="message"
          name="message"
          value={message}
          placeholder="Message"
          disabled={buttonDisabled}
          onChange={(e) => handleChange(e, setMessage)}
        />
        <span>Please enter your message.</span>
      </div>
      <div className="form-control col-span-2">
        <input
          type="submit"
          value={buttonText}
          disabled={buttonDisabled}
          className="btn"
        />
      </div>
      {error && (
        <div className="col-span-2">
          <p className="text-orange">{error}</p>
        </div>
      )}
    </form>
  );
}

Form.propTypes = {
  className: PropTypes.string,
};

export default Form;
