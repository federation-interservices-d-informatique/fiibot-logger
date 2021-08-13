import { fiiClient } from "@federation-interservices-d-informatique/fiibot-common";
import { GuildMember } from "discord.js";
import { EventData } from "../typings/eventData";
import { getLogChan } from "../utils/getLogChan.js";

const data: EventData = {
    name: "lognewmembers",
    type: "guildMemberAdd",
    callback: async (member: GuildMember): Promise<void> => {
        const logchan = await getLogChan(
            member.client as fiiClient,
            member.guild
        );
        if (!logchan) return;
        logchan.send({
            embeds: [
                {
                    title: "Un(e) utilisateur/trice a rejoint le serveur!",
                    description: `${member.user.username} a rejoint le serveur`,
                    color: "GREEN",
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
                        iconURL: member.user.avatarURL(),
                        name: member.user.username
                    }
                }
            ]
        });
    }
};
export default data;
