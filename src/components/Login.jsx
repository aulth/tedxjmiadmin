import React, {useState} from 'react'

const Login = ({login, setLogin}) => {
    const [pin, setPin] = useState("");
    const [wrongPass, setWrongPass] = useState(false)
    const handleOnChange = (e)=>{
        e.preventDefault();
        setPin(e.target.value);
    }
    const handleLogin = (e)=>{
        e.preventDefault();
        if(process.env.NEXT_PUBLIC_ADMIN_PIN==pin){
            console.log('logged in')
            setLogin(true);
            setWrongPass(false)
            return;
        }
        setWrongPass(true)
        setLogin(false)
    }
    return (
        <>
            <section className="bg-gray-50 h-screen dark:bg-gray-900">
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                    <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                        <img className="w-32" src="https://www.tedxjmi.org/res/images/logos/light.png" alt="logo" />
                    </a>
                    <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 className="text-xl font-bold leading-tight text-center tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                Admin Sign in
                            </h1>
                            <form onSubmit={handleLogin} className="space-y-4 md:space-y-6" action="#">
                                <div>
                                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password {wrongPass&&<span className='text-sm text-red-500'>Wrong password</span>}</label>
                                    <input onChange={handleOnChange} type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                                </div>
                                <button type="submit" className="w-full text-white bg-red-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Sign in</button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

        </>
    )
}

export default Login