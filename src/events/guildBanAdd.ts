import { fiiClient } from "@federation-interservices-d-informatique/fiibot-common";
import { GuildMember } from "discord.js";
import { EventData } from "../typings/eventData";
import { getLogChan } from "../utils/getLogChan.js";

const data: EventData = {
    name: "logbans",
    type: "guildBanAdd",
    callback: async (member: GuildMember): Promise<void> => {
        if (member.user.partial) await member.user.fetch();
        const logchan = await getLogChan(
            member.client as fiiClient,
            member.guild
        );
        if (!logchan) return;
        const log = await member.guild.fetchAuditLogs({
            type: "MEMBER_BAN_ADD",
            limit: 1
        });
        const event = log.entries.first();

        logchan.send({
            embeds: [
                {
                    timestamp: new Date(),
                    title: "Un(e) utilisateur/trice a été banni(e)!",
                    description: `L'utilisateur/trice ${member.user.tag}(${member.user.id}) a été banni(e)!`,
                    fields: [
                        {
                            value: event.executor?.tag
                                ? `\`${event.executor.tag} (${event.executor.id})\``
                                : "Inconnu",
                            name: "Sanction par:"
                        },
                        {
                            value: `\`${
                                event.reason ?? "Aucune raison fournie"
                            }\``,
                            name: "Raison:"
                        }
                    ],
                    color: "DARK_RED"
                }
            ]
        });
    }
};
export default data;
