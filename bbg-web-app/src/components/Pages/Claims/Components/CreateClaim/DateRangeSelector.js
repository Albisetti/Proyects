import React, { useState, useEffect } from "react";
import Helmet from "react-helmet";

import DayPickerInput from "react-day-picker/DayPickerInput";
import "react-day-picker/lib/style.css";

import { formatDate, parseDate } from "react-day-picker";

const DateRangeSelector = (props) => {
    const [state, setState] = useState({});

    useEffect(() => {
        if (props?.value !== undefined) {
            setState(props?.value);
        }
    }, [props]);

    const CustomOverlay = ({ classNames, selectedDay, children, ...props }) => {
        return (
            <div
                className={classNames.overlayWrapper}
                style={{ marginBottom: 300 }}
                {...props}
            >
                <div className={classNames.overlay}>{children}</div>
            </div>
        );
    };

    const { from, to } = state;
    const modifiers = { start: from, end: to };


    return (
        <div className="InputFromTo">
            <DayPickerInput
                value={state?.from}
                placeholder="From"
                format="LL"
                formatDate={formatDate}
                parseDate={parseDate}
                overlayComponent={CustomOverlay}
                inputProps={{
                    style: {
                        border: props?.errors?.startDate
                            ? "1px solid #b13626"
                            : "1px solid rgba(212, 212, 216,1)",
                        borderRadius: "0.375rem",
                        padding: "0.5rem 0.75rem",
                        width: "130px",
                        fontSize: ".875rem",
                        cursor: "pointer",
                    },
                }}
                dayPickerProps={{
                    disabledDays: { before: props?.disableDays, after: to },
                    selectedDays: [from, { from, to }],
                    toMonth: to,
                    modifiers,
                    numberOfMonths: 2,
                }}
                onDayChange={(date) => props?.setFrom(date)}
            />{" "}
            —{" "}
            <span className="InputFromTo-to">
                <DayPickerInput
                    ref={to}
                    value={to}
                    placeholder="To"
                    format="LL"
                    overlayComponent={CustomOverlay}
                    inputProps={{
                        style: {
                            border: props?.errors?.startDate
                                ? "1px solid #b13626"
                                : "1px solid rgba(212, 212, 216,1)",
                            borderRadius: "0.375rem",
                            padding: "0.5rem 0.75rem",
                            width: "130px",
                            fontSize: ".875rem",
                            cursor: "pointer",
                        },
                    }}
                    formatDate={formatDate}
                    parseDate={parseDate}
                    dayPickerProps={{
                        selectedDays: [from, { from, to }],
                        disabledDays: { before: from },
                        modifiers,
                        month: from,
                        fromMonth: from,
                        numberOfMonths: 2,
                    }}
                    onDayChange={(date) => props.setTo(date)}
                />
            </span>
            <Helmet>
                <style>{`
  .InputFromTo .DayPicker-Day--selected:not(.DayPicker-Day--start):not(.DayPicker-Day--end):not(.DayPicker-Day--outside) {
    background-color: #f0f8ff !important;
    color: #4a90e2;
  }
  .InputFromTo .DayPicker-Day {
    border-radius: 0 !important;
  }
  .InputFromTo .DayPicker-Day--start {
    border-top-left-radius: 50% !important;
    border-bottom-left-radius: 50% !important;
  }
  .InputFromTo .DayPicker-Day--end {
    border-top-right-radius: 50% !important;
    border-bottom-right-radius: 50% !important;
  }
  .InputFromTo .DayPickerInput-Overlay {
    width: 550px;
  }
  .InputFromTo-to .DayPickerInput-Overlay {
    margin-left: -198px;
  }
`}</style>
            </Helmet>
        </div>
    );
};

export default DateRangeSelector;
