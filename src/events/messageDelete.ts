import { fiiClient } from "@federation-interservices-d-informatique/fiibot-common";
import { Message } from "discord.js";
import { EventData } from "../typings/eventData";
import { checkFIIID } from "../utils/checkFIIID.js";
import { getLogChan } from "../utils/getLogChan.js";

const data: EventData = {
    name: "logmessagedelete",
    type: "messageDelete",
    callback: async (msg: Message): Promise<void> => {
        if (msg.partial) return;
        if (checkFIIID(msg.content)) return;

        const logchan = await getLogChan(
            msg.author.client as fiiClient,
            msg.guild
        );
        if (!logchan) return;
        logchan.send({
            embeds: [
                {
                    description: `**Un message de ${msg.author} dans ${msg.channel} a été supprimé**`,
                    color: "RED",
                    footer: {
                        icon_url: `${msg.guild.iconURL({ dynamic: true })}`,
                        text: `Logs de ${msg.guild.name}`
                    },
                    timestamp: new Date(),
                    fields: [
                        {
                            name: "Ancien contenu:",
                            value: `\`\`\`${msg.content}\`\`\``
                        }
                    ]
                }
            ]
        });
    }
};
export default data;
