
import React from 'react';

function CoreLists({
    values = '',
    backgroundColor,
    anchor = '',
    className,
    textColor,
    style
}) {

    // let lists = values.split('</li>');

    // lists.forEach(
    //     (item, i) =>
    //         (lists[i] = ordered
    //             ? '<span class="text-purple mt-0 mr-5 inline-block">' +
    //               (i + 1) +
    //               '</span><div class="opacity-70"> ' +
    //               lists[i].replace('<li>', '') +
    //               '</div>'
    //             : '<i class="inline-block w-3 min-w-[0.75rem] h-3 mr-5 border-2 rounded-10 border-purple mt-2"></i><div class="opacity-70">' +
    //               lists[i].replace('<li>', '') +
    //               '</div>')
    // );

    // lists.pop();

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
            className={`${className ? className : ''} mb-6`}
            id={anchor}
            style={{
                backgroundColor: backgroundColor ? backgroundColor : ''
            }}
        >
            <div className="container editor wow fadeInUp">
                <ul
                    dangerouslySetInnerHTML={{ __html: values }}
                    className="lead lead--large text-purple-midnight text-opacity-70 lists"
                />
                {/* <ul
                    className="lead lead--large text-purple-midnight "
                    style={{
                        textAlign: align ? align : 'inherit'
                    }}
                >
                    {lists &&
                        lists.map((item, i) => (
                            <li
                                key={i}
                                className="flex items-start mb-5"
                                style={
                                    textColor
                                        ? {
                                              color: textColor
                                          }
                                        : {}
                                }
                                dangerouslySetInnerHTML={{
                                    __html: item
                                }}
                            />
                        ))}
                </ul> */}
            </div>
        </div>
    );
}

export default CoreLists;
