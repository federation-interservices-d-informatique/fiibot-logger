import {
    FiiClient,
    clientEvent
} from "@federation-interservices-d-informatique/fiibot-common";
import {
    AuditLogEvent,
    Colors,
    GuildAuditLogsEntry,
    GuildMember
} from "discord.js";
import { getLogChan } from "../utils/getLogChan.js";

export default clientEvent({
    name: "logunbans",
    type: "guildBanRemove",
    callback: async (member: GuildMember): Promise<void> => {
        if (member.user.partial) await member.user.fetch();
        const logchan = await getLogChan(
            member.client as FiiClient,
            member.guild
        );
        if (!logchan) return;
        let event: GuildAuditLogsEntry<AuditLogEvent.MemberBanRemove>;
        try {
            const log = await member.guild.fetchAuditLogs({
                type: AuditLogEvent.MemberBanRemove,
                limit: 1
            });
            event = log.entries.first();
        } catch (e) {
            (member.client as FiiClient).logger.error(
                `Can't fetch audit logs of ${member.guild.name} (${member.guild.id}): ${e}`,
                "guildBanRemove"
            );
        }
        try {
            await logchan.send({
                embeds: [
                    {
                        timestamp: new Date().toISOString(),
                        title: "Un(e) utilisateur/trice a été débanni(e)!",
                        description: `L'utilisateur/trice ${member.user.tag}(${member.user.id}) a été débanni(e)!`,
                        fields: [
                            {
                                value: event?.executor?.tag
                                    ? `\`${event.executor.tag} (${event.executor.id})\``
                                    : "Inconnu",
                                name: "Débanissement par:"
                            }
                        ],
                        color: Colors.DarkGreen
                    }
                ]
            });
        } catch (e) {
            (member.client as FiiClient).logger.error(
                `Can't send logs in ${member.guild.name} (${member.guild.id}): ${e}`,
                "guildBanRemove"
            );
        }
    }
});
