import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import Spinner from '../Spinner';

function ExcelUploader() {
    const [excelData, setExcelData] = useState([]);
    const [file, setFile] = useState(null);
    const [responses, setResponses] = useState([]);
    const [processing, setProcessing] = useState(false)
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];

        if (selectedFile) {
            setFile(selectedFile);

            const reader = new FileReader();

            reader.onload = (e) => {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(sheet);

                setExcelData(jsonData);
            };

            reader.readAsArrayBuffer(selectedFile);
        }
    };

    const handleUpload = async () => {
        if (excelData.length === 0) {
            alert('Please upload an Excel file first.');
            return;
        }

        try {
            setResponses([])
            setProcessing(true);
            for (let i = 0; i < excelData.length; i++) {
                const response = await fetch('/api/book', {
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify({ email: excelData[i].email, name: excelData[i].name, adminPin: process.env.NEXT_PUBLIC_ADMIN_PIN })
                })
                let json = await response.json();
                setResponses(prev => [...prev, json]);
            }
            setProcessing(false)
        } catch (error) {
            console.error('API Request Error:', error);
        }
    };

    return (
        <div className="container mx-auto flex items-center flex-col p-4">
            <div className="flex gap-2 justify-center items-center">
                {
                    excelData.length == 0 &&
                    <label className="text-gray-600">
                        <input
                            type="file"
                            accept=".xlsx"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                            <span className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded cursor-pointer">
                                Upload Excel
                            </span>
                        
                    </label>
                }
                {
                    excelData.length != 0 && !processing &&
                    <button onClick={handleUpload} className="bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded cursor-pointer">
                        Send Tickets
                    </button>
                }
                {
                    processing &&
                    <Spinner/>
                }
            </div>

            <ul className="grid container mx-auto grid-cols-1 sm:grid-cols-2 gap-4 my-2">

                {
                    responses && responses.length > 0 &&
                    responses.map((data, index) => {
                        return <li key={index} className="p-4 border-b border-gray-300 w-full">
                            <div className="w-full flex justify-between">
                                <div className="flex flex-col items-start">
                                    <h2 className="text-sm font-semibold">
                                        {data.data.name}
                                    </h2>
                                    <h3 className="text-sm">
                                        {data.data.email}
                                    </h3>
                                </div>
                                <h4 className={`text-sm ${data.success ? 'text-green-500' : 'text-red-500'} font-semibold`}>{data.msg ? data.msg : ""}</h4>
                            </div>
                        </li>
                    })
                }

            </ul>

        </div>

    );
}

export default ExcelUploader;
