import {
    clientEvent,
    FiiClient
} from "@federation-interservices-d-informatique/fiibot-common";
import { Role } from "discord.js";
import { getLogChan } from "../utils/getLogChan.js";

export default clientEvent({
    name: "logcreatedroles",
    type: "roleCreate",
    callback: async (role: Role): Promise<void> => {
        const logchan = await getLogChan(role.client as FiiClient, role.guild);
        if (!logchan) return;
        try {
            await logchan.send({
                embeds: [
                    {
                        title: "Un rôle a été créé!",
                        description: `Le role ${role.name} a été créé!`,
                        fields: [
                            {
                                value: `\`\`\`${role.permissions.toArray()}\`\`\``,
                                name: "Permissions:"
                            }
                        ],
                        color: role.color,
                        timestamp: new Date().toISOString()
                    }
                ]
            });
        } catch (e) {
            (role.client as FiiClient).logger.error(
                `Can't send logs in ${role.guild.name} (${role.guild.id}): ${e}`,
                "roleCreate"
            );
        }
    }
});
