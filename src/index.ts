import { fiiClient } from "@federation-interservices-d-informatique/fiibot-common";
import { readdir } from "fs/promises";
import { EventData } from "./typings/eventData.js";
import { getDirname } from "./utils/getdirname.js";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const client = new fiiClient(
    {
        intents: ["GUILDS", "GUILD_MEMBERS"]
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

client.on("ready", async () => {
    await client.dbclient.query(`
        CREATE TABLE IF NOT EXISTS guild_settings (
            id VARCHAR(20) PRIMARY KEY NOT NULL,
            logchan VARCHAR(20)
        )
    `);
    for (const file of await readdir(`${getDirname(import.meta.url)}/events`)) {
        if (!file.endsWith(".js")) continue;
        const data: EventData = (
            await import(`${getDirname(import.meta.url)}/events/${file}`)
        ).default;
        client.eventManager.registerEvent(data.name, data.type, data.callback);
    }
});
