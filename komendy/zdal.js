const fs = require('fs');
const { MessageEmbed } = require('discord.js');

module.exports = {
  name: "zdal",
  desc: "Zdawanie wlki",
  run: async ({ client, message }) => {
    if (!message.content.startsWith('!')) return;

    const args = message.content.slice('!'.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === '') {
      const embed = new MessageEmbed()
        .setColor('#ff0000')
        .setDescription('Podaj oznaczenie użytkownika i ilość błędów: `!zdal @OZNACZ`');
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
    const errors = parseInt(args[1]);
    const ogolnietoBazaDanych = 'baza.json';

    let data = {};
    try {
      data = JSON.parse(fs.readFileSync(ogolnietoBazaDanych));
    } catch (error) {
      console.error('Błąd odczytu pliku:', error);
      data = {};
    }

    if (data[oznaczonyZlomek] && data[oznaczonyZlomek].zdane === 'Tak') {
      const embed = new MessageEmbed()
        .setColor('#ff0000')
        .setDescription(`${oznaczonyZlomek} już ma ZDANE!`);
      message.channel.send(embed);
      return;
    }

    const currentDate = new Date().toISOString(); 
    if (!data[oznaczonyZlomek]) {
      data[oznaczonyZlomek] = { zdane: 'Tak', id_discord: ZlomekID, date: currentDate, kto_zdawal: message.author.id };
    } else {
      //data[oznaczonyZlomek].errors = errors;
      data[oznaczonyZlomek].zdane = 'Tak';
      data[oznaczonyZlomek].date = currentDate;
      data[oznaczonyZlomek].kto_zdawal = message.author;
    }

    if (args[1] === "5") return;

    fs.writeFile(ogolnietoBazaDanych, JSON.stringify(data, null, 2), err => {
      if (err) {
        console.error('Błąd zapisu do pliku:', err);
        return;
      }
      console.log(`Zapisano dane użytkownika ${oznaczonyZlomek}`);
    });

    const embedZdane = new MessageEmbed()
      .setColor('#00ff00')
      .setTitle(`${oznaczonyZlomek} ma ZDANE!`);
    message.channel.send(embedZdane);
  },
};
