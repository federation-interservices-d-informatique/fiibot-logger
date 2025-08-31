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
    name: "logbans",
    type: "guildBanAdd",
    callback: async (ban: GuildBan): Promise<void> => {
        if (ban.user.id === ban.client.user.id) return;

        // Fetch audit logs to get informations about the moderator
        let event: GuildAuditLogsEntry<AuditLogEvent.MemberBanAdd> | undefined;
        try {
            const log = await ban.guild.fetchAuditLogs({
                type: AuditLogEvent.MemberBanAdd,
                limit: 1
            });
            event = log.entries.first();
        } catch (e) {
            if (e instanceof Error)
                (ban.client as FiiClient).logger.error(
                    `Can't fetch audit logs of ${ban.guild.name} (${ban.guild.id}): ${e}`,
                    "guildBanAdd"
                );
        }

        await sendLog(ban.guild, {
            timestamp: new Date().toISOString(),
            title: "Sanctions",
            description: `${ban.user.tag}(${ban.user.id}) vient de se faire bannir!`,
            fields: [
                {
                    value: event?.executor?.tag
                        ? `\`${event.executor.tag} (${event.executor.id})\``
                        : "Inconnu",
                    name: "Sanction par:"
                },
                {
                    value: `\`${event?.reason ?? "Aucune raison fournie"}\``,
                    name: "Raison:"
                }
            ],
            color: Colors.Red
        });
    }
});
