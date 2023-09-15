import Home from "@/components/Home";
import Request from "@/components/Request";
import Head from "next/head";
export default function App() {
  return (
    <>
   <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="Ticket Requests" />
        <meta name="author" content="Mohd Usman" />
        <meta name="keywords" content="TedX, Jmi, Tedx Jmi 2023" />
        <title>TEDxJMI - Ticket Reuqests</title>
      </Head>
    <Request/>
    </>
  )
}
