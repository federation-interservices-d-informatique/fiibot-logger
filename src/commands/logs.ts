import {
    ApplicationCommandOptionType,
    ChannelType,
    ChatInputCommandInteraction
} from "discord.js";
import {
    FiiClient,
    BotInteraction
} from "@federation-interservices-d-informatique/fiibot-common";
import { getLogChanID } from "../utils/getLogChan.js";
export default class PingCommand extends BotInteraction {
    constructor(client: FiiClient) {
        super(client, {
            name: "logs",
            description: "Gérer le système de logs",

            options: [
                {
                    type: ApplicationCommandOptionType.Subcommand,
                    name: "enable",
                    description: "Activers les logs",
                    options: [
                        {
                            type: ApplicationCommandOptionType.Channel,
                            name: "salon",
                            description: "Le salon de logs",
                            required: true,
                            channelTypes: [ChannelType.GuildText]
                        }
                    ]
                },
                {
                    type: ApplicationCommandOptionType.Subcommand,
                    name: "disable",
                    description: "Désactiver les logs"
                },
                {
                    type: ApplicationCommandOptionType.Subcommand,
                    name: "channel",
                    description: "Obtenir le nom du salon de logs"
                }
            ],
            dmPermission: false,
            defaultMemberPermissions: ["Administrator"]
        });
    }
    async runChatInputCommand(
        inter: ChatInputCommandInteraction
    ): Promise<void> {
        if (!inter.guildId) return;
        if (inter.options.getSubcommand() === "enable") {
            const chan = inter.options.get("salon")?.channel;

            await this.client.dbClient?.set(
                `${inter.guildId}-logchan`,
                chan?.id
            );
            inter.reply({
                ephemeral: true,
                content: `Nouveau canal de logs: ${chan?.toString()}`
            });
        } else if (inter.options.getSubcommand() === "channel") {
            const chan = await getLogChanID(this.client, inter.guildId);
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
            const chan = await getLogChanID(this.client, inter.guildId);
            if (!chan) {
                await inter.reply("Aucun canal n'était défini!");
                return;
            }
            await this.client.dbClient?.delete(`${inter.guildId}-logchan`);
            inter.reply({
                ephemeral: true,
                content: `Terminé. Le canal de logs était <#${chan}>`
            });
        }
    }
}
