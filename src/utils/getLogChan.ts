import { fiiClient } from "@federation-interservices-d-informatique/fiibot-common";
import { Guild, TextChannel } from "discord.js";

/**
 * Get the logchannel of a guild
 */
export const getLogChanID = async (
    client: fiiClient,
    guild: Guild
): Promise<string | null> => {
    return await client.dbclient.get<string>(`${guild.id}-logchan`);
};
/**
 * Get the logchannel of a guild
 */
export const getLogChan = async (
    client: fiiClient,
    guild: Guild
): Promise<TextChannel | null> => {
    const id = await getLogChanID(client, guild);
    if (!id) return null;
    return (await client.channels.fetch(id)) as TextChannel;
};
