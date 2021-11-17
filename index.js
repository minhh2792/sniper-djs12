//Library
const { Client, MessageEmbed } = require("discord.js");
const client = new Client();

//Config
let PREFIX = "+"

//Object
const snipes = {};
const editSnipes = {};
const reactionSnipes = {};

client.on("ready", () => {
  console.log(`[sniper] :: Logged in as ${client.user.tag}.`);
  client.user.setActivity(`your message`, {
		type: 'WATCHING'
	});
});

client.on("messageDelete", async (message) => {
  if (!message.content) return; // content is null or deleted embed

  snipes[message.channel.id] = {
    author: message.author,
    content: message.content,
    createdAt: message.createdTimestamp,
    image: message.attachments.first()
      ? message.attachments.first().proxyURL
      : null,
  };
});

client.on("messageUpdate", async (oldMessage, newMessage) => {

  editSnipes[oldMessage.channel.id] = {
    author: oldMessage.author,
    content: oldMessage.content,
    createdAt: newMessage.editedTimestamp,
  };
});

client.on('message', async (message) => {
  let channelID = message.channel.id

  //Snipe
  if (message.content === `${PREFIX}snipe` || message.content === `${PREFIX}s`) {

    const snipe = snipes[channelID];

    if (!snipe) return message.channel.send("deo co gi o day");

    const embed = new MessageEmbed()
      .setAuthor(snipe.author.tag, snipe.author.displayAvatarURL())
      .setColor("C4FE91")
      .setTimestamp(snipe.createdAt);
    snipe.content ? embed.setDescription(snipe.content) : null;
    snipe.image ? embed.setImage(snipe.image) : null;

    await message.channel.send(embed)
  }

  //edit snipe
  if (message.content === `${PREFIX}editsnipe` || message.content === `${PREFIX}es`) {

    const snipe = editSnipes[channelID];

    if (!snipe) return message.channel.send("deo co gi o day");

    const embed = new MessageEmbed()
      .setAuthor(snipe.author.tag, snipe.author.displayAvatarURL())
      .setDescription(snipe.content)
      .setColor("C4FE91")
      .setTimestamp(snipe.createdAt);

    await message.channel.send(embed)
  }

  //help
  if (message.content === `${PREFIX}help`) {
    let embed = new MessageEmbed()
      .setAuthor("Danh sách lệnh", client.user.displayAvatarURL())
      .setColor("C4FE91")
      .addField('`snipe`', 'Xem tin nhắn vừa xóa')
			.addField('`editsnipe`', 'Xem tin nhắn vừa sửa')
      .setTimestamp();

    message.channel.send(embed)
  }
});

const token = process.env['TOKEN']
client.login(token);
