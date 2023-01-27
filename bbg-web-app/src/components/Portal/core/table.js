import React from 'react';

function CoreTable(props) {
    const {
        className = '',
        anchor = '',
        body,
        foot,
        head,
        caption,
        backgroundColor
    } = props;
    let bg = '';
    if (backgroundColor === 'subtle-light-gray') {
        bg = '#f3f4f5';
    } else if (backgroundColor === 'subtle-pale-green') {
        bg = '#e9fbe5';
    } else if (backgroundColor === 'subtle-pale-blue') {
        bg = '#e7f5fe';
    } else if (backgroundColor === 'subtle-pale-pink') {
        bg = '#fcf0ef';
    }
    let isStriped = className.search('is-style-stripes') > 0 ? true : false;

    return (
        <div
            className={`wow fadeInUp mb-6 ${className ? className : ''} `}
            id={anchor}
        >
            <div className="container">
                <table
                    className="w-full my-2 border table-auto border-gray-15"
                    style={{ backgroundColor: bg }}
                >
                    {head && (
                        <thead
                            className={`bg-gray-dark`}
                            style={{ backgroundColor: bg }}
                        >
                            {head.map((head, i) => (
                                <tr key={i}>
                                    {head.cells.map((cell, i) => (
                                        <th
                                            className="p-2 border border-gray-light"
                                            key={i}
                                            dangerouslySetInnerHTML={{
                                                __html: cell.content
                                            }}
                                        />
                                    ))}
                                </tr>
                            ))}
                        </thead>
                    )}
                    <tbody>
                        {body.map((row, i) => (
                            <tr
                                className={` ${
                                    isStriped && i % 2 !== 0
                                        ? 'bg-gray-19'
                                        : 'bg-white'
                                }`}
                                key={i}
                            >
                                {row.cells.map((cell, i) => (
                                    <td
                                        className={`p-4 px-6`}
                                        key={i}
                                        dangerouslySetInnerHTML={{
                                            __html: cell.content
                                        }}
                                    />
                                ))}
                            </tr>
                        ))}
                    </tbody>
                    {foot && (
                        <tfoot
                            className={`bg-gray-dark`}
                            style={{ backgroundColor: bg }}
                        >
                            {foot.map((foot, i) => (
                                <tr key={i}>
                                    {foot.cells.map((cell, i) => (
                                        <th
                                            className="p-2 border border-gray-light"
                                            key={i}
                                            dangerouslySetInnerHTML={{
                                                __html: cell.content
                                            }}
                                        />
                                    ))}
                                </tr>
                            ))}
                        </tfoot>
                    )}
                    {caption && <caption>{caption}</caption>}
                </table>
            </div>
        </div>
    );
}

export default CoreTable;
