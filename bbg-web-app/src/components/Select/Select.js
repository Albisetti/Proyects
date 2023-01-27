import React from "react";
import Select from "react-select";

import theme, { baseColors as colors } from "../../config/theme";

export const customStyles = {
  option: (provided, state) => ({
    ...provided,
    fontSize: "1rem",
    padding: "8px 12px"
  }),
  indicatorsContainer: (provided, state) => ({
    ...provided,
    paddingRight: "2px"
  }),
  dropdownIndicator: (provided, state) => ({
    ...provided,
    padding: "8px 5px"
  }),
  clearIndicator: (provided, state) => ({
    ...provided,
    padding: "8px 5px 8px 0"
  }),
  indicatorSeparator: (provided, state) => ({
    ...provided,
    backgroundColor: state.isMulti ? "#efefef" : "transparent"
  }),
  valueContainer: (provided, state) => ({
    ...provided,
    padding: state.isMulti ? "4px" : provided.padding
  }),
  control: (provided, state) => ({
    ...provided,
    fontSize: "1rem",
    minHeight: theme.forms.inputHeight,
    borderColor: state.selectProps.isInvalid
      ? theme.colors.danger.base
      : state.isFocused
      ? theme.forms.focusBorderColor
      : theme.forms.borderColor,
    boxShadow: state.isFocused ? theme.forms.boxShadow : null,
    "&:hover": {
      borderColor: state.selectProps.isInvalid
        ? theme.colors.danger.base
        : state.isFocused
        ? theme.forms.focusBorderColor
        : theme.forms.borderColor
    }
  })
};

export const GroupOption = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const GroupBadge = styled.span`
  background-color: #ebecf0;
  border-radius: 2em;
  color: #172b4d;
  display: inline-block;
  font-size: 12;
  font-weight: normal;
  line-height: 1;
  min-width: 1;
  padding: 0.16666666666667em 0.5em;
  text-align: center;
`;

const customTheme = baseTheme => ({
  ...baseTheme,
  borderRadius: baseTheme.borderRadius.base,
  colors: {
    ...baseTheme.colors,
    primary: colors.primary,
    primary25: theme.colors.grey.light,
    primary50: theme.colors.grey.base
  }
});

export default ({ styles, ...props }) => (
  <Select
    styles={{ ...customStyles, ...styles }}
    theme={customTheme}
    {...props}
  />
);
