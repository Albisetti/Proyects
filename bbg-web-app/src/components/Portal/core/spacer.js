import React from 'react';

function CoreSpacer(props) {
    const { height, className = '', anchor = '' } = props;
    return (
        <>
            <div
                id={anchor}
                className={className}
                style={{ height: `${height}px` }}
            ></div>
        </>
    );
}

export default CoreSpacer;
