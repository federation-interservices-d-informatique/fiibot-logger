import { fiiClient } from "@federation-interservices-d-informatique/fiibot-common";
import { readdir } from "fs/promises";
import { EventData } from "./typings/eventData.js";
import { getDirname } from "./utils/getdirname.js";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const client = new fiiClient(
    {
        intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_BANS", "GUILD_MESSAGES"],
        partials: ["GUILD_MEMBER", "USER", "MESSAGE"]
    },
    {
        commandManagerSettings: {
            commandsPath: [`${getDirname(import.meta.url)}/commands`]
        },
        owners: process.env.OWNERS.split(",").map((o) => parseInt(o)),
        token: process.env.BOT_TOKEN
    },
    {
        dbConfig: {
            host: process.env.DB_HOST,
            database: process.env.POSTGRES_DB,
            password: process.env.POSTGRES_PASSWORD,
            user: process.env.POSTGRES_USER
        },
        tableName: "fiibotloggerpskv"
    }
);

client.on("ready", async () => {
    for (const file of await readdir(`${getDirname(import.meta.url)}/events`)) {
        if (!file.endsWith(".js")) continue;
        const data: EventData = (
            await import(`${getDirname(import.meta.url)}/events/${file}`)
        ).default;
        client.eventManager.registerEvent(data.name, data.type, data.callback);
    }
});
