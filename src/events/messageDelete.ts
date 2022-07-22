import {
    clientEvent,
    FiiClient
} from "@federation-interservices-d-informatique/fiibot-common";
import { Colors, Message } from "discord.js";
import { checkFIIID } from "../utils/checkFIIID.js";
import { getLogChan } from "../utils/getLogChan.js";

export default clientEvent({
    name: "logmessagedelete",
    type: "messageDelete",
    callback: async (msg: Message): Promise<void> => {
        if (msg.partial) return;
        if (checkFIIID(msg.content)) return;

        const logchan = await getLogChan(
            msg.author.client as FiiClient,
            msg.guild
        );
        if (!logchan) return;
        try {
            await logchan.send({
                embeds: [
                    {
                        description: `**Un message de ${msg.author} dans ${msg.channel} a été supprimé**`,
                        color: Colors.Red,
                        footer: {
                            icon_url: `${msg.guild.iconURL()}`,
                            text: `Logs de ${msg.guild.name}`
                        },
                        timestamp: new Date().toISOString(),
                        fields: [
                            {
                                name: "Ancien contenu:",
                                value: `\`\`\`${msg.content}\`\`\``
                            }
                        ]
                    }
                ]
            });
        } catch (e) {
            (msg.client as FiiClient).logger.error(
                `Can't send logs in ${msg.guild.name} (${msg.guild.id}): ${e}`,
                "messageDelete"
            );
        }
    }
});
