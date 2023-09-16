import Footer from "@/components/Footer";
import Home from "@/components/admin/Home";
import Head from "next/head";
export default function App() {
  return (
    <>
   <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="Admin Portal" />
        <meta name="author" content="Mohd Usman" />
        <meta name="keywords" content="TedX, Jmi, Tedx Jmi 2023" />
        <title>TEDxJMI - Verify Ticket</title>
      </Head>
    <Home/>
    <Footer/>
    </>
  )
}
