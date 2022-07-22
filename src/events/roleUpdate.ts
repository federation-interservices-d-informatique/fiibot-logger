import {
    clientEvent,
    FiiClient
} from "@federation-interservices-d-informatique/fiibot-common";
import { Role } from "discord.js";
import { getLogChan } from "../utils/getLogChan.js";

export default clientEvent({
    name: "logupdatedroles",
    type: "roleUpdate",
    callback: async (old: Role, now: Role): Promise<void> => {
        const logchan = await getLogChan(now.client as FiiClient, now.guild);
        if (!logchan) return;
        const fields = [];
        old.name != now.name
            ? fields.push({ name: "Ancien nom:", value: `\`${old.name}\`` })
            : "";
        old.mentionable != now.mentionable
            ? fields.push({
                  name: `Le role ${
                      old.mentionable
                          ? "n'est plus mentionnable"
                          : "est devenu mentionnable"
                  }`,
                  value: "** **"
              })
            : "";
        old.hexColor != now.hexColor
            ? fields.push({
                  name: "Le role à changé de couleur!",
                  value: `Ancienne: \`${old.hexColor}\`\nNouvelle: \`${now.hexColor}\``
              })
            : "";
        old.permissions != now.permissions
            ? fields.push({
                  name: "Le role à changé de permissions!",
                  value: `Anciennes:${
                      old.permissions.toArray().length == 0
                          ? "Aucune"
                          : old.permissions
                                .toArray()
                                .map((p) => `\`${p}\``)
                                .toString()
                  }\nNouvelles: ${
                      now.permissions.toArray().length == 0
                          ? "Aucune"
                          : now.permissions
                                .toArray()
                                .map((p) => `\`${p}\``)
                                .toString()
                  }`
              })
            : "";
        try {
            await logchan.send({
                embeds: [
                    {
                        title: "Un role a été modifié!",
                        description: `Le role ${now.name} a été modifié!`,
                        color: now.color,
                        timestamp: new Date().toISOString(),
                        fields: fields
                    }
                ]
            });
        } catch (e) {
            (now.client as FiiClient).logger.error(
                `Can't send logs in ${now.guild.name} (${now.guild.id}): ${e}`,
                "roleUpdate"
            );
        }
    }
});
