import React, { useState } from 'react'
import toast, { Toaster } from 'react-hot-toast';
import Spinner from './Spinner';

const RequestList = ({ data, fetchTicket }) => {
    const [processing, setProcessing] = useState(false)
    const sendTicket = async (email) => {
        setProcessing(true);
        const response = await fetch('/api/sendticket', {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({ email: email, adminPin: process.env.NEXT_PUBLIC_ADMIN_PIN })
        })
        const json = await response.json();
        setProcessing(false);
        if (json.success) {
            toast.success(json.msg);
        } else {
            toast.error(json.msg)
        }
        fetchTicket();
    }
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };
    return (
        <>
            <Toaster position='top-right' />
            <li className="p-4 border-b border-gray-300 w-full">
                <div className="w-full flex justify-between">
                    <div className="flex flex-col items-start">
                        <h2 className="text-sm font-semibold">
                            {data.name}
                        </h2>
                        <h3 className="text-sm">
                            {data.email}
                        </h3>
                    </div>
                    <div className="flex gap-1 items-center justify-center">
                        <img onClick={openModal} className='w-10 cursor-pointer rounded aspect-square' src={data.screenshot?data.screenshot:''} alt="Payment screenshot" />
                        {
                            !processing &&
                            <button onClick={() => { sendTicket(data.email) }} className="text-sm h-full bg-green-500 text-white px-2 py-1 rounded">Send</button>
                        }
                        {
                            processing &&
                            <Spinner />
                        }
                    </div>
                </div>
            </li>
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="fixed inset-0 bg-black bg-opacity-75 z-10 flex items-center justify-center">
                        <div className="bg-white p-4 rounded-lg max-w-screen-lg w-full">
                            <div className="relative">
                                <button
                                    className="absolute top-2 right-2 text-gray-700 hover:text-gray-900"
                                    onClick={closeModal}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                    </svg>
                                </button>
                                <img src={data.screenshot?data.screenshot:''} alt="Payment Screenshot Image" />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default RequestList