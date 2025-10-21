const { 
  Client, 
  GatewayIntentBits, 
  EmbedBuilder, 
  ButtonBuilder, 
  ActionRowBuilder, 
  ButtonStyle,
  Events,
  InteractionType
} = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages
  ],
  partials: ['CHANNEL']
});

const baseUrl = "https://your-app.test/index.html?data=";

client.once('ready', () => {
  console.log(`✅ Logged in as ${client.user.tag}`);

  const channelId = 'YOUR_CHANNEL_ID';
  const channel = client.channels.cache.get(channelId);

  if (channel) {
    const embed = new EmbedBuilder()
      .setTitle("بدء الأختبار")
      .setDescription("اضغط على الزر أدناه للحصول على رابط الاختبار الخاص بك.")
      .setColor("#0099ff");

    const button = new ButtonBuilder()
      .setCustomId("start_test")
      .setLabel("بدء الأختبار")
      .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder().addComponents(button);

    channel.send({ embeds: [embed], components: [row] });
  }
});

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isButton()) return;

  if (interaction.customId === 'start_test') {
    const user = interaction.user;

    const userData = {
      id: user.id,
      name: user.username,
      avatar: user.displayAvatarURL({ format: 'png', size: 1024 })
    };

    const encoded = Buffer.from(JSON.stringify(userData)).toString('base64');
    const fullLink = `${baseUrl}${encoded}`;

    try {
      await user.send(`🧪 رابط الاختبار الخاص بك:\n ${fullLink}`);
      await interaction.reply({ content: "📩 تم إرسال الرابط إلى رسائلك الخاصة.", ephemeral: true });
    } catch (err) {
      console.error("❌ Failed to send DM:", err);
      await interaction.reply({ content: "❗ لا يمكن إرسال رسالة خاصة. يرجى التأكد من تفعيل الرسائل الخاصة.", ephemeral: true });
    }
  }
});

client.login('YOUR_TOKEN_HERE');
