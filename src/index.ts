import { fiiClient } from "@federation-interservices-d-informatique/fiibot-common";
import { getDirname } from "./utils/getdirname.js";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const client = new fiiClient(
    {
        intents: ["GUILDS"]
    },
    {
        commandManagerSettings: {
            commandsPath: [`${getDirname(import.meta.url)}/commands`]
        },
        owners: [743851266635071710],
        token: process.env.BOT_TOKEN
    },
    {
        host: process.env.DB_HOST,
        database: process.env.POSTGRES_DB,
        password: process.env.POSTGRES_PASSWORD,
        user: process.env.POSTGRES_USER
    }
);
