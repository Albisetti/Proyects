import React from "react";
import PropTypes from "prop-types";

/**
 * This component changes the normal input type to one that supports decimal places, the type *MUST BE* text
 *
 * You can send the prop onChangeParent which adds more functionality to the onChange of the component
 *
 * You can send the prop wholeNumbers to define up to how many whole numbers the input will accept
 *
 * You can send the prop decimals to define up to how many decimals the input will accept
 */
export class InputDecimal extends React.Component {
    static propTypes = {
        /** The whole numbers the input will have */
        wholeNumbers: PropTypes.number,
        /** The decimal places the input will have */
        decimals: PropTypes.number,
    };

    static defaultProps = {
        wholeNumbers: 16,
        decimals: 2,
    };

    constructor(prop) {
        super(prop);
        this.state = { input: "" };
        this.start = 0;
    }

    change = (e) => {
        this.start = e.target.selectionStart;
        let val = e.target.value;
        val = val.replace(/([^0-9.]+)/, "");
        const match = new RegExp(
            `(\\d{0,${this?.props?.wholeNumbers}})[^.]*((?:\\.\\d{0,${this.props.decimals}})?)`
        ).exec(val);
        const value = match[1] + match[2];
        e.target.value = value;
        this.setState({ input: value });
        if (val.length > 0) {
            e.target.value = Number(value).toFixed(this.props.decimals);
            e.target.setSelectionRange(this.start, this.start);
            this.setState({ input: Number(value).toFixed(this.props.decimals) });
        }
        if (this.props.onChangeFunction) this.props.onChangeFunction(e);
    };

    render() {
        return (
            <div>
                <input type="text" onBlur={this.blur} onChange={this.change} {...this.props} />
            </div>
        );
    }
}
