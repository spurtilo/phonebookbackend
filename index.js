const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
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

let persons = [
  {
    id: 1,
    name: "Urho Kekkonen",
    number: "040 5698 744",
  },
  {
    id: 2,
    name: "Mauno Koivisto",
    number: "040 8888 111",
  },
  {
    id: 3,
    name: "Martti Ahtisaari",
    number: "050 8756 429",
  },
  {
    id: 4,
    name: "Tarja Halonen",
    number: "050 7777 889",
  },
  {
    id: 5,
    name: "Sauli Niinistö",
    number: "040 5698 744",
  },
];

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((p) => p.id === id);

  if (person) {
    res.json(person);
  } else {
    response.status(404).end();
  }
});

app.get("/info", (req, res) => {
  res.send(
    `<p>Phonebook has info for ${persons.length} people</p><br />${new Date()}`
  );
});

const generateId = () => {
  return Math.floor(Math.random() * 10000);
};

app.post("/api/persons/", (req, res) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: "Name or number is missing.",
    });
  }

  if (persons.some((person) => person.name === body.name)) {
    return res.status(409).json({
      error: "Name is already in the phonebook.",
    });
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);
  console.log(persons);

  res.json(person);
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
