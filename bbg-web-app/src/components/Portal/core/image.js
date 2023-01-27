import React from 'react';


function CoreImage({
    width,
    height,
    className = '',
    url,
    anchor = '',
    caption,
    alt
}) {
    if (!width || !height) {
        return (
            <div className={`${className}`}>
                <img
                    src={url}
                    className={`my-6  wow fadeInUp inline-block`}
                    id={anchor}
                    alt={alt}
                />
                {caption && (
                    <div
                        className="text-12"
                        dangerouslySetInnerHTML={{ __html: caption }}
                    />
                )}
            </div>
        );
    }

    return (
        <div className={`${className} `}>
            <img
                src={url}
                width={width}
                height={height}
                id={anchor}
                className={` my-6 wow fadeInUp inline-block`}
                alt={alt}
            />
            {caption && (
                <div
                    className="text-12"
                    dangerouslySetInnerHTML={{ __html: caption }}
                />
            )}
        </div>
    );
}

export default CoreImage;
