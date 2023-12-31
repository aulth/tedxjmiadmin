import React, { useState, useEffect } from 'react'
import toast, { Toaster } from 'react-hot-toast';
import Spinner from './Spinner';

const BuyPass = () => {
    const [screenshotUploading, setScreenshotUploading] = useState(false);
    const [idCardUploading, setIdCardUploading] = useState(false)
    const [data, setData] = useState({ name: "", email: "", mobile: "", transactionId: "", designation:"" });
    const [screenshot, setScreenshot] = useState('');
    const [idCard, setIdCard] = useState('')
    const [buying, setBuying] = useState(false);
    const [jmiStudent, setJmiStudent] = useState(true);
    const [success, setSuccess] = useState(false);
    const [soldOut, setSoldOut] = useState(false);
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
        if (!data.mobile) {
            return toast.error('Mobile no is missing');
        }
        if (!data.designation) {
            return toast.error('Please select your designation');
        }
        if (!data.transactionId) {
            return toast.error('Please enter transaction id');
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
            body: JSON.stringify({ name: data.name, email: data.email, screenshot: screenshot, idCard: idCard, transactionId: data.transactionId, mobile: data.mobile, designation:data.designation, adminPin: process.env.NEXT_PUBLIC_ADMIN_PIN })
        })
        const json = await response.json();
        if (json.success) {
            toast.success(json.msg);
            setSuccess(true);
        } else {
            setSuccess(false)
            toast.error(json.msg);
        }
        setData({ name: "", email: "", transactionId: "", mobile: "" })
        setScreenshot('');
        setBuying(false);
    }
    const fetchTicketCount = async () => {
        const response = await fetch("/api/getcount");
        const json = await response.json();
        if (json.count >= 400) {
            setSoldOut(true);
        }

    }
    useEffect(() => {
        fetchTicketCount();
    }, [])

    return (
        <>
            <Toaster position='top-right' />
            <header className='w-screen border-b p-4'>
                <div className="container mx-auto flex justify-between items-center">
                    <a href="#" className="flex items-center text-2xl font-semibold text-gray-900  ">
                        <img className="w-36" src="https://www.tedxjmi.org/res/images/logos/light.png" alt="logo" />
                    </a>
                    <div className='mr-2 flex flex-col justify-center items-end'>
                        <h3 className="font-semibold text-sm">Contact for pass query</h3>
                        <a href='tel:+919839872992' className="font-semibold text-sm text-red-500 underline">+91 9839872992</a>
                    </div>
                </div>
            </header>
            {
                !success && !soldOut &&
                <>
                    <h2 className="text-xl font-bold text-center mt-4">
                        Buy <span className='text-red-500'>TEDx</span>JMI Pass
                    </h2>
                    <div className="container flex justify-center items-center p-4 mx-auto">

                        <form onSubmit={handleSubmit} className="space-y-4 w-full md:w-[450px] md:space-y-6 border p-4 rounded" action="#">
                            <div>
                                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900  ">Name</label>
                                <input type="text" value={data.name} onChange={handleChange} name="name" id="name" placeholder="Your name" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" />
                            </div>
                            <div>
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900  ">Email</label>
                                <input type="email" value={data.email} onChange={handleChange} name="email" id="email" placeholder="example@gmail.com" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 " />
                            </div>
                            <div>
                                <label htmlFor="mobile" className="block mb-2 text-sm font-medium text-gray-900  ">Mobile No</label>
                                <input type="tel" value={data.mobile} onChange={handleChange} name="mobile" id="mobile" placeholder="Your mobile number" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 " />
                            </div>
                            <div className="flex gap-2 justify-start items-center">
                                <div className={`${jmiStudent ? 'bg-red-500' : ""} p-0.5 rounded`}>
                                    <button onClick={() => { setJmiStudent(true) }} type='button' className="px-2 py-1 border-2 border-white bg-red-500 rounded-sm text-white text-sm font-semibold">JMI Student/Alumni/Employee</button>
                                </div>
                                {/* <div className={`${!jmiStudent ? 'bg-black' : ""} p-0.5 rounded`}>
                                    <button onClick={() => { setJmiStudent(false) }} type='button' className="px-2 py-1 border-2 border-white bg-black rounded-sm text-white text-sm font-semibold">Non-JMI</button>
                                </div> */}
                            </div>
                            { jmiStudent &&
                                <div>
                                    <label htmlFor="designation" className="block mb-2 text-sm font-medium text-gray-900  ">Designation</label>
                                    <select value={data.designation} required onChange={handleChange}  name="designation" id="designation" className='bg-gray-50 border cursor-pointer border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 '>
                                        <option value="">Select Designation</option>
                                        <option value="Student">Student</option>
                                        <option value="Alumni">Alumni</option>
                                        <option value="Employee">Employee</option>
                                    </select>
                                </div>
                            }
                            <div className='text-sm '>
                                <label htmlFor="bankname" className="block mb-2 text-sm font-medium text-gray-900  ">Deposit the money into this account and share the screenshot below</label>
                                <div className="w-full grid grid-cols-4">
                                    <div className='col-span-2 font-semibold'>
                                        Bank Name:
                                    </div>
                                    <div className='col-span-2'>
                                        Indian Bank
                                    </div>
                                </div>
                                <div className="w-full  grid grid-cols-4">
                                    <div className='col-span-2 font-semibold'>
                                        Beneficiary:
                                    </div>
                                    <div className='col-span-2'>
                                        JMI-Seminar and Symposium
                                    </div>
                                </div>
                                <div className="w-full grid grid-cols-4">
                                    <div className='col-span-2 font-semibold'>
                                        Account No:
                                    </div>
                                    <div className='col-span-2'>
                                        6767690486
                                    </div>
                                </div>
                                <div className="w-full grid grid-cols-4">
                                    <div className='col-span-2 font-semibold'>
                                        IFSC:
                                    </div>
                                    <div className='col-span-2'>
                                        IDIB000J029
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label htmlFor="price" className="block mb-2 text-sm font-medium text-gray-900 ">Price</label>
                                <input type="email" value={jmiStudent ? '510' : '750'} disabled onChange={handleChange} name="email" id="email" placeholder="mohdusman.you@gmail.com" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 " />
                            </div>
                            <div>
                                <label htmlFor="transactionId" className="block mb-2 text-sm font-medium text-gray-900 ">Reference / Transaction id</label>
                                <input type="text" onChange={handleChange} value={data.transactionId} name="transactionId" placeholder='xxxxxx' className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 " />
                            </div>
                            <label htmlFor="notice" className="block mb-2 text-sm font-medium text-gray-900   underline italic">If we find any discrepancy in the details filled by you, your entry will be deemed invalid and your money will not be returned.</label>
                            <div>
                                <label htmlFor="id" className="block mb-2 text-sm font-medium text-gray-900  ">{jmiStudent ? data.designation=="Student"?"Student Id/Fee Slip":data.designation=="Alumni"?"Any proof of alumni (Marksheet, etc.)":data.designation=="Employee"?"Empoyee ID":"Student ID / Fee" : "Govt. ID (Aadhar, PAN, etc.)"} <span className='text-xs'>(.jpg/.png)</span> {idCardUploading && <span className='text-green-500 text-xs'>Uploading..</span>}</label>
                                <input
                                    type="file"
                                    name="file"
                                    id="id"
                                    accept="image/jpeg, image/png"
                                    onChange={uploadIdCard}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                                />
                            </div>
                            <div>
                                <label htmlFor="file" className="block mb-2 text-sm font-medium text-gray-900  ">Payment Screenshot <span className='text-xs'>(.jpg/.png)</span> {screenshotUploading && <span className='text-green-500 text-xs'>Uploading..</span>}</label>
                                <input
                                    type="file"
                                    name="file"
                                    id="file"
                                    accept="image/jpeg, image/png"
                                    onChange={uploadScreenshot}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                />
                            </div>

                            {
                                !buying &&
                                <button type="submit" disabled={screenshotUploading || idCardUploading} className="w-full text-white bg-red-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ">Submit</button>
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
            }
            {
                success && !soldOut &&
                <div className="container  h-screen flex justify-center items-start p-4 mx-auto">
                    <div className="space-y-2 w-full md:w-[450px]   p-4 rounded">
                        <h2 className="font-bold text-xl text-center text-green-500">Thanks! for Registering</h2>
                        <h3 className="font-semibold text-center">You will receive your pass shortly.</h3>
                    </div>
                </div>
            }
            {
                soldOut &&
                <div className="container h-screen flex justify-center items-start p-4 mx-auto">
                    <div className="space-y-2 w-full md:w-[450px]   p-4 rounded">
                        <h2 className="font-bold text-xl text-center text-red-500 underline">Passes Sold Out</h2>
                    </div>
                </div>
            }

        </>
    )
}

export default BuyPass