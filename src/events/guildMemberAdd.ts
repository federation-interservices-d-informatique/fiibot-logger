import { clientEvent } from "@federation-interservices-d-informatique/fiibot-common";
import { Colors, GuildMember, PartialGuildMember } from "discord.js";
import { sendLog } from "../utils/sendLogs.js";

export default clientEvent({
    name: "lognewmembers",
    type: "guildMemberAdd",
    callback: async (member: GuildMember | PartialGuildMember): Promise<void> => {
        if (member.partial) await member.fetch();

        await sendLog(member.guild, {
            title: "Quelqu'un a rejoint le serveur!",
            description: `${member.user.username} a rejoint le serveur`,
            color: Colors.Green,
            timestamp: new Date().toISOString(),
            fields: [
                {
                    name: "Date de création du compte",
                    value: member.user.createdAt.toString()
                },
                {
                    name: "Identifiant",
                    value: member.user.id
                }
            ],
            author: {
                icon_url: member.user.displayAvatarURL(),
                name: member.user.username
            }
        });
    }
});
