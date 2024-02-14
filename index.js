require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");
const app = express();

app.use(express.json());
app.use(express.static("dist"));
app.use(cors());
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :requestData"
  )
);

morgan.token("requestData", (req, res) => {
  return JSON.stringify(req.body);
});

app.get("/api/persons", (req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons);
  });
});

app.get("/api/persons/:id", (req, res) => {
  Person.findById(req.params.id).then((person) => {
    res.json(person);
  });
});

app.get("/info", (req, res) => {
  Person.countDocuments({}).then((count) => {
    res.send(
      `<p>Phonebook has info for ${count} people</p><br />${new Date()}`
    );
  });
});

app.post("/api/persons/", (req, res) => {
  const body = req.body;

  if (body.name === undefined || body.number === undefined) {
    return res.status(400).json({
      error: "Name or number is missing.",
    });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then((savedPerson) => {
    res.json(savedPerson);
  });
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((p) => p.id !== id);
  console.log(persons);

  res.status(204).end();
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
