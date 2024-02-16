const mongoose = require("mongoose");

const { Schema } = mongoose;

mongoose.set("strictQuery", false);

const url = process.env.MONGODB_URI;

console.log("Connecting to", url);
mongoose
  .connect(url)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB", error.message);
  });

const personSchema = new Schema({
  name: {
    type: String,
    minlength: [3, "NAME TOO SHORT (min length 3)"],
    required: [true, "NAME REQUIRED"],
  },
  number: {
    type: String,
    validate: {
      validator: (n) => {
        return /\d{2,3}-\d{4,}/.test(n);
      },
      message: (props) => `NUMBER ${props.value} NOT VALID`,
    },
    required: [true, "NUMBER REQUIRED"],
  },
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    const updatedObject = { ...returnedObject };

    updatedObject.id = returnedObject._id.toString();
    delete updatedObject._id;
    delete updatedObject.__v;

    return updatedObject;
  },
});

module.exports = mongoose.model("Person", personSchema);
