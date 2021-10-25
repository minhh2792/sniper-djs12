//Library
const { Client, Intents, MessageEmbed } = require("discord.js");
const client = new Client();

//Config
let PREFIX = "+"

//Shit
const snipes = {};
const editSnipes = {};
const reactionSnipes = {};

const formatEmoji = (emoji) => {
  return !emoji.id || emoji.available
    ? emoji.toString() // bot has access or unicode emoji
    : `[:${emoji.name}:](${emoji.url})`; // bot cannot use the emoji
};

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

client.on("messageReactionRemove", async (reaction, user) => {
  if (reaction.partial) reaction = await reaction.fetch();

  reactionSnipes[reaction.message.channel.id] = {
    user: user,
    emoji: reaction.emoji,
    messageURL: reaction.message.url,
    createdAt: Date.now(),
  };
});

client.on('message', async (message) => {
  let channelID = message.channel.id

  //Snipe
  if (message.content === `${PREFIX}snipe`) {

    const snipe = snipes[channelID];

    if (!snipe) return message.reply("hong có gì ở đây ._.");

    const embed = new MessageEmbed()
      .setAuthor(snipe.author.tag, snipe.author.displayAvatarURL())
      .setColor("FFD5FB")
      .setTimestamp(snipe.createdAt);
    snipe.content ? embed.setDescription(snipe.content) : null;
    snipe.image ? embed.setImage(snipe.image) : null;

    await message.channel.send(embed)
  }

  //edit snipe
  if (message.content === `${PREFIX}editsnipe`) {

    const snipe = editSnipes[channelID];

    if (!snipe) return message.reply("hong có gì ở đây ._.");

    const embed = new MessageEmbed()
      .setAuthor(snipe.author.tag, snipe.author.displayAvatarURL())
      .setDescription(snipe.content)
      .setColor("FFD5FB")
      .setTimestamp(snipe.createdAt);

    await message.channel.send(embed)
  }

  //help
  if (message.content === `${PREFIX}help`) {
    let embed = new MessageEmbed()
      .setAuthor("Danh sách lệnh", client.user.displayAvatarURL())
      .setColor("FFD5FB")
      .addField('`snipe`', 'Xóa tin nhắn vừa xóa')
			.addField('`editsnipe`', 'Xem tin nhắn vừa sửa')
      .setFooter(`Dùng ${PREFIX}<lệnh>`);

    message.channel.send(embed)
  }
});

const token = process.env['TOKEN']

client.login(token);


