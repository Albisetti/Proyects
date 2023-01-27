import React from 'react';

function CoreFile({
    pageProps,
    fileName,
    href = '',
    downloadButtonText,
    anchor = '',
    className = ''
}) {
    return (
        <>
            <div
                className={`container mb-6 editor wow fadeInUp ${className}`}
                id={anchor}
            >
                <div className="items-center md:flex">
                    {fileName && <p className="lead lead--large">{fileName}</p>}
                    {downloadButtonText && (
                        <a
                            target="_blank"
                            href={href}
                            className="btn btn--primary md:ml-6"
                        >
                            {downloadButtonText}
                        </a>
                    )}
                </div>
            </div>
        </>
    );
}

export default CoreFile;
