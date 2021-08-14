import { fiiClient } from "@federation-interservices-d-informatique/fiibot-common";
import { GuildMember } from "discord.js";
import { EventData } from "../typings/eventData";
import { getLogChan } from "../utils/getLogChan.js";

const data: EventData = {
    name: "logremovedmembermembers",
    type: "guildMemberRemove",
    callback: async (member: GuildMember): Promise<void> => {
        if (member.user.partial) await member.user.fetch();
        if (member.user.id === member.client.user.id) return;
        const logchan = await getLogChan(
            member.client as fiiClient,
            member.guild
        );
        if (!logchan) return;
        try {
            await logchan.send({
                embeds: [
                    {
                        title: `Ohh... ${member.user.username} vient de quitter le serveur...`,
                        color: "RED",
                        author: {
                            iconURL: member.user.avatarURL(),
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
            (member.client as fiiClient).logger.error(
                `Can't send logs in ${member.guild.name} (${member.guild.id})`,
                "guildMemberRemove"
            );
        }
    }
};
export default data;
