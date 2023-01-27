import React, { useEffect, useState } from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import CreatableSelect from 'react-select/creatable';

const CommonSelect = ({
  styles,
  options,
  placeHolder,
  menuPlacement,
  isMulti,
  type,
  className,
  disabled,
  clean,
  optionsToRemove,
  value,
  name,
  from,
  error,
  noOptionsMessage,
  onChange,
  creatable
}) => {
  const [selectOptions, setSelectOptions] = useState([]);

  useEffect(() => {
    if (options && options.edges && options.edges.length > 0) {
      const data = options.edges.map((a) => {
        return {
          label: type==="subcontractor"?a?.node?.company_name:a?.node?.name,
          value: a?.node?.id,
        };
      });
      setSelectOptions(data);

      if (optionsToRemove && optionsToRemove.length > 0) {
        let removedData = data.filter(
          (el) => !optionsToRemove.includes(parseInt(el.value))
        );
        setSelectOptions(() => removedData);
      }
    }

    if ( options?.length > 0 && from === "createProgram") {
      const data = options?.map((a) => {
        return {
          label: type==="subcontractor"?a?.node?.company_name:a?.node?.name,
          value: a?.node?.id,
        };
      });
      setSelectOptions(data);
      if (optionsToRemove && optionsToRemove.length > 0) {
        let removedData = data.filter(
          (el) => !optionsToRemove.includes(parseInt(el.value))
        );
        setSelectOptions(() => removedData);
      }
    }

    if(options?.edges?.length === 0) {
      setSelectOptions([])
    }
  
     // eslint-disable-next-line
  }, [optionsToRemove, options]);

  const customStyles = {
    input: (provided, state) => ({
      ...provided,
      "& input:focus": {
        boxShadow: "none",
      },
    }),
    menuPortal: (provided) => ({
      ...provided,
      zIndex: 9999,
    }),
    option: (provided, state) => ({
      ...provided,
    }),
    singleValue: (provided, state) => ({
      ...provided,
      color:'#163c6b'
    }),
    control: (provided, state) => ({
      ...provided,
      minHeight: 42,
      borderRadius: "0.5rem",
      border: state.isFocused? error? "2px solid #b13626": "2px solid #163c6b": error? "1px solid #b13626": "1px solid rgba(212, 212, 216,1)",
      fontSize: "0.875rem",
      "&:hover": {
        
      },
      // This line disable the blue border
      boxShadow: "none",
    }),
  };

  function customTheme(theme) {
    return {
      ...theme,
      colors: {
        ...theme.colors,
        primary25: "rgba(22, 60, 107, 0.1)",
        primary: "#163c6b",
      },
    };
  }

  return (
    <div className={className}>
      {creatable?
      <CreatableSelect
      isClearable
      menuPlacement={menuPlacement}
      theme={customTheme}
      styles={{ ...customStyles, ...styles }}
      components={makeAnimated()}
      options={selectOptions && selectOptions.length !== 0 ? selectOptions : []}
      name={name}
      value={clean?null:value}
      onChange={onChange}
      menuPortalTarget={document.body}
      className={className}
      placeholder={placeHolder}
      noOptionsMessage={noOptionsMessage?() => noOptionsMessage:() => "No Builders Found"}
      isMulti={isMulti}
      isDisabled={disabled}
      isSearchable
      minMenuHeight="200px"
    />
      :
      <Select
      menuPlacement={menuPlacement}
      theme={customTheme}
      styles={{ ...customStyles, ...styles }}
      components={makeAnimated()}
      options={
        selectOptions && selectOptions.length !== 0 ? selectOptions : []
      }
      name={name}
      value={clean?null:value}
      onChange={onChange}
      menuPortalTarget={document.body}
      className={className}
      placeholder={placeHolder}
      noOptionsMessage={noOptionsMessage?() => noOptionsMessage:() => "No Builders Found"}
      isMulti={isMulti}
      isDisabled={disabled}
      isSearchable
      minMenuHeight="200px"
    />
    }
      
    </div>
  );
};

export default CommonSelect;
