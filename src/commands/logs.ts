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
                name: "logs",
                description: "Gérer le système de logs",
                options: [
                    {
                        type: "SUB_COMMAND",
                        name: "enable",
                        description: "Activers les logs",
                        options: [
                            {
                                type: "CHANNEL",
                                name: "salon",
                                description: "Le salon de logs",
                                required: true,
                                channelTypes: ["GUILD_TEXT"]
                            }
                        ]
                    },
                    {
                        type: "SUB_COMMAND",
                        name: "disable",
                        description: "Désactiver les logs"
                    },
                    {
                        type: "SUB_COMMAND",
                        name: "channel",
                        description: "Obtenir le nom du salon de logs"
                    }
                ]
            },
            {
                userPermissions: ["ADMINISTRATOR"],
                guildOnly: true
            }
        );
    }
    async run(inter: CommandInteraction): Promise<void> {
        if (inter.options.getSubcommand() === "enable") {
            const chan = inter.options.get("salon")?.channel;

            await this.client.dbclient.set(`${inter.guildId}-logchan`, chan.id);
            inter.reply({
                ephemeral: true,
                content: `Nouveau canal de logs: ${chan.toString()}`
            });
        } else if (inter.options.getSubcommand() === "channel") {
            const chan = await getLogChanID(this.client, inter.guild);
            if (!chan) {
                inter.reply({
                    ephemeral: true,
                    content: "Aucun canal de logs n'a été défini!"
                });
            } else {
                inter.reply({
                    ephemeral: true,
                    content: `Le canal de logs est <#${chan}>`
                });
            }
        } else {
            const chan = await getLogChanID(this.client, inter.guild);
            if (!chan) {
                await inter.reply("Aucun canal n'était défini!");
                return;
            }
            await this.client.dbclient.delete(`${inter.guildId}-logchan`);
            inter.reply({
                ephemeral: true,
                content: `Terminé. Le canal de logs était <#${chan}>`
            });
        }
    }
}
