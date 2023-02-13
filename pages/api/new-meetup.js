import { MongoClient } from "mongodb";

// /api/new-meetup
// POST /api/new-meetup

const handler = async (req, res) => {
  // req.method - allows us to check what kind of a request was sent
  if (req.method === "POST") {
    const data = req.body;
    // const { title, image, address, description } = data;

    const client = await MongoClient.connect(
      "mongodb+srv://brandenburgas:Zz4QT7pgqHg6BHx@cluster0.tbehpje.mongodb.net/meetups?retryWrites=true&w=majority"
    );
    const db = client.db();
    const meetupsCollection = db.collection("meetups");

    const result = await meetupsCollection.insertOne(data);

    console.log(result);

    client.close();

    res.status(201).json({ message: "Meetup inserted!" });
  }
};

export default handler;
