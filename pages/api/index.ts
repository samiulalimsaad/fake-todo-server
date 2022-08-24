// pages/api/hello.js
import cors from "cors";
import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";
import { todos } from "../../todos";

const nextId = () =>
    todos.reduce((max, todo) => Math.max(max, todo.id), -1) + 1;

const handler = nc<NextApiRequest, NextApiResponse>({
    onError: (err, req, res, next) => {
        console.error(err.stack);
        res.status(500).end("Something broke!");
    },
    onNoMatch: (req, res) => {
        res.status(404).end("Page is not found");
    },
})
    .use(cors())
    .get(async (req, res) => {
        res.json(todos);
    })
    .post(async (req, res) => {
        todos.push({
            id: nextId(),
            text: req.body.text,
            completed: false,
            color: "",
        });

        res.json(todos);
    })
    .delete(async (req, res) => {
        const id = req?.query?.id!;
        todos.splice(+id - 1, 1);
        res.json(todos);
    })
    .patch(async (req, res) => {
        const id = req?.query?.id!;
        todos[+id - 1] = { ...todos[+id - 1], ...req.body };
        res.json(todos);
    });

export default handler;
