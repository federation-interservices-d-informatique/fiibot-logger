import { FiiClient } from "@federation-interservices-d-informatique/fiibot-common";
import { TextBasedChannel } from "discord.js";

/**
 * Get the logchannel of a guild
 */
export const getLogChanID = async (
    client: FiiClient,
    guildId: string
): Promise<string | null> =>
    client.dbClient?.get<string>(`${guildId}-logchan`) ?? null;

/**
 * Get the logchannel of a guild
 */
export const getLogChan = async (
    client: FiiClient,
    guildId: string
): Promise<TextBasedChannel | null> => {
    const id = await getLogChanID(client, guildId);
    if (!id) return null;
    return (await client.channels.fetch(id)) as TextBasedChannel;
};
