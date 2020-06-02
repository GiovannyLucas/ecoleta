import express from "express";

const app = express();

app.get("/users", (req, res) => {
  res.json([
    'Giovanny',
    'Teste',
    'Lucas'
  ])
})

app.listen(3333);