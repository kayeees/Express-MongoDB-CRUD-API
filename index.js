const express = require("express");
const mongoose = require("mongoose");

const app = express();

const PORT = 3000;

//Middleware
app.use(express.json());

//connection
mongoose
  .connect("mongodb://127.0.0.1:27017/first")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Eorror" + err));

//Schema
const userSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    gender: {
      type: String,
    },
    job_title: {
      type: String,
    },
  },
  { timestamps: true }
);

//Model
const User = mongoose.model("users", userSchema);

// routes
app
  .route("/users")
  .get(async (req, res) => {
    try {
      const allUsers = await User.find();
      return res.status(200).send(allUsers);
    } catch (error) {
      return res.status(500).send(`Error ${error}`);
    }
  })
  .post((req, res) => {
    try {
      const body = req.body;
      User.create({
        first_name: body.first_name,
        last_name: body.last_name,
        email: body.email,
        gender: body.gender,
        job_title: body.job_title,
      });

      return res.status(201).send("Successfully added to the database");
    } catch (error) {
      return res.status(400).send(`Error ${error}`);
    }
  });

app
  .route("/users/:id")
  .get(async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      return res.status(200).send(user);
    } catch (error) {
      return res.status(400).send(`${error}`);
    }
  })
  .delete(async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      return res.status(204).send("Successfully deleted");
    } catch (error) {
      return res.status(400).send(error);
    }
  })
  .patch(async (req, res) => {
    try {
      const body = req.body;
      await User.findByIdAndUpdate(req.params.id, { email: body.email });
      return res.status(200).send("Succefully Updated the email");
    } catch (error) {
      return res.status(400).send(`${error}`);
    }
  });

app.listen(PORT, () => console.log(`server started at port ${PORT}`));
