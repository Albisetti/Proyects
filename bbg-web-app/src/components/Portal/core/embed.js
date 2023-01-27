import React from "react";

function CoreEmbed({ url, type, anchor = "", className = "" }) {
    return (
        <>
            <div className={`container  wow fadeInUp ${className}`} id={anchor}>
                {url && (
                    <iframe
                        width="640px"
                        height="480px"
                        src={url}
                        title="YouTube video player"
                        frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowfullscreen="allowfullscreen"
                        mozallowfullscreen="mozallowfullscreen"
                        msallowfullscreen="msallowfullscreen"
                        oallowfullscreen="oallowfullscreen"
                        webkitallowfullscreen="webkitallowfullscreen"
                    ></iframe>
                )}
            </div>
        </>
    );
}

export default CoreEmbed;
