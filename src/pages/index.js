import BuyPass from "@/components/BuyPass";
import Footer from "@/components/Footer";
import Head from "next/head";
export default function App() {
  return (
    <>
   <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="Buy TEDxJMI pass" />
        <meta name="author" content="Mohd Usman" />
        <meta name="keywords" content="TedX, Jmi, Tedx Jmi 2023" />
        <title>TEDxJMI - Buy Pass</title>
      </Head>
    <BuyPass/>
    {/* <Footer/> */}
    </>
  )
}
