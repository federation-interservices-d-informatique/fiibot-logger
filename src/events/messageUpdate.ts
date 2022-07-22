import {
    clientEvent,
    FiiClient
} from "@federation-interservices-d-informatique/fiibot-common";
import { Colors, Message } from "discord.js";
import { checkFIIID } from "../utils/checkFIIID.js";
import { getLogChan } from "../utils/getLogChan.js";

export default clientEvent({
    name: "logmessageupdates",
    type: "messageUpdate",
    callback: async (oldm: Message, newm: Message): Promise<void> => {
        try {
            if (newm.partial) await newm.fetch();
            if (oldm.partial) await oldm.fetch();
        } catch (e) {
            (oldm.client as FiiClient)?.logger.error(
                `Failed to fetch messages!: ${e}`,
                "MESSAGEEUPDATE"
            );
            return;
        }
        if (!oldm.content || !newm.content) return;
        if (newm.content === oldm.content) return;
        if (checkFIIID(oldm.content) && !checkFIIID(newm.content)) return;
        if (checkFIIID(newm.content)) {
            if (newm.deletable)
                try {
                    newm.delete();
                } catch (e) {
                    (oldm.client as FiiClient).logger.error(
                        `Unable to delete ${newm.id} (${newm.content}, but it contains an ID!)`,
                        "messageUpdate"
                    );
                }
            return;
        }
        const logchan = await getLogChan(
            newm.author.client as FiiClient,
            newm.guild
        );
        if (!logchan) return;
        try {
            await logchan.send({
                embeds: [
                    {
                        description: `**Un message de ${newm.author} dans ${newm.channel} a été modifié**`,
                        color: Colors.Red,
                        footer: {
                            icon_url: `${newm.guild.iconURL({})}`,
                            text: `Logs de ${newm.guild.name}`
                        },
                        timestamp: new Date().toISOString(),
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
        } catch (e) {
            (newm.client as FiiClient).logger.error(
                `Can't send logs in ${newm.guild.name} (${newm.guild.id}): ${e}`,
                "messageUpdate"
            );
        }
    }
});
