import {
    FiiClient,
    clientEvent
} from "@federation-interservices-d-informatique/fiibot-common";
import { AuditLogEvent, Colors, GuildMember } from "discord.js";
import { getLogChan } from "../utils/getLogChan.js";

export default clientEvent({
    name: "logbans",
    type: "guildBanAdd",
    callback: async (member: GuildMember): Promise<void> => {
        if (member.user.partial) await member.user.fetch();
        if (member.user.id === member.client.user.id) return;
        const logchan = await getLogChan(
            member.client as FiiClient,
            member.guild
        );
        if (!logchan) return;
        let event;
        try {
            const log = await member.guild.fetchAuditLogs({
                type: AuditLogEvent.MemberBanAdd,
                limit: 1
            });
            event = log.entries.first();
        } catch (e) {
            (member.client as FiiClient).logger.error(
                `Can't fetch audit logs of ${member.guild.name} (${member.guild.id}): ${e}`,
                "guildBanAdd"
            );
        }
        try {
            await logchan.send({
                embeds: [
                    {
                        timestamp: new Date().toISOString(),
                        title: "Un(e) utilisateur/trice a été banni(e)!",
                        description: `L'utilisateur/trice ${member.user.tag}(${member.user.id}) a été banni(e)!`,
                        fields: [
                            {
                                value: event?.executor?.tag
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
                        color: Colors.Red
                    }
                ]
            });
        } catch (e) {
            (member.client as FiiClient).logger.error(
                `Can't send logs in ${member.guild.name} (${member.guild.id}): ${e}`,
                "guildBanAdd"
            );
        }
    }
});
