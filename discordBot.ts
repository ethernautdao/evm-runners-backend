import { Client, TextChannel, GatewayIntentBits } from "discord.js";

const client = new Client({ intents: [GatewayIntentBits.GuildMessages] });

client.on("ready", () => {
  console.log(`Logged in as ${client?.user?.tag}`);
});

async function sendMessage(message: string) {
  const channel = (await client.channels.fetch(
    process.env.CHANNEL_ID ?? ""
  )) as TextChannel;

  if (channel) {
    try {
      await channel.send(message);
    } catch (error) {
      console.error(
        `Error sending message to channel ${process.env.CHANNEL_ID}:`,
        error
      );
    }
  } else {
    console.error(`Channel with ID ${process.env.CHANNEL_ID} not found.`);
  }
}

client
  .login(process.env.BOT_TOKEN)
  .catch((err) => console.error("## BOT LOGIN ERROR ###\n", err));

export { sendMessage };
