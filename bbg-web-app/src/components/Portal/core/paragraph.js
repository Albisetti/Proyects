import React from 'react';

function CoreParagraph({
    content,
    className = '',
    anchor = '',
    textColor,
    backgroundColor,
    style
}) {
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


    
// function getWordStr(str) {
//     return str.split(/\s+/).slice(0,40).join(" ");
// }



// function getExtraContent(str) {
//     let count = str.split(/\s+/);
//     return count?.length > 40 ? "...Read More": ""
// }

    return (
        <div
            style={
                backgroundColor
                    ? {
                          backgroundColor: backgroundColor
                      }
                    : {}
            }
        >
            <div className="container wow fadeInUp" id={anchor}>
                <p
                    style={
                        textColor
                            ? {
                                  color: textColor
                              }
                            : {}
                    }
                    className={`lead lead--large opacity-70  mb-6 ${className}`}
                    dangerouslySetInnerHTML={{ __html: content }}
                />
            </div>
        </div>
    );
}

export default CoreParagraph;
