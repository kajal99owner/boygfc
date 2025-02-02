const TELEGRAM_BOT_TOKEN = "8043948777:AAGC3kt0oUZ-VeR9_EE8EIbmxh9hCUF12B4"; // Replace with your bot token
const CHANNEL_USERNAME = "@kajal_developer"; // Replace with your channel username

addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  if (request.method === "POST") {
    const update = await request.json();
    if (update.message) {
      await handleMessage(update.message);
    } else if (update.callback_query) {
      await handleCallbackQuery(update.callback_query);
    }
    return new Response("OK");
  }
  return new Response("Not Found", { status: 404 });
}

async function handleMessage(message) {
  const chatId = message.chat.id;
  const text = message.text;

  if (text === "/start") {
    await sendStartMessage(chatId);
  } else if (text === "/join") {
    await handleJoinCommand(chatId, message.message_id);
  }
}

async function sendStartMessage(chatId) {
  const buttons = [
    [{ text: "👨‍💻 Developer", url: "tg://openmessage?user_id=6449612223" }],
    [{ text: "🔊 Updates", url: "https://t.me/addlist/P9nJIi98NfY3OGNk" }],
    [{ text: "✅", callback_data: "/join" }],
  ];

  const messageText = "⭐️ To Usᴇ Tʜɪs Bᴏᴛ Yᴏᴜ Nᴇᴇᴅ Tᴏ Jᴏɪɴ Aʟʟ Cʜᴀɴɴᴇʟs -";
  const photoUrl = "https://t.me/kajal_developer/9";

  await sendPhoto(chatId, photoUrl, messageText, buttons);
}

async function sendPhoto(chatId, photoUrl, caption, buttons) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`;
  const body = {
    chat_id: chatId,
    photo: photoUrl,
    caption: caption,
    parse_mode: "Markdown",
    disable_web_page_preview: true,
    reply_markup: {
      inline_keyboard: buttons,
    },
  };

  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

async function handleJoinCommand(chatId, messageId) {
  await deleteMessage(chatId, messageId);
  await checkUserMembership(chatId);
}

async function deleteMessage(chatId, messageId) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/deleteMessage`;
  const body = {
    chat_id: chatId,
    message_id: messageId,
  };

  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

async function checkUserMembership(chatId) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getChatMember`;
  const body = {
    chat_id: CHANNEL_USERNAME,
    user_id: chatId,
  };

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const result = await response.json();
  const status = result.result.status;

  if (status === "member" || status === "administrator" || status === "creator") {
    await sendVBMenu(chatId);
  } else {
    await sendMessage(chatId, "❌ Must join all channel\n @kajal_developer");
  }
}

async function sendVBMenu(chatId) {
  const keyboard = [
    ["🌺 CP", "🇮🇳 Desi"],
    ["🇬🇧 Forener", "🐕‍🦺 Animal"],
    ["💕 Webseries", "💑 Gay Cp"],
    ["💸 𝘽𝙐𝙔 𝙑𝙄𝙋 💸"],
  ];

  await sendMessage(chatId, "🤗 Welcome to Lx Bot 🌺", keyboard);
}

async function sendMessage(chatId, text, keyboard = null) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  const body = {
    chat_id: chatId,
    text: text,
    reply_markup: keyboard ? { keyboard } : undefined,
  };

  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

async function handleCallbackQuery(callbackQuery) {
  const chatId = callbackQuery.message.chat.id;
  const data = callbackQuery.data;

  if (data === "/join") {
    await handleJoinCommand(chatId, callbackQuery.message.message_id);
  }
      }
