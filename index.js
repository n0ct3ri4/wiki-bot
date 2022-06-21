const wiki = require("wikipedia").default;
const colors = require("colors/safe");
const Discord = require("discord.js");
const fs = require("fs");
const os = require("os");
var prefix = "w!";
var TOKEN = "";

const client = new Discord.Client();

client.on("ready", () => {
  // set client activity
  client.user.setActivity("w!help", { type: "PLAYING" });
  console.log(colors.cyan(client.user.tag), "is now ready!");
  console.log(`↳ ${colors.yellow("Memory")} > ${os.totalmem() / 1024 / 1024}`);
  console.log(`↳ ${colors.yellow("Processor")} > ${os.cpus()[0].model}`);
  console.log(`↳ ${colors.yellow("Hostname")} > ${os.hostname()}`);
  console.log(`↳ ${colors.yellow("Architecture")} > ${os.arch()}`);
  console.log(`↳ ${colors.yellow("OS Type")} > ${os.type()}`);
});

client.on("message", (msg) => {
  var words = msg.content.split(" ");
  var cmd = words[0].slice(prefix.length).toLowerCase();
  var args = words.slice(1);

  if (cmd == `help`) {
    msg.channel.send(
      new Discord.MessageEmbed({
        title: "Need help?",
        description: "WikiBot - Search things on wikipedia via Discord.",
        fields: [
          {
            name: "Utilities",
            value: `\`${prefix}help\` > *View this page.*
\`${prefix}invite\` > *Invite WikiBot on your servers.*
\`${prefix}vote\` > *Vote for the bot via Top.GG.*`,
            inline: true,
          },
          {
            name: "Wikipedia",
            value: `\`${prefix}search <something>\` > *Start searching something.*
\`${prefix}save <something>\` > *Save a search in a MarkDown file.*`,
            inline: true,
          },
        ],
        color: "YELLOW",
        footer: {
          iconURL: msg.author.displayAvatarURL({
            dynamic: false,
            format: "png",
            size: 512,
          }),
          text: msg.author.tag,
        },
      })
    );
  } else if (cmd == `search`) {
    let title = null;
    let content = null;
    let url = null;
    let search = null;
    let page = null;

    (async () => {
      try {
        search = await wiki.search(`${args.join(" ")}`);
        page = await wiki.page(`${search.results[0].title}`);
        title = page.title;
        summary = await page.summary().title;
        content = await page.content();
        url = page.fullurl;
      } catch (error) {
        msg.reply(`Sorry, I can't find this page.`);
      }
    })().then(() => {
      // console.log(page);
      msg.channel.send(
        new Discord.MessageEmbed({
          title: `Search result for "${title}"`,
          description: `${content.slice(0, 200)}... [More](${url})`,
          color: "GREEN",
          footer: {
            iconURL: msg.author.displayAvatarURL({
              dynamic: false,
              format: "png",
              size: 512,
            }),
            text: msg.author.tag,
          },
        })
      );
    });
  } else if (cmd == "invite") {
    msg.channel.send(
      "https://discord.com/api/oauth2/authorize?client_id=844773791640977418&permissions=306240&scope=bot"
    );
  } else if (cmd == "save") {
    let title = null;
    let content = null;
    let search = null;
    let page = null;

    (async () => {
      try {
        search = await wiki.search(`${args.join(" ")}`);
        page = await wiki.page(`${search.results[0].title}`);
        title = page.title;
        summary = await page.summary().title;
        content = await page.content();
        url = page.fullurl;
      } catch (error) {
        msg.reply(`Sorry, I can't find this page.`);
      }
    })().then(() => {
      fs.writeFile(
        `./_cache/saved/${title}.md`,
        fs
          .readFileSync("./template.md", "utf-8")
          .replace("[title]", title)
          .replace("[desc]", content)
          .toString(),
        (err) => {
          if (err) throw err;
          msg.channel.send(
            new Discord.MessageAttachment(
              fs.readFileSync(`./_cache/saved/${title}.md`),
              `${title}.md`
            )
          );
        }
      );
    });
  } else if (cmd == "vote") {
    msg.channel.send("https://top.gg/bot/844773791640977418/vote");
  } else if (cmd == "invite") {
    msg.channel.send(
      "https://discord.com/api/oauth2/authorize?client_id=844773791640977418&permissions=306240&scope=bot"
    );
  }
});

client.login(TOKEN);
