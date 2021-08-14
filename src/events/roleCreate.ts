import { fiiClient } from "@federation-interservices-d-informatique/fiibot-common";
import { Role } from "discord.js";
import { EventData } from "../typings/eventData";
import { getLogChan } from "../utils/getLogChan.js";

const data: EventData = {
    name: "logcreatedroles",
    type: "roleCreate",
    callback: async (role: Role): Promise<void> => {
        const logchan = await getLogChan(role.client as fiiClient, role.guild);
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
                        color: role.hexColor,
                        timestamp: new Date()
                    }
                ]
            });
        } catch (e) {
            (role.client as fiiClient).logger.error(
                `Can't send logs in ${role.guild.name} (${role.guild.id})`,
                "roleCreate"
            );
        }
    }
};
export default data;
