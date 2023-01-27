import React from 'react';

function CoreGroup({ children, className }) {
    return (
        <div className={className}>
            {children}
        </div>
    );
}

export default CoreGroup;
