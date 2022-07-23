import { clientEvent } from "@federation-interservices-d-informatique/fiibot-common";
import { Colors, Message, PartialMessage } from "discord.js";
import { checkFIIID } from "../utils/checkFIIID.js";
import { sendLog } from "../utils/sendLogs.js";

export default clientEvent({
    name: "logmessagedelete",
    type: "messageDelete",
    callback: async (msg: Message | PartialMessage): Promise<void> => {
        if (msg.partial) return;
        // Check if the message contains an FII ID
        if (checkFIIID(msg.content)) return;

        sendLog(msg.guild, {
            description: `**Un message de ${msg.author.tag} (${msg.author.id}) dans ${msg.channel} a été supprimé**`,
            color: Colors.Red,
            footer: {
                icon_url: msg.guild?.iconURL() ?? "",
                text: `Logs de ${msg.guild?.name}`
            },
            timestamp: new Date().toISOString(),
            fields: [
                {
                    name: "Contenu",
                    value: `\`\`\`${msg.content}\`\`\``
                }
            ]
        });
    }
});
