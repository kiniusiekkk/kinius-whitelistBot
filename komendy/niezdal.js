const fs = require('fs');
const { MessageEmbed } = require('discord.js');

module.exports = {
  name: "niezdal",
  desc: "Niezaliczenie egzaminu",
  run: async ({ client, message }) => {
    if (!message.content.startsWith('!')) return;

    const args = message.content.slice('!'.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === '') {
      const embed = new MessageEmbed()
        .setColor('#ff0000')
        .setDescription('Podaj oznaczenie użytkownika: `!niezdal @OZNACZ`');
      message.channel.send(embed);
      return;
    }

    const mentionedUser = message.mentions.users.first();
    if (!mentionedUser) {
      const embed = new MessageEmbed()
        .setColor('#ff0000')
        .setDescription('Nie oznaczono użytkownika!');
      message.channel.send(embed);
      return;
    }

    const oznaczonyZlomek = mentionedUser.tag;
    const ZlomekID = mentionedUser.id;

    const ogolnietoBazaDanych = 'baza.json';

    let data = {};
    try {
      data = JSON.parse(fs.readFileSync(ogolnietoBazaDanych));
    } catch (error) {
      console.error('Błąd odczytu pliku:', error);
      data = {};
    }
    const currentDate = new Date().toISOString(); 
    if (!data[oznaczonyZlomek]) {
      data[oznaczonyZlomek] = { zdane: 'Nie', id_discord: ZlomekID, kto_zdawal: message.author.id, date: currentDate,};
    } else {
      if (data[oznaczonyZlomek].zdane === 'Tak') {
        const embed = new MessageEmbed()
          .setColor('#ff0000')
          .setDescription(`${oznaczonyZlomek} ma już zdane.`);
        message.channel.send(embed);
        return;
      }
    }

    fs.writeFile(ogolnietoBazaDanych, JSON.stringify(data, null, 2), err => {
      if (err) {
        console.error('Błąd zapisu do pliku:', err);
        return;
      }
      console.log(`Zapisano dane użytkownika ${oznaczonyZlomek}`);
    });

    const embed = new MessageEmbed()
      .setColor('ff0000')
      .setTitle(`${oznaczonyZlomek} ma NIEZDANE!`);
    message.channel.send(embed);
  },
};
