import Head from "next/head";
import { MongoClient } from "mongodb";
import { Fragment } from "react";

// import { useEffect, useState } from "react";
import MeetupList from "../components/meetups/MeetupList";
// import Layout from "../components/layout/Layout";

const HomePage = (props) => {
  //   const [loadedMeetups, setLoadedMeetups] = useState([]);
  //   useEffect(() => {
  //     // const fetchMeetups = async () => {
  //     //     const response = await fetch(url)

  //     //     if(!response.ok) {

  //     //     }

  //     //     const data = await response.json()
  //     // }

  //     setLoadedMeetups(DUMMY_MEETUPS);
  //   }, []);

  return (
    <Fragment>
      <Head>
        <title>React Meetups</title>
        <meta
          name="description"
          content="Browse a huge list of highly active react meetups"
        />
      </Head>
      <MeetupList meetups={props.meetups} />
    </Fragment>
  );
};

export async function getStaticProps() {
  const client = await MongoClient.connect(
    "mongodb+srv://brandenburgas:Zz4QT7pgqHg6BHx@cluster0.tbehpje.mongodb.net/meetups?retryWrites=true&w=majority"
  );

  const db = client.db();
  const meetupsCollection = db.collection("meetups");

  const meetups = await meetupsCollection.find().toArray();

  client.close();

  return {
    props: {
      meetups: meetups.map((meetup) => ({
        title: meetup.title,
        address: meetup.address,
        image: meetup.image,
        id: meetup._id.toString(),
      })),
    },
    revalidate: 10, //seconds nextJS will wait to reevaluate the data
  };
}

// if data fetching etc is needed so the page would be rendered with it (SEO reasons etc. ) this function must be exported with precisely this name
//execute any code that would normally run on a server. this code will never execute on the client side. this code is executed during the build process.
//fetch data from the api
//object must be returned and MUST have props, and props will be passed to this page's props

//if we want to reevaluate for every request/dynamically, we need to use an alternative:

// export const getServerSideProps = async (context) => {
//   const req = context.req;
//   const res = context.res;
//   //always runs on the server

//   //can still fetch data, etc.
//   //credentials could be used here
//   return {
//     props: {
//       meetups: DUMMY_MEETUPS,
//     },
//   };
// };
//no need to revalidate, because this function runs for every request in any case

export default HomePage;
