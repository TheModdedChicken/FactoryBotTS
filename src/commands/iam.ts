import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from 'discord.js';
import Util from "../utility";

const assignable_roles = [
  "721861639003045928"
]

export default {
  data: new SlashCommandBuilder().setName('iam').setDescription("Assign yourself to a role")
    .addRoleOption(option => option.setName('role').setDescription("Role to add").setRequired(true)),
  
  async command(interaction: CommandInteraction) {
    const guild = interaction.guild
    if (!guild) return await Util.ReplyFailure(interaction, "Couldn't find guild")
    if (!interaction.member) return await Util.ReplyFailure(interaction, "Couldn't find member")
    if (!guild.me?.permissions.has("MANAGE_ROLES")) return await Util.ReplyFailure(interaction, "I don't have permission to do that")
    const member = await guild.members.fetch(interaction.member.user.id)

    const opts = Util.ParseOptions(interaction);
    if (!opts.mainOption) return await Util.ReplyFailure(interaction, "Invalid options")
    const role = Util.FindOptionValue<string>(opts.mainOption, "role")
    if (!role) return await Util.ReplyFailure(interaction, "Invalid options")

    if (!assignable_roles.includes(role)) return await Util.ReplyFailure(interaction, "This role cannot be assigned")
    if (member.roles.cache.has(role)) return await Util.ReplyFailure(interaction, "You're already a member of that role")

    try {
      member.roles.add(role);
      return await Util.ReplySuccess(interaction, `Successfully added to <@&${role}>`)
    } catch {
      return await Util.ReplyFailure(interaction, "An unknown error occured")
    }
  }
}
