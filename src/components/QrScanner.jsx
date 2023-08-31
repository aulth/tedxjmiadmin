
import { useState } from "react";
import { QrReader } from "react-qr-reader";
const QrScanner = () => {
    const [startScan, setStartScan] = useState(true);
    const [data, setData] = useState("");
    const [name, setName] = useState("");
    const handleScan = async (scanData, error) => {
            if (scanData) {
                console.log("data found", scanData)
                setData(scanData?.text);
                handleVerify(scanData?.text)
                setStartScan(false);
            }
    };
    const handleReset = () => {
        if (typeof window != undefined) {
            window.location.reload();
        }
    }
    const handleVerify = async (number) => {
        try {
            const response = await fetch('/api/getone', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ticketNumber: number }),
            });
            const json = await response.json();
            console.log(json)
            if (json.success) {
                setName(json.name);
            } else {
                setData(json.msg);
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
                <div className="w-52 h-52 relative mx-auto rounded-full">
                    {startScan && (
                        <>
                            <QrReader
                                facingMode={"environment"}
                                delay={1000}
                                onResult={handleScan}
                                style={{ width: "100%" }}
                            />
                        </>
                    )}
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