import {
    clientEvent,
    FiiClient
} from "@federation-interservices-d-informatique/fiibot-common";
import { Colors, Message, PartialMessage } from "discord.js";
import { checkFIIID } from "../utils/checkFIIID.js";
import { sendLog } from "../utils/sendLogs.js";

export default clientEvent({
    name: "logmessageupdates",
    type: "messageUpdate",
    callback: async (
        oldm: Message | PartialMessage,
        newm: Message | PartialMessage
    ): Promise<void> => {
        try {
            if (newm.partial) await newm.fetch();
            if (oldm.partial) await oldm.fetch();
        } catch (e) {
            if (e instanceof Error)
                (oldm.client as FiiClient).logger.error(
                    `Failed to fetch messages!: ${e}`,
                    "MESSAGEEUPDATE"
                );
            return;
        }
        if (!oldm.content || !newm.content) return;
        if (newm.content === oldm.content) return;
        if (!oldm.guild || !newm.guild) return;

        // If the old messages contains an ID, skip
        if (checkFIIID(oldm.content) && !checkFIIID(newm.content)) return;

        // Filter messages that contain fii ids
        if (checkFIIID(newm.content)) {
            if (newm.deletable)
                try {
                    await newm.delete();
                } catch (e) {
                if (e instanceof Error)
                        (oldm.client as FiiClient).logger.error(
                            `Unable to delete ${newm.id} (${newm.content}, but it contains an ID!)`,
                            "messageUpdate"
                        );
                }
            return;
        }
        await sendLog(newm.guild, {
            description: `**Un message de ${newm.author?.tag ?? ""} (${newm.author?.id ?? ""}) dans ${newm.channel.toString()} a été modifié**`,
            color: Colors.Red,
            footer: {
                icon_url: newm.guild.iconURL() ?? "",
                text: `Logs de ${newm.guild.name}`
            },
            timestamp: new Date().toISOString(),
            fields: [
                {
                    name: "Ancien contenu",
                    value: `\`\`\`${oldm.content}\`\`\``
                },
                {
                    name: "Nouveau contenu",
                    value: `\`\`\`${newm.content} \`\`\``
                }
            ]
        });
    }
});
