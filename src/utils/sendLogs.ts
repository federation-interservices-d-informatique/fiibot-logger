import { FiiClient } from "@federation-interservices-d-informatique/fiibot-common";
import { APIEmbed, Guild } from "discord.js";
import { getLogChan } from "./getLogChan.js";

/**
 * Sends logs in a specified guildId
 */
export const sendLog = async (guild: Guild | null, embed: APIEmbed) => {
    if (!guild) return;
    const logChannel = await getLogChan(guild.client as FiiClient, guild.id);
    if (logChannel) {
        try {
            await logChannel.send({
                embeds: [embed]
            });
        } catch (e) {
            (guild.client as FiiClient).logger.error(
                `Can't send logs in ${guild.name} (${guild.id}): ${e}`,
                "sendLogs"
            );
        }
    }
};
