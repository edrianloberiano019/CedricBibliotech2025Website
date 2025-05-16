import React, { useState } from 'react'
import { motion } from 'framer-motion'

function BookManager() {
    const [tab, setTab] = useState("Use")
    return (
        <div className='p-10 h-screen overflow-hidden'>
            <div className='w-full flex-col p-10 rounded-xl h-full flex bg-blue-700'>
                <div className='mb-10'>


                    <div className='text-white text-3xl font-kanit uppercase'>Book Manager</div>

                </div>
                <div>
                    <div className='flex   items-center justify-between'>

                        <div className='flex '>
                            <input className='px-5 py-2 rounded-l-full' type='text' placeholder='Search' />
                            <div className='cursor-pointer pr-4 pl-3 rounded-r-full py-1 flex bg-green-500 overflow-hidden hover:bg-green-600 transition-all  '>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-8 text-white hover:scale-110 ease-out transition-all">
                                    <path d="M8.25 10.875a2.625 2.625 0 1 1 5.25 0 2.625 2.625 0 0 1-5.25 0Z" />
                                    <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.125 4.5a4.125 4.125 0 1 0 2.338 7.524l2.007 2.006a.75.75 0 1 0 1.06-1.06l-2.006-2.007a4.125 4.125 0 0 0-3.399-6.463Z" clip-rule="evenodd" />
                                </svg>

                            </div>

                        </div>

                        <div className='flex items-center bg-blue-400 shadow-md overflow-hidden rounded-full h-10 px-2'>

                            <motion.div className={`' ${tab === "Use" ? 'w-28' : 'w-32'} h-10 absolute right-16  bg-white shadow-lg rounded-full  '`}
                                initial={{ x: tab === "Active" ? 0 : -15 }}
                                animate={{ x: tab === "Active" ? -125 : -15 }}
                                transition={{ type: "spring", stiffness: 300 }}

                            />

                            <div className='relative z-20 gap-8 text-xl  text-black flex justify-center text-center font-semibold items-center content-center h-full'>
                                <div onClick={() => setTab("Active")} className={`cursor-pointer px-3 ${tab === "Active" ? "text-black transition-all ease-in" : "text-blue-600 transition-all duration-500 ease-out"}`}>Returned</div>
                                <div onClick={() => setTab("Use")} className={`cursor-pointer px-3 ${tab === "Active" ? "text-blue-600 transition-all duration-500 ease-out" : "text-black transition-all ease-in"} `}>In Use</div>
                            </div>

                        </div>
                    </div>

                    <div className='w-full mt-5 p-10 rounded-md bg-white shadow-md'>
                        <div className='flex justify-between uppercase border-b pb-3 px-5 text-lg'>
                            <div>Student Name</div>
                            
                            <div className='flex gap-10 uppercase'>
                                <div>Book Title</div>
                                <div>Status</div>
                                <div>Time Borrowed</div>
                                <div>Time Returned</div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BookManager