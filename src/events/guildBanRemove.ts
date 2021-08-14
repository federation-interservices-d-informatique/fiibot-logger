import { fiiClient } from "@federation-interservices-d-informatique/fiibot-common";
import { GuildMember } from "discord.js";
import { EventData } from "../typings/eventData";
import { getLogChan } from "../utils/getLogChan.js";

const data: EventData = {
    name: "logunbans",
    type: "guildBanRemove",
    callback: async (member: GuildMember): Promise<void> => {
        if (member.user.partial) await member.user.fetch();
        const logchan = await getLogChan(
            member.client as fiiClient,
            member.guild
        );
        if (!logchan) return;
        let event;
        try {
            const log = await member.guild.fetchAuditLogs({
                type: "MEMBER_BAN_REMOVE",
                limit: 1
            });
            event = log.entries.first();
        } catch (e) {
            (member.client as fiiClient).logger.error(
                `Can't fetch audit logs of ${member.guild.name} (${member.guild.id})`,
                "guildBanRemove"
            );
        }
        try {
            await logchan.send({
                embeds: [
                    {
                        timestamp: new Date(),
                        title: "Un(e) utilisateur/trice a été débanni(e)!",
                        description: `L'utilisateur/trice ${member.user.tag}(${member.user.id}) a été débanni(e)!`,
                        fields: [
                            {
                                value: event.executor?.tag
                                    ? `\`${event.executor.tag} (${event.executor.id})\``
                                    : "Inconnu",
                                name: "Débanissement par:"
                            }
                        ],
                        color: "DARK_GREEN"
                    }
                ]
            });
        } catch (e) {
            (member.client as fiiClient).logger.error(
                `Can't send logs in ${member.guild.name} (${member.guild.id})`,
                "guildBanRemove"
            );
        }
    }
};
export default data;
