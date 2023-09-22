import React, { useState, useEffect } from 'react'
import Login from './Login';
import RequestList from './RequestList';
import toast, { Toaster } from 'react-hot-toast';
import Spinner from '../Spinner';

const Requests = () => {
  const [login, setLogin] = useState(false);
  const [tickets, setTickets] = useState();
  const [responses, setResponses] = useState([]);
  const [sendingAll, setSendingAll] = useState(false)
  const [counter, setCounter] = useState(0);
  const fetchTicket = async () => {
    const response = await fetch('/api/getallrequest', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({ adminPin: process.env.NEXT_PUBLIC_ADMIN_PIN })
    });
    const json = await response.json();
    setTickets(json.tickets)
  }
  useEffect(() => {
    fetchTicket();
  }, [])
  const sendAll = async (data) => {
    setSendingAll(true)
    for (let i = 0; i < data.length; i++) {
      const response = await fetch('/api/sendticket', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({ email: data[i].email, adminPin: process.env.NEXT_PUBLIC_ADMIN_PIN })
      })
      const json = await response.json();
      setResponses(prev => [...prev, json]);
      setCounter(prev=>prev+1)
      if (json.success) {
        toast.success(json.msg);
      } else {
        toast.error(json.msg)
      }
    }
    setSendingAll(false);
    fetchTicket()
  }
  return (
    <>
      {
        login &&
        <>
          <div className="container mx-auto p-4">
            <div className="w-full flex justify-center items-center flex-col">
              <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                <img className="w-32" src="https://www.tedxjmi.org/res/images/logos/light.png" alt="logo" />
              </a>
              <h2 className="text-center font-bold">Pass Request - <span className='text-red-500'>{tickets && tickets.length}</span></h2>
              {
                counter>0 &&
                <h2 className="text-center font-bold">Passes Sent - <span className='text-red-500'>{counter}</span></h2>
              }
              {
                !sendingAll &&
                <button onClick={() => { sendAll(tickets) }} className="px-4 py-2 bg-green-500 rounded text-white my-4">Send All</button>
              }
              {
                sendingAll && 
                <div className="container mx-auto flex justify-center items-center">
                  <Spinner/>
                </div>
              }
            </div>
            {
              !sendingAll &&
              <ul className="grid container mx-auto grid-cols-1 sm:grid-cols-2 gap-4 my-2">
                {
                  tickets && tickets.length > 0 &&
                  tickets.map((data, index) => {
                    return <RequestList fetchTicket={fetchTicket} data={data} key={index} />
                  })
                }
              </ul>
            }
            {
              sendingAll &&
              <ul className="grid container mx-auto grid-cols-1 sm:grid-cols-2 gap-4 my-2">

                {
                  responses && responses.length > 0 &&
                  responses.map((data, index) => {
                    return <li key={index} className="p-4 border-b border-gray-300 w-full">
                      <div className="w-full flex justify-between">
                        <div className="flex flex-col items-start">
                          <h2 className="text-sm font-semibold">
                            {data?.data?.name}
                          </h2>
                          <h3 className="text-sm">
                            {data?.data?.email}
                          </h3>
                        </div>
                        <h4 className={`text-sm ${data.success ? 'text-green-500' : 'text-red-500'} font-semibold`}>{data.msg ? data.msg : ""}</h4>
                      </div>
                    </li>
                  })
                }
              </ul>
            }
            <Toaster position='top-right' />
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

export default Requests