const express = require("express");
const { connectToMongoDB } = require("./connect");
const urlRoute = require("./routes/url");
const URL = require("./models/url");

const app = express();

const PORT = 8001;
const uri =
  "mongodb+srv://omsenapati23:1234@cluster0.cailbmx.mongodb.net/?retryWrites=true&w=majority";

app.use(express.json());
connectToMongoDB(uri).then(() => console.log("Mongodb connected"));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use("/url", urlRoute);

app.get("/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: {
        visitHistory: { timeStamp: Date.now() },
      },
    }
  );
  res.redirect(entry.redirectURL);
});
app.listen(PORT, () => console.log(`Server is listening at ${PORT}`));
