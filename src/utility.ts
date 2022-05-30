import { AutocompleteInteraction, CommandInteraction, CommandInteractionOption, Client, GuildMember, MessageEmbed } from "discord.js";

namespace Util {
  export async function RefreshCache (client: Client, guild_id: string) {
    const guild = await client.guilds.fetch(guild_id);
    guild.roles.fetch()
    guild.members.fetch()
  }

  export interface ICommandOptions {
    readonly mainOption: CommandInteractionOption[] | undefined
    subOption: CommandInteractionOption[] | undefined
    microOption: CommandInteractionOption[] | undefined
  }

  export function FindOptionValue<T extends string | number | boolean> (options: CommandInteractionOption[], search: string): T | undefined {
    const option = options.find(o => o.name === search)
    return option ? option.value as T : undefined
  }
  
  export function ParseOptions (interaction: CommandInteraction | AutocompleteInteraction): ICommandOptions {
    const mainOption = interaction.options.data
    var subOption;
    if (mainOption && mainOption[0]) subOption = mainOption[0].options
    var microOption;
    if (subOption && subOption[0]) microOption = subOption[0].options;
  
    return {
      // @ts-ignore
      mainOption,
      subOption,
      microOption
    }
  }

  export function IsAdmin (member: GuildMember) {
    const dev_ids: string[] = process.env.DEV_IDS?.split(',') || []
    return (dev_ids.includes(member.id) || member.permissions.has("MANAGE_ROLES"));
  }

  export async function ReplySuccess (i: CommandInteraction, reply: string) {
    return await i.reply({embeds: [new MessageEmbed().setDescription(reply).setColor("#ff7675")], ephemeral: true})
  }

  export async function ReplyFailure (i: CommandInteraction, reply: string) {
    return await i.reply({embeds: [new MessageEmbed().setDescription(reply).setColor("#ff7675")], ephemeral: true})
  }
}

export default Util