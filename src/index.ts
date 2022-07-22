import {
    FiiClient,
    getDirname
} from "@federation-interservices-d-informatique/fiibot-common";
import { GatewayIntentBits, Partials } from "discord.js";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
new FiiClient(
    {
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMembers,
            GatewayIntentBits.MessageContent,
            GatewayIntentBits.GuildBans,
            GatewayIntentBits.GuildMessages
        ],
        partials: [
            Partials.Channel,
            Partials.Message,
            Partials.GuildMember,
            Partials.User
        ]
    },
    {
        managersSettings: {
            interactionsManagerSettings: {
                includeDefaultInteractions: true,
                interactionsPaths: [`${getDirname(import.meta.url)}/commands`]
            },
            eventsManagerSettings: {
                eventsPaths: [`${getDirname(import.meta.url)}/events`]
            }
        },
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
