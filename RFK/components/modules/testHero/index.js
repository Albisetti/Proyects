import React from 'react'

const TestHero = ({ data = {} }) => {
    const { title } = data
    console.log("holaaa", title)
    return (
        <div className='flex justify-center mt-50'>
            <h1 className='text-emerald font-almarose font-medium uppercase shadow-md opacity-50 rotate-45 pt-[500px]'>
                {title}
            </h1>
        </div>
    )
}

export default TestHero