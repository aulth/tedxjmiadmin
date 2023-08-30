import React, { useState, useEffect } from 'react';
import { QrReader } from 'react-qr-reader';
const Qrreader = () => {
    const [data, setData] = useState('No result');
  return (
    <>
    <div className="w-full h-screen bg-[rgba(0,0,0,0.4)] p-8">
      <h2 className="text-center text-lg font-bold text-red-500 my-4">Mohd Usman</h2>
      <div className="w-52 aspect-square bg-white relative mx-auto">
      <QrReader
        onResult={(result, error) => {
          if (!!result) {
            setData(result?.text);
          }

          if (!!error) {
            console.info(error);
          }
        }}
        style={{ width: '100%' }}
      />
      <p>{data}</p>
      </div>
    </div>
    </>
  )
}

export default Qrreader