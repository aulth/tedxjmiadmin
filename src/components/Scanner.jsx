// versi "react-qr-reader" 1.0.0. component API harus disesuaikan dengan yg baru

import { useState } from "react";
import QrReader from "react-qr-reader";

const Scanner = () => {
  const [startScan, setStartScan] = useState(true);
  const [loadingScan, setLoadingScan] = useState(false);
  const [data, setData] = useState("");

  const handleScan = async (scanData) => {
    setLoadingScan(true);
    console.log(`loaded data data`, scanData);
    if (scanData && scanData !== "") {
      console.log(`loaded >>>`, scanData);
      setData(scanData);
      setStartScan(false);
      setLoadingScan(false);
      // setPrecScan(scanData);
    }
  };
  const handleError = (err) => {
    console.error(err);
  };
  return (
    <div className="App">
      {startScan && (
        <>
          <QrReader
            facingMode={"environment"}
            delay={1000}
            onError={handleError}
            onScan={handleScan}
            style={{ width: "300px" }}
          />
        </>
      )}
      {data !== "" && <p>{data}</p>}
    </div>
  );
};

export default Scanner;
