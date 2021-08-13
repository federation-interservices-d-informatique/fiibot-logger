import { fiiClient } from "@federation-interservices-d-informatique/fiibot-common";
import { Guild } from "discord.js";

/**
 * Get the logchannel of a guild
 */
export const getLogChan = async (
    client: fiiClient,
    guild: Guild
): Promise<string | null> => {
    const res = await client.dbclient.query(
        "SELECT logchan FROM guild_settings WHERE id = $1",
        [guild.id]
    );
    if (res.rows[0]) {
        return res.rows[0].toString();
    } else {
        return null;
    }
};
