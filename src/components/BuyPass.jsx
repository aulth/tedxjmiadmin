import React, { useState } from 'react'
import toast, { Toaster } from 'react-hot-toast';
import Spinner from './Spinner';

const BuyPass = () => {
    const [screenshotUploading, setScreenshotUploading] = useState(false);
    const [idCardUploading, setIdCardUploading] = useState(false)
    const [data, setData] = useState({ name: "", email: "" });
    const [screenshot, setScreenshot] = useState('');
    const [idCard, setIdCard] = useState('')
    const [buying, setBuying] = useState(false);
    const [jmiStudent, setJmiStudent] = useState(true);
    const uploadScreenshot = async (e) => {
        e.preventDefault();
        if (typeof window !== 'undefined') {
            const files = e.target.files;
            setScreenshotUploading(true);
            let data = new FormData();
            data.append('file', files[0]);
            data.append('upload_preset', 'myspaceitem');
            let response = await fetch(process.env.NEXT_PUBLIC_CLOUDINARY, {
                method: "POST",
                body: data
            })
            let file = await response.json();
            toast.success("Screenshot uploaded");
            setScreenshotUploading(false)
            setScreenshot(file.url)
        }
    }
    const uploadIdCard = async (e) => {
        e.preventDefault();
        if (typeof window !== 'undefined') {
            const files = e.target.files;
            setIdCardUploading(true);
            let data = new FormData();
            data.append('file', files[0]);
            data.append('upload_preset', 'myspaceitem');
            let response = await fetch(process.env.NEXT_PUBLIC_CLOUDINARY, {
                method: "POST",
                body: data
            })
            let file = await response.json();
            toast.success("ID uploaded");
            setIdCardUploading(false)
            setIdCard(file.url)
        }
    }
    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!data.name) {
            return toast.error('Please enter your name');
        }
        if (!data.email) {
            return toast.error('Please enter your email');
        }
        if (!idCard) {
            return toast.error(`Please upload ${jmiStudent ? 'ID card' : 'Aadhar card'}`);
        }
        if (!screenshot) {
            return toast.error('Oh bhai payment?');
        }

        setBuying(true);
        const response = await fetch('/api/buy', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({ name: data.name, email: data.email, screenshot: screenshot, idCard: idCard, adminPin: process.env.NEXT_PUBLIC_ADMIN_PIN })
        })
        const json = await response.json();
        if (json.success) {
            toast.success(json.msg);
        } else {
            toast.error(json.msg);
        }
        setData({ name: "", email: "" })
        setScreenshot('');
        setBuying(false);
    }
    return (
        <>
            <Toaster position='top-right' />
            <header className='w-screen border-b p-4'>
                <div className="container mx-auto">
                    <a href="#" className="flex items-center text-2xl font-semibold text-gray-900 dark:text-white">
                        <img className="w-36" src="https://www.tedxjmi.org/res/images/logos/light.png" alt="logo" />
                    </a>
                </div>
            </header>
            <h2 className="text-xl font-bold text-center mt-4">
                Buy <span className='text-red-500'>TEDx</span>JMI Pass
            </h2>
            <div className="container flex justify-center items-center p-4 mx-auto">
                <form onSubmit={handleSubmit} className="space-y-4 w-full md:w-[450px] md:space-y-6 border p-4 rounded" action="#">
                    <div>
                        <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                        <input type="text" value={data.name} onChange={handleChange} name="name" id="name" placeholder="Mohd Usman" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                    </div>
                    <div>
                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                        <input type="email" value={data.email} onChange={handleChange} name="email" id="email" placeholder="mohdusman.you@gmail.com" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                    </div>
                    <div className="flex gap-2 justify-start items-center">
                        <div className={`${jmiStudent ? 'bg-red-500' : ""} p-0.5 rounded`}>
                            <button onClick={() => { setJmiStudent(true) }} type='button' className="px-2 py-1 border-2 border-white bg-red-500 rounded-sm text-white text-sm font-semibold">JMI Student</button>
                        </div>
                        <div className={`${!jmiStudent ? 'bg-black' : ""} p-0.5 rounded`}>
                            <button onClick={() => { setJmiStudent(false) }} type='button' className="px-2 py-1 border-2 border-white bg-black rounded-sm text-white text-sm font-semibold">Non-JMI</button>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="price" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Price</label>
                        <input type="text" value={jmiStudent ? '500' : '750'} disabled onChange={handleChange} name="email" id="email" placeholder="mohdusman.you@gmail.com" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                    </div>
                    <div>
                        <label htmlFor="bankname" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Bank Name</label>
                        <input type="text" value={"Indian Bank"} disabled name="bankname" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                    </div>
                    <div>
                        <label htmlFor="holder name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Beneficiary Name</label>
                        <input type="text" value={"JMI-Seminar and Symposium"} disabled name="holdername" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                    </div>
                    <div>
                        <label htmlFor="account number" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Account No</label>
                        <input type="text" value={"6767690486"} disabled name="accountnumber" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                    </div>
                    <div>
                        <label htmlFor="account number" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">IFSC</label>
                        <input type="text" value={"IDIB000J029"} disabled name="accountnumber" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                    </div>

                    <div>
                        <label htmlFor="id" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{jmiStudent ? "Student ID Card" : "Aadhar Card"} {idCardUploading && <span className='text-green-500 text-xs'>Uploading..</span>}</label>
                        <input
                            type="file"
                            name="file"
                            id="id"
                            onChange={uploadIdCard}
                            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="file" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Payment Screenshot {screenshotUploading && <span className='text-green-500 text-xs'>Uploading..</span>}</label>
                        <input
                            type="file"
                            name="file"
                            id="file"
                            onChange={uploadScreenshot}
                            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        />
                    </div>

                    {
                        !buying &&
                        <button type="submit" disabled={screenshotUploading || idCardUploading} className="w-full text-white bg-red-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Submit</button>
                    }
                    {
                        buying &&
                        <div className="flex justify-center">
                            <Spinner />
                        </div>
                    }
                </form>
            </div>
        </>
    )
}

export default BuyPass