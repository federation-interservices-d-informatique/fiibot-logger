import { clientEvent } from "@federation-interservices-d-informatique/fiibot-common";
import { Colors, GuildMember, PartialGuildMember } from "discord.js";
import { sendLog } from "../utils/sendLogs.js";

export default clientEvent({
    name: "logremovedmembermembers",
    type: "guildMemberRemove",
    callback: async (
        member: GuildMember | PartialGuildMember
    ): Promise<void> => {
        if (member.user.partial) await member.user.fetch();

        // Don't log fiibot leaves
        if (member.user.id === member.client.user?.id) return;

        sendLog(member.guild, {
            title: `Ohh... ${member.user.username} vient de quitter le serveur...`,
            color: Colors.Red,
            timestamp: new Date().toISOString(),
            author: {
                icon_url: member.user.displayAvatarURL(),
                name: member.user.username
            },
            fields: [
                {
                    name: "Création du compte",
                    value: member.user.createdAt.toString()
                },
                {
                    name: "Identifiant",
                    value: member.user.id
                }
            ]
        });
    }
});
