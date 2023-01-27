import React from 'react';

function CoreColumns({ children, className }) {
    return (
        <div className={`${className} grid grid-cols-${children.length}`}>
            {children}
        </div>
    );
}

export default CoreColumns;
