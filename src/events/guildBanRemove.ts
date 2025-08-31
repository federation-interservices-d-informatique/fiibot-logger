import {
    FiiClient,
    clientEvent
} from "@federation-interservices-d-informatique/fiibot-common";
import {
    AuditLogEvent,
    Colors,
    GuildAuditLogsEntry,
    GuildBan
} from "discord.js";
import { sendLog } from "../utils/sendLogs.js";

export default clientEvent({
    name: "logunbans",
    type: "guildBanRemove",
    callback: async (ban: GuildBan): Promise<void> => {
        let event:
            | GuildAuditLogsEntry<AuditLogEvent.MemberBanRemove>
            | undefined;

        try {
            const log = await ban.guild.fetchAuditLogs({
                type: AuditLogEvent.MemberBanRemove,
                limit: 1
            });
            event = log.entries.first();
        } catch (e) {
            if (e instanceof Error)
                (ban.client as FiiClient).logger.error(
                    `Can't fetch audit logs of ${ban.guild.name} (${ban.guild.id}): ${e}`,
                    "guildBanRemove"
                );
        }
        await sendLog(ban.guild, {
            timestamp: new Date().toISOString(),
            title: "Sanctions",
            description: `Le bannissement de ${ban.user.tag}(${ban.user.id}) a été révoqué!`,
            fields: [
                {
                    value: event?.executor?.tag
                        ? `\`${event.executor.tag} (${event.executor.id})\``
                        : "Inconnu",
                    name: "Débanissement par:"
                }
            ],
            color: Colors.DarkGreen
        });
    }
});
