import { CommandInteraction } from "discord.js";
import {
    fiiClient,
    Command
} from "@federation-interservices-d-informatique/fiibot-common";
import { getLogChanID } from "../utils/getLogChan.js";
export default class PingCommand extends Command {
    constructor(client: fiiClient) {
        super(
            client,
            {
                name: "resetlogchan",
                description: "Supprimer les logs"
            },
            {
                userPermissions: ["ADMINISTRATOR"],
                guildOnly: true
            }
        );
    }
    async run(inter: CommandInteraction): Promise<void> {
        const chan = await getLogChanID(this.client, inter.guild);

        if (!chan) {
            inter.reply("Aucun canal de logs n'a été défini!");
        } else {
            await this.client.dbclient.query(
                "UPDATE guild_settings SET logchan = NULL WHERE id = $1",
                [inter.guildId]
            );
            inter.reply(`Terminé. Le canal de logs était <#${chan}>`);
        }
    }
}
