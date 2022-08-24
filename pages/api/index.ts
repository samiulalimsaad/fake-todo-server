// pages/api/hello.js
import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";
import NextCors from "nextjs-cors";
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
    // .use(
    //     cors({
    //         origin: "*",
    //         methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    //         preflightContinue: false,
    //         optionsSuccessStatus: 204,
    //     })
    // )
    // .use((req, res, next) => {
    //     res.setHeader("Access-Control-Allow-Origin", "*");
    //     res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
    //     res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    //     next();
    // })
    .get(async (req, res) => {
        res.json(todos);
    })
    .post(async (req, res) => {
        await NextCors(req, res, {
            // Options
            methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
            origin: "*",
            optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
        });
        todos.push({
            id: nextId(),
            text: req.body.text,
            completed: false,
            color: "",
        });

        res.json(todos);
    })
    .delete(async (req, res) => {
        await NextCors(req, res, {
            // Options
            methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
            origin: "*",
            optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
        });
        const id = req?.query?.id!;
        todos.splice(+id - 1, 1);
        res.json(todos);
    })
    .patch(async (req, res) => {
        await NextCors(req, res, {
            // Options
            methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
            origin: "*",
            optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
        });
        const id = req?.query?.id!;
        todos[+id - 1] = { ...todos[+id - 1], ...req.body };
        res.json(todos);
    });

export default handler;
