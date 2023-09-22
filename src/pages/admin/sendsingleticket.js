import Footer from '@/components/Footer'
import SendSingleTicket from '@/components/admin/SendSingleTicket'
import Head from 'next/head'
const page = () => {
  return (
    <>
    <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="Send Ticket" />
        <meta name="author" content="Mohd Usman" />
        <meta name="keywords" content="TedX, Jmi, Tedx Jmi 2023" />
        <title>TEDxJMI - Send Ticket</title>
      </Head>
    <SendSingleTicket/>
    <Footer/>
    </>
  )
}

export default page