import React, {useState} from 'react'
import Login from './Login';
import SendTicket from './SendTicket'
const Ticket = () => {
const [login, setLogin] = useState(false);
  return (
   <>
   {
    login &&
    <SendTicket/>
   }
   {
    !login &&
    <Login login={login} setLogin={setLogin}/>
   }
   </>
  )
}

export default Ticket