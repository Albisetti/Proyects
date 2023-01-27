import React from 'react';

function CoreQuote({
    pageProps,
    value,
    anchor = '',
    className = '',
    citation
}) {
    return (
        <>
            <div
                className={`container mb-6 editor wow fadeInUp ${className}`}
                id={anchor}
            >
                <div className="pt-4 mb-4 h1 text-purple leading-28">“</div>
                {value && (
                    <h4
                        className="mb-6 md:h4 h3"
                        dangerouslySetInnerHTML={{ __html: value }}
                    />
                )}
                {citation && (
                    <div
                        className="font-medium lead opacity-70"
                        dangerouslySetInnerHTML={{ __html: citation }}
                    />
                )}
            </div>
        </>
    );
}

export default CoreQuote;
