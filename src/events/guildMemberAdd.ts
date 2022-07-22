import {
    clientEvent,
    FiiClient
} from "@federation-interservices-d-informatique/fiibot-common";
import { Colors, GuildMember } from "discord.js";
import { getLogChan } from "../utils/getLogChan.js";

export default clientEvent({
    name: "lognewmembers",
    type: "guildMemberAdd",
    callback: async (member: GuildMember): Promise<void> => {
        if (member.partial) await member.fetch();
        const logchan = await getLogChan(
            member.client as FiiClient,
            member.guild
        );
        if (!logchan) return;
        try {
            await logchan.send({
                embeds: [
                    {
                        title: "Un(e) utilisateur/trice a rejoint le serveur!",
                        description: `${member.user.username} a rejoint le serveur`,
                        color: Colors.Green,
                        fields: [
                            {
                                name: "Date de création de son compte:",
                                value: member.user.createdAt.toString()
                            },
                            {
                                name: "ID",
                                value: member.user.id
                            }
                        ],
                        author: {
                            icon_url: member.user.avatarURL(),
                            name: member.user.username
                        }
                    }
                ]
            });
        } catch (e) {
            (member.client as FiiClient).logger.error(
                `Can't send logs in ${member.guild.name} (${member.guild.id}): ${e}`,
                "guildMemberAdd"
            );
        }
    }
});
