import React, {useState} from 'react'
import Login from './Login';
import QrScanner from './QrScanner';
const Home = () => {
const [login, setLogin] = useState(false);
  return (
   <>
   {
    login &&
    <QrScanner/>
   }
   {
    !login &&
    <Login login={login} setLogin={setLogin}/>
   }
   </>
  )
}

export default Home