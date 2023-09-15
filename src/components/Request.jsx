import React, { useState, useEffect } from 'react'
import Login from './Login';
import RequestList from './RequestList';

const Request = () => {
  const [login, setLogin] = useState(false);
  const [tickets, setTickets] = useState();
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
            </div>
            <ul className="grid container mx-auto grid-cols-1 sm:grid-cols-2 gap-4 my-2">
              {
                tickets && tickets.length > 0 &&
                tickets.map((data, index) => {
                  return <RequestList fetchTicket={fetchTicket} data={data} key={index} />
                })
              }
            </ul>
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

export default Request