import React from 'react';

function CoreHtml({ pageProps, content }) {
    return (
        <>
            <div className="container mb-6 editor wow fadeInUp">
                <div dangerouslySetInnerHTML={{ __html: content }} />
            </div>
        </>
    );
}

export default CoreHtml;
