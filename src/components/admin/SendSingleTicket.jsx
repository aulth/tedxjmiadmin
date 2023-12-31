import React, { useState } from 'react'
import Login from './Login';
import toast, { Toaster } from 'react-hot-toast';

import SendTicket from './SendTicket'
import Spinner from '../Spinner';
const SendSingleTicket = () => {
  const [login, setLogin] = useState(false);
  const [data, setData] = useState({ email: "" });
  const [processing, setProcessing] = useState(false)
  const handleOnSend = async (e) => {
    e.preventDefault();
    setProcessing(true)
    const response = await fetch('/api/sendticket', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({ email: data.email, adminPin: process.env.NEXT_PUBLIC_ADMIN_PIN })
    })
    const json = await response.json();
    setProcessing(false);
    if (json.success) {
      toast.success(json.msg);
    } else {
      toast.error(json.msg)
    }
    setData({ email: "" })
  }
  const handleOnChange = (e) => {
    e.preventDefault();
    setData({ ...data, [e.target.name]: e.target.value })

  }
  return (
    <>
      <Toaster position='top-right' />
      {
        login &&
        <>
          <div className="container mx-auto h-[calc(100vh-36.67px)] p-4 flex justify-center ">
            <div className="w-full  rounded-lg shadow  md:mt-0 sm:max-w-md xl:p-0 ">
              <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                <h1 className="text-xl font-bold leading-tight text-center tracking-tight text-gray-900 md:text-2xl">
                  Send pass to email
                </h1>
                <form onSubmit={handleOnSend} className="space-y-4 md:space-y-6" action="#">
                  <div>
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Email Id</label>
                    <input value={data.email} onChange={handleOnChange} type="email" name="email" id="email" placeholder="Email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" required />
                  </div>
                  {
                    !processing &&
                    <button type="submit" className="w-full text-white bg-red-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ">Send</button>
                  }
                  {
                    processing &&
                    <div className="w-full flex justify-center items-center p-2">
                      <Spinner />
                    </div>
                  }
                </form>
              </div>
            </div>

          </div>
        </>
      }
      {
        !login &&
        <Login login={login} setLogin={setLogin} />
      }
    </>
  )
}

export default SendSingleTicket