import { CommandInteraction } from "discord.js";
import {
    fiiClient,
    Command
} from "@federation-interservices-d-informatique/fiibot-common";
export default class PingCommand extends Command {
    constructor(client: fiiClient) {
        super(
            client,
            {
                name: "logchan",
                description: "Changer le canal des logs",
                options: [
                    {
                        name: "channel",
                        type: "CHANNEL",
                        description: "Le nouveau canal de logs",
                        required: false
                    }
                ]
            },
            {
                userPermissions: ["ADMINISTRATOR"]
            }
        );
    }
    async run(inter: CommandInteraction): Promise<void> {
        const chan = inter.options.get("channel")?.channel;
        if (chan) {
            if (chan.type !== "GUILD_TEXT") {
                inter.reply({
                    ephemeral: true,
                    content: `Le canal <#${chan.id}> n'est pas un canal textuel mais un canal de type ${chan.type}!`
                });
                return;
            }
            await this.client.dbclient.query(
                "INSERT INTO guild_settings (id) VALUES ($1) ON CONFLICT (id) DO UPDATE SET logchan = $2",
                [inter.guild.id.toString(), chan.id]
            );
            inter.reply(`Nouveau canal de logs: ${chan.toString()}`);
        } else {
            const row = await this.client.dbclient.query(
                "SELECT logchan FROM guild_settings WHERE id = $1",
                [inter.guildId]
            );
            if (!row.rows[0]) {
                inter.reply("Aucun canal de logs n'a été défini!");
            } else {
                inter.reply(`Le canal de logs est <#${row.rows[0]}>`);
            }
        }
    }
}
