import React from 'react'
import triangleSpinner from "../Images/triangleSpinner.svg"

const Loader = ({width,height,className}) => {
    return (
        <div className={`h-full flex justify-center items-center ${className}` }>
            <img src={triangleSpinner} alt="Loading..." width={width} height={height} />
        </div>
    )
}

export default Loader
