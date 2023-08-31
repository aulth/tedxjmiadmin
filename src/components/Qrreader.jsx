// import React, { useState, useEffect } from 'react';
// import { QrReader } from 'react-qr-reader';
// const Qrreader = () => {
//     const [data, setData] = useState('No result');
//     const [scanned, setScanned] = useState(false);

//     // const playAlarmSound = () => {
//     //     const audio = new Audio('/alarm.mp3');
//     //     console.log('notification')
//     //         audio.play();
//     // };

//     const handleVerify = async (number) => {
//         try {
//             const response = await fetch('/api/getone', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ ticketNumber: number }),
//             });
//             const json = await response.json();
//             if (json.success) {
//                 setData(json.name);
//             } else {
//                 setData(json.msg);
//             }
//         } catch (error) {
//             console.error('Error:', error);
//             setData('Error occurred');
//         }
//     };

//     const handleScan = (ticketNumber) => {
//         console.log('scanning')
//         setData(ticketNumber?.text)
//     };
//     const handleReset = () => {
//         setData('No result');
//         setScanned(false);
//     };
//     return (
//         <div className="w-full h-screen p-8">
//             <h2 className="text-center text-lg font-bold text-red-500 my-4">{data}</h2>
//             <div className="w-52 h-52 relative mx-auto rounded-full">
//                 {/* <QrReader
//                     onResult={(result, error) => {
//                         if (!!result) {
//                             setData(result?.text);
//                         }

//                         if (!!error) {
//                             console.info(error);
//                         }
//                     }}
//                     delay={1000}
//                     style={{ width: '100%' }}
//                 /> */}
//                 <QrReader
//                     facingMode={"environment"}
//                     delay={1000}
//                     onResult={handleScan}
//                     style={{ width: "300px" }}
//                 />
//                 <p>{data}</p>
//             </div>
//             <div className="flex justify-center mt-4">
//                 {
//                     scanned &&
//                     <button onClick={handleReset} className="rounded-full px-4 py-2 bg-gray-200 hover:bg-gray-300 focus:outline-none">
//                         Reset
//                     </button>
//                 }
//             </div>
//         </div>
//     )
// }

// export default Qrreader