import React from 'react';
const HEADING_TAG_NAME_TO_JSX = {
    1: ({ children, style, className }) => (
        <h1 className={className} style={style}>
            {children}
        </h1>
    ),
    2: ({ children, style, className }) => (
        <h2 className={className} style={style}>
            {children}
        </h2>
    ),
    3: ({ children, style, className }) => (
        <h3 className={className} style={style}>
            {children}
        </h3>
    ),
    4: ({ children, style, className }) => (
        <h4 className={className} style={style}>
            {children}
        </h4>
    ),
    5: ({ children, style, className }) => (
        <h5 className={className} style={style}>
            {children}
        </h5>
    ),
};
function CoreHeading({
    align,
    content,
    backgroundColor,
    anchor,
    className,
    textColor,
    style,
    level,
    textAlign = ''
}) {
    const HeadingComponent =
        HEADING_TAG_NAME_TO_JSX[level] || (({ text }) => <div>{text}</div>);

    if (backgroundColor === 'cyan-bluish-gray') {
        backgroundColor = '#abb8c3';
    } else if (backgroundColor === 'pale-pink') {
        backgroundColor = '#f78da7';
    } else if (backgroundColor === 'vivid-red') {
        backgroundColor = '#cf2e2e';
    } else if (backgroundColor === 'luminous-vivid-orange') {
        backgroundColor = '#ff6900';
    } else if (backgroundColor === 'luminous-vivid-amber') {
        backgroundColor = '#fcb900';
    } else if (backgroundColor === 'light-green-cyan') {
        backgroundColor = '#7bdcb5';
    } else if (backgroundColor === 'vivid-green-cyan') {
        backgroundColor = '#00d084';
    } else if (backgroundColor === 'pale-cyan-blue') {
        backgroundColor = '#8ed1fc';
    } else if (backgroundColor === 'vivid-cyan-blue') {
        backgroundColor = '#0693e3';
    } else if (backgroundColor === 'vivid-purple') {
        backgroundColor = '#9b51e0';
    }

    if (textColor === 'cyan-bluish-gray') {
        textColor = '#abb8c3';
    } else if (textColor === 'pale-pink') {
        textColor = '#f78da7';
    } else if (textColor === 'vivid-red') {
        textColor = '#cf2e2e';
    } else if (textColor === 'luminous-vivid-orange') {
        textColor = '#ff6900';
    } else if (textColor === 'luminous-vivid-amber') {
        textColor = '#fcb900';
    } else if (textColor === 'light-green-cyan') {
        textColor = '#7bdcb5';
    } else if (textColor === 'vivid-green-cyan') {
        textColor = '#00d084';
    } else if (textColor === 'pale-cyan-blue') {
        textColor = '#8ed1fc';
    } else if (textColor === 'vivid-cyan-blue') {
        textColor = '#0693e3';
    } else if (textColor === 'vivid-purple') {
        textColor = '#9b51e0';
    }
    if (style?.color?.text) {
        textColor = style?.color?.text;
    }
    if (style?.color?.background) {
        backgroundColor = style?.color?.background;
    }

    return (
        <div
            className={`${
                className ? className : 'md:mb-6 mb-4'
            }  wow fadeInUp `}
            id={anchor ? anchor : ''}
            style={{
                backgroundColor: backgroundColor ? backgroundColor : 'inherit',
                color: textColor ? textColor : 'inherit'
            }}
        >
            <div className="container">
                <HeadingComponent
                    className={``}
                    style={{
                        textAlign: textAlign ? textAlign : 'inherit',
                        color: textColor ? textColor : 'inherit'
                    }}
                >
                    <text dangerouslySetInnerHTML={{ __html: content }} />
                </HeadingComponent>
            </div>
        </div>
    );
}

export default CoreHeading;
