import { fiiClient } from "@federation-interservices-d-informatique/fiibot-common";
import { Message } from "discord.js";
import { EventData } from "../typings/eventData";
import { checkFIIID } from "../utils/checkFIIID.js";
import { getLogChan } from "../utils/getLogChan.js";

const data: EventData = {
    name: "logmessageupdates",
    type: "messageUpdate",
    callback: async (oldm: Message, newm: Message): Promise<void> => {
        if (newm.partial) await newm.fetch();
        if (oldm.partial) await oldm.fetch();
        if (newm.content === oldm.content) return;
        if (checkFIIID(oldm.content) && !checkFIIID(newm.content)) return;
        if (checkFIIID(newm.content)) {
            if (!newm.deleted && newm.deletable) newm.delete();
            return;
        }
        const logchan = await getLogChan(
            newm.author.client as fiiClient,
            newm.guild
        );
        if (!logchan) return;
        logchan.send({
            embeds: [
                {
                    description: `**Un message de ${newm.author} dans ${newm.channel} a été modifié**`,
                    color: "RED",
                    footer: {
                        icon_url: `${newm.guild.iconURL({ dynamic: true })}`,
                        text: `Logs de ${newm.guild.name}`
                    },
                    timestamp: new Date(),
                    fields: [
                        {
                            name: "Ancien contenu:",
                            value: `\`\`\`${oldm.content}\`\`\``
                        },
                        {
                            name: "Nouveau contenu:",
                            value: `\`\`\`${newm.content} \`\`\``
                        }
                    ]
                }
            ]
        });
    }
};
export default data;
