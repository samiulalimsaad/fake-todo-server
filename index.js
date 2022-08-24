import cors from "cors";
import express from "express";
import { todos } from "./todos.js";

const app = express();

const PORT = process.env.PORT || 4000;
//  middleWares
// enable cors
app.use(cors());
app.use(express.json());

const nextId = () =>
    todos.reduce((max, todo) => Math.max(max, todo.id), -1) + 1;

app.get("/", async (req, res) => {
    res.json(todos);
});

app.post("/", async (req, res) => {
    const id = nextId();
    todos.push({
        id,
        text: req.body.text,
        completed: false,
        color: "",
    });

    res.json(todos[id - 1]);
});

app.delete("/:id", async (req, res) => {
    const id = req.params.id;
    const data = todos[id - 1];
    todos.splice(+id - 1, 1);
    res.json(data);
});

app.patch("/:id", async (req, res) => {
    const id = req?.params?.id;
    todos[id - 1] = { ...todos[+id - 1], ...req.body };
    res.json(todos[id - 1]);
});

app.listen(PORT, async () => {
    console.log(`server is running at http://localhost:${PORT}`);
});
