import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed } from 'discord.js';

const assignable_roles = [
  "721861639003045928"
]

export default {
  data: new SlashCommandBuilder().setName('iam').setDescription("Assign yourself to a role")
    .addRoleOption(option => option.setName('role').setDescription("Role to add").setRequired(true)),
  
  async command(interaction: CommandInteraction) {
    const guild = interaction.guild
    if (!guild) return await interaction.reply({embeds: [new MessageEmbed().setDescription("Couldn't find guild").setColor("#ff7675")], ephemeral: true})
    if (!interaction.member) return await interaction.reply({embeds: [new MessageEmbed().setDescription("Couldn't find member").setColor("#ff7675")], ephemeral: true})
    if (!guild.me?.permissions.has("MANAGE_ROLES")) return await interaction.reply({embeds: [new MessageEmbed().setDescription("I don't have permission to do that").setColor("#ff7675")], ephemeral: true})
    const member = await guild.members.fetch(interaction.member.user.id)

    const opts = interaction.options.data;
    if (!opts) return await interaction.reply({embeds: [new MessageEmbed().setDescription("Invalid options").setColor("#ff7675")], ephemeral: true})
    const role = (opts.find(o => o.name === "role") as string | undefined)
    if (!role) return await interaction.reply({embeds: [new MessageEmbed().setDescription("Invalid options").setColor("#ff7675")], ephemeral: true})

    if (!assignable_roles.includes(role)) return await interaction.reply({embeds: [new MessageEmbed().setDescription(`This role cannot be assigned`).setColor("#ff7675")], ephemeral: true})
    if (member.roles.cache.has(role)) return await interaction.reply({embeds: [new MessageEmbed().setDescription(`You're already a member of that role`).setColor("#ff7675")], ephemeral: true})

    try {
      member.roles.add(role);
      return await interaction.reply({embeds: [new MessageEmbed().setDescription(`Successfully added to <@&${role}>`).setColor("#55efc4")], ephemeral: true})
    } catch {
      return await interaction.reply({embeds: [new MessageEmbed().setDescription("An unknown error occured").setColor("#ff7675")], ephemeral: true})
    }
  }
}