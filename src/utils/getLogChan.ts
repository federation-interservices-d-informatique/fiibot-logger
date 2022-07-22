import { FiiClient } from "@federation-interservices-d-informatique/fiibot-common";
import { Guild, TextChannel } from "discord.js";

/**
 * Get the logchannel of a guild
 */
export const getLogChanID = async (
    client: FiiClient,
    guild: Guild
): Promise<string | null> => {
    return await client.dbClient.get<string>(`${guild.id}-logchan`);
};
/**
 * Get the logchannel of a guild
 */
export const getLogChan = async (
    client: FiiClient,
    guild: Guild
): Promise<TextChannel | null> => {
    const id = await getLogChanID(client, guild);
    if (!id) return null;
    return (await client.channels.fetch(id)) as TextChannel;
};
