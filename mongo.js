require("dotenv").config();
const mongoose = require("mongoose");

const { Schema } = mongoose;

const name = process.argv[2];
const number = process.argv[3];

const url = process.env.MONGODB_URI;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const personSchema = new Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

if (name && number) {
  const person = new Person({
    name,
    number,
  });

  person.save().then(() => {
    console.log(`Added ${name} number ${number} to phonebook.`);

    mongoose.connection.close();
  });
} else {
  Person.find({}).then((result) => {
    console.log("Phonebook:");
    result.forEach((person) => {
      console.log(`${person.name} ${person.number}`);
    });

    mongoose.connection.close();
  });
}
