
import { useState } from "react";
import { QrReader } from "react-qr-reader";
const QrScanner = () => {
    const [startScan, setStartScan] = useState(true);
    const [data, setData] = useState("");
    const [name, setName] = useState("");
    const playAlarmSound = () => {
        const audio = new Audio('/alarm.mp3');
        audio.play();
    };
    const handleScan = async (scanData, error) => {
        if (scanData) {
            playAlarmSound();
            setData(scanData?.text);
            handleVerify(scanData?.text)
            setStartScan(false);
        }
    };
    const handleReset = () => {
        setStartScan(true);
        setData("");
        setName("");
    }
    const handleVerify = async (number) => {
        try {
            const response = await fetch('/api/getone', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ticketNumber: number, adminPin:process.env.NEXT_PUBLIC_ADMIN_PIN }),
            });
            const json = await response.json();
            if (json.success) {
                setName(json.name);
            } else {
                setName(json.msg);
            }
        } catch (error) {
            console.error('Error:', error);
            setData('Error occurred');
        }
    };
    return (
        <>
            <div className="w-full h-screen p-8">
                <h2 className="text-center text-lg font-bold text-red-500 my-4">{data}</h2>
                <h2 className="text-center text-lg font-bold text-red-500 my-4">{name}</h2>
                <div className="w-52 relative mx-auto rounded-full">
                    {startScan && (
                        <div className="relative w-full h-full">
                            <div className="w-8 aspect-square border-l-2 border-t-2 border-red-400 absolute top-0 left-0"></div>
                            <div className="w-8 aspect-square border-r-2 border-t-2 border-red-400 absolute top-0 right-0"></div>
                            <div className="w-8 aspect-square border-r-2 border-b-2 border-red-400 absolute bottom-0 right-0"></div>
                            <div className="w-8 aspect-square border-l-2 border-b-2 border-red-400 absolute bottom-0 left-0"></div>
                            <div
                                className="absolute top-0 left-0 w-full h-1 bg-red-400 z-10"
                                style={{ animation: "scanAnimation 4s linear infinite" }}
                            ></div>
                            <QrReader
                                constraints={{ facingMode: 'environment' }}
                                delay={1000}
                                onResult={handleScan}
                                style={{ width: "100%" }}
                            />
                        </div>
                    )}
                    {
                        !startScan && !name &&
                        <img src="https://motiongraphicsphoebe.files.wordpress.com/2018/10/giphy.gif" alt="loading" className="w-40 aspect-square mx-auto" />
                    }
                </div>
                <div className="flex justify-center mt-4">
                    {
                        data &&
                        <button onClick={handleReset} className="rounded-full px-4 py-2 bg-gray-200 hover:bg-gray-300 focus:outline-none">
                            Reset
                        </button>
                    }
                </div>
            </div>
        </>
    )
}

export default QrScanner