import { Fragment } from "react";
import { MongoClient, ObjectId } from "mongodb";
import Head from "next/head";

import MeetupDetail from "../../components/meetups/MeetupDetail";

const MeetupDetailsPage = (props) => {
  return (
    <Fragment>
      <Head>
        <title>{props.meetupData.title}</title>
        <meta name="description" content={props.meetupData.description} />
      </Head>
      <MeetupDetail
        image={props.meetupData.image}
        title={props.meetupData.title}
        address={props.meetupData.address}
        description={props.meetupData.description}
      />
    </Fragment>
  );
};

export const getStaticPaths = async () => {
  const client = await MongoClient.connect(
    "mongodb+srv://brandenburgas:Zz4QT7pgqHg6BHx@cluster0.tbehpje.mongodb.net/meetups?retryWrites=true&w=majority"
  );

  const db = client.db();
  const meetupsCollection = db.collection("meetups");

  const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray();

  client.close();

  // describes all the variants for which this page could be generated
  return {
    fallback: false, // tells if paths have ALL available, or just only some of the available values (Falls - ALL VALUES, if user enters a value that is not supported, he would get a 404 error, if TRUE, then nextJS would try to generate a version for that page)
    paths: meetups.map((meetup) => ({
      params: {
        meetupId: meetup._id.toString(),
      },
    })),

    // [
    //   //not HARDCODE, but fetch all of the available ids from the database
    //   {
    //     params: {
    //       meetupId: "m1",
    //     },
    //   },
    //   {
    //     params: {
    //       meetupId: "m2",
    //     },
    //   },
    // ],
  };
};

export const getStaticProps = async (context) => {
  const meetupId = context.params.meetupId; //meetupId nes tarp square brackets
  //fetch data for a single meetup

  const client = await MongoClient.connect(
    "mongodb+srv://brandenburgas:Zz4QT7pgqHg6BHx@cluster0.tbehpje.mongodb.net/meetups?retryWrites=true&w=majority"
  );

  const db = client.db();
  const meetupsCollection = db.collection("meetups");

  const selectedMeetup = await meetupsCollection.findOne({
    _id: new ObjectId(meetupId),
  });

  client.close();
  return {
    props: {
      meetupData: {
        id: selectedMeetup._id.toString(),
        title: selectedMeetup.title,
        address: selectedMeetup.address,
        image: selectedMeetup.image,
        description: selectedMeetup.description,
      },
    },
  };
};

export default MeetupDetailsPage;
