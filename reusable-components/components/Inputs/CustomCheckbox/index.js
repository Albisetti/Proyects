import React from "react";
import PropTypes from "prop-types";

import "./styles.css";

function Checkbox({ name, label, checked, size }) {
  return (
    <label className="form-control">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        style={size ? { width: size, height: size } : null}
      />
      {label}
    </label>
  );
}

Checkbox.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string.isRequired,
  checked: PropTypes.bool,
  size: PropTypes.string,
};

Checkbox.defaultProps = {
  checked: false,
  size: "",
};

export default Checkbox;
