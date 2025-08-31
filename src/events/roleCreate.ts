import { clientEvent } from "@federation-interservices-d-informatique/fiibot-common";
import { Role } from "discord.js";
import { sendLog } from "../utils/sendLogs.js";

export default clientEvent({
    name: "logcreatedroles",
    type: "roleCreate",
    callback: async (role: Role): Promise<void> => {
        await sendLog(role.guild, {
            title: "Un rôle a été créé!",
            description: `Le role ${role.name} a été créé!`,
            fields: [
                {
                    value: `\`\`\`${role.permissions.toArray().join('\n')}\`\`\``,
                    name: "Permissions:"
                }
            ],
            color: role.colors.primaryColor,
            timestamp: new Date().toISOString()
        });
    }
});
