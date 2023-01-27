import React from 'react';

function CoreColumn({ children, className }) {
    return (
        <div className={className}>
            {children}
        </div>
    );
}

export default CoreColumn;
