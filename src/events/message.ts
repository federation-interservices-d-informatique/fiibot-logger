import { Message } from "discord.js";
import { EventData } from "../typings/eventData";

const data: EventData = {
    name: "logmessage",
    type: "message",
    callback: async (msg: Message): Promise<void> => {
        console.log("Received message event!");
    }
};
export default data;
