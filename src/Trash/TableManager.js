import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

function TableManager() {

    const [showmodal, setShowModal] = useState(false)

    return (
        <div className='p-10 h-screen overflow-hidden'>
            <div className='bg-blue-700 relative h-full rounded-xl flex flex-col  p-10'>
                <div className=' text-white'>
                    <div className='text-3xl text-white uppercase font-kanit'>Table Availability</div>
                    <div className='mt-5 text-white'>Available Tables: 8</div>
                </div>
                <div className='mt-3  grid grid-cols-5 text-white gap-5'>
                    <div onClick={() => setShowModal(true)} className='bg-blue-500 hover:scale-105 duration-500 cursor-pointer transition-all hover:bg-blue-600 hover:shadow-xl  flex justify-center items-center flex-col p-10 rounded-xl shadow-md'>
                        <div className='text-4xl font-kanit'>R01</div>
                        <div>Occupied: 0 out of 6</div>
                    </div>

                    <div className='bg-orange-500 hover:scale-105 duration-500 cursor-pointer transition-all hover:bg-orange-600 hover:shadow-xl  flex justify-center items-center flex-col p-10 rounded-xl shadow-md'>
                        <div className='text-4xl font-kanit'>R02</div>
                        <div>Occupied: 3 out of 6</div>
                    </div>

                    <div className='bg-red-500 hover:scale-105 duration-500 cursor-pointer transition-all hover:bg-red-600 hover:shadow-xl  flex justify-center items-center flex-col p-10 rounded-xl shadow-md'>
                        <div className='text-4xl font-kanit'>R03</div>
                        <div>Occupied: 6 out of 6</div>
                    </div>

                    <div className='bg-blue-500 hover:scale-105 duration-500 cursor-pointer transition-all hover:bg-blue-600 hover:shadow-xl  flex justify-center items-center flex-col p-10 rounded-xl shadow-md'>
                        <div className='text-4xl font-kanit'>R04</div>
                        <div>Occupied: 0 out of 6</div>
                    </div>

                    <div className='bg-blue-500 hover:scale-105 duration-500 cursor-pointer transition-all hover:bg-blue-600 hover:shadow-xl  flex justify-center items-center flex-col p-10 rounded-xl shadow-md'>
                        <div className='text-4xl font-kanit'>R05</div>
                        <div>Occupied: 0 out of 6</div>
                    </div>

                    <div className='bg-orange-500 hover:scale-105 duration-500 cursor-pointer transition-all hover:bg-orange-600 hover:shadow-xl  flex justify-center items-center flex-col p-10 rounded-xl shadow-md'>
                        <div className='text-4xl font-kanit'>R06</div>
                        <div>Occupied: 1 out of 6</div>
                    </div>
                </div>

                <AnimatePresence>
                    {showmodal && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5, type: 'spring' }}
                        >
                            <div className='absolute top-0 left-0 w-full justify-center items-center h-full rounded-xl overflow-hidden flex z-10'>
                                <div onClick={() => setShowModal(false)} className='w-full flex h-full absolute  bg-[#000000ad] z-10'></div>
                                <div className='bg-white flex flex-col rounded-md p-6 relative z-20'>
                                    <div className='flex border-b-2 flex-col justify-center items-center content-center'>
                                        <div className='text-5xl font-kanit mb-1'>RO1</div>
                                        <div className='flex'>
                                            <div className='text-xl pb-2 px-16'>Available Students</div>
                                            <div className='text-xl pb-2 px-16'>Seated Students</div>


                                        </div>

                                    </div>

                                    <div className='flex gap-5 '>

                                        <div className='flex flex-col w-full'>

                                            <div className='mt-2 flex justify-center text-center w-full'>
                                                <div className='py-3 w-full bg-green-600 text-white text-lg rounded-xl shadow-md cursor-pointer hover:scale-105 transition-all'> Aries Jordan</div>
                                            </div>

                                            <div className='mt-2 flex justify-center text-center w-full'>
                                                <div className='py-3 w-full bg-green-600 text-white text-lg rounded-xl shadow-md cursor-pointer hover:scale-105 transition-all'> Harvey Pilom</div>
                                            </div>

                                        </div>

                                        <div className='flex w-full'>

                                            <div></div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </motion.div>
                    )}

                </AnimatePresence>


            </div>
        </div>
    )
}

export default TableManager