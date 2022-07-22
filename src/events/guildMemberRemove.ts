import {
    clientEvent,
    FiiClient
} from "@federation-interservices-d-informatique/fiibot-common";
import { Colors, GuildMember } from "discord.js";
import { getLogChan } from "../utils/getLogChan.js";

export default clientEvent({
    name: "logremovedmembermembers",
    type: "guildMemberRemove",
    callback: async (member: GuildMember): Promise<void> => {
        if (member.user.partial) await member.user.fetch();
        if (member.user.id === member.client.user.id) return;
        const logchan = await getLogChan(
            member.client as FiiClient,
            member.guild
        );
        if (!logchan) return;
        try {
            await logchan.send({
                embeds: [
                    {
                        title: `Ohh... ${member.user.username} vient de quitter le serveur...`,
                        color: Colors.Red,
                        author: {
                            icon_url: member.user.avatarURL(),
                            name: member.user.username
                        },
                        fields: [
                            {
                                name: "Création du compte",
                                value: member.user.createdAt.toString()
                            },
                            {
                                name: "ID",
                                value: member.user.id
                            }
                        ]
                    }
                ]
            });
        } catch (e) {
            (member.client as FiiClient).logger.error(
                `Can't send logs in ${member.guild.name} (${member.guild.id}): ${e}`,
                "guildMemberRemove"
            );
        }
    }
});
