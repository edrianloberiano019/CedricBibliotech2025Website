import React from 'react'

function ComputerManager() {
    return (
        <div className='p-10 h-screen overflow-hidden'>
            <div className='bg-blue-700 h-full rounded-xl flex flex-col  p-10'>
                <div className=' text-white'>
                    <div className='text-3xl text-white uppercase font-kanit'>computer availability</div>
                    <div className='mt-5 text-white'>Available Computer: 8</div>
                </div>
                <div className='mt-3  grid grid-cols-8    text-white gap-5'>
                    <div className='bg-green-500 hover:scale-105 duration-500 cursor-pointer transition-all hover:bg-green-600 hover:shadow-xl  flex justify-center items-center flex-col p-8 rounded-xl shadow-md'>
                        <div className='text-4xl font-kanit'>C01</div>
                    </div>
                    
                    <div className='bg-green-500 hover:scale-105 duration-500 cursor-pointer transition-all hover:bg-green-600 hover:shadow-xl  flex justify-center items-center flex-col p-8 rounded-xl shadow-md'>
                        <div className='text-4xl font-kanit'>C02</div>
                    </div>

                    <div className='bg-green-500 hover:scale-105 duration-500 cursor-pointer transition-all hover:bg-green-600 hover:shadow-xl  flex justify-center items-center flex-col p-8 rounded-xl shadow-md'>
                        <div className='text-4xl font-kanit'>C03</div>
                    </div>

                    <div className='bg-green-500 hover:scale-105 duration-500 cursor-pointer transition-all hover:bg-green-600 hover:shadow-xl  flex justify-center items-center flex-col p-8 rounded-xl shadow-md'>
                        <div className='text-4xl font-kanit'>C04</div>
                    </div>

                    <div className='bg-green-500 hover:scale-105 duration-500 cursor-pointer transition-all hover:bg-green-600 hover:shadow-xl  flex justify-center items-center flex-col p-8 rounded-xl shadow-md'>
                        <div className='text-4xl font-kanit'>C05</div>
                    </div>

                    <div className='bg-red-500 hover:scale-105 duration-500 cursor-pointer transition-all hover:bg-red-600 hover:shadow-xl  flex justify-center items-center flex-col p-8 rounded-xl shadow-md'>
                        <div className='text-4xl font-kanit'>C06</div>
                    </div>

                    <div className='bg-green-500 hover:scale-105 duration-500 cursor-pointer transition-all hover:bg-green-600 hover:shadow-xl  flex justify-center items-center flex-col p-8 rounded-xl shadow-md'>
                        <div className='text-4xl font-kanit'>C07</div>
                    </div>

                    <div className='bg-green-500 hover:scale-105 duration-500 cursor-pointer transition-all hover:bg-green-600 hover:shadow-xl  flex justify-center items-center flex-col p-8 rounded-xl shadow-md'>
                        <div className='text-4xl font-kanit'>C08</div>
                    </div>

                    <div className='bg-green-500 hover:scale-105 duration-500 cursor-pointer transition-all hover:bg-green-600 hover:shadow-xl  flex justify-center items-center flex-col p-8 rounded-xl shadow-md'>
                        <div className='text-4xl font-kanit'>C09</div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default ComputerManager