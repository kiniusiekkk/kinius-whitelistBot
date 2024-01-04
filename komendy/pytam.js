const Discord = require('discord.js');

module.exports = {
  name: 'pytam',
  desc: 'Pytanie',
  run: async ({ client, message }) => {
    if (message.member.hasPermission('ADMINISTRATOR')) {
      const embed = new Discord.MessageEmbed()
        .setTitle('Pytanie na whitelist')
        .setDescription('Zaatakuj to pytanie!')
        .setColor('#00ff00')
        .setFooter('Pozdrowienia od Administratora!');
      message.channel.send('@everyone', embed);
    } else {
      message.channel.send('Przepraszam, nie masz uprawnień do wykonywania tej komendy.');
    }
  },
};
