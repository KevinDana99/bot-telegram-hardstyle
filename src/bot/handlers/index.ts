import { Markup } from "telegraf";
import { findMusicByName } from "../../services/music";
import { bot } from "../index";
import { aboutCommand, helpCommand, startCommand } from "./commands";

export const setupHandlers = () => {
  bot.start(startCommand);
  bot.help(helpCommand);
  bot.command("about", aboutCommand);
  bot.on("text", async (ctx) => {
    const message = ctx.message.text;
    if (message.startsWith("/")) {
      return ctx.reply(
        "❌ Ese comando no existe. Escribí /help para ver qué puedo hacer."
      );
    }
    await ctx.reply(`🔎 Buscando música relacionada con: "${message}"...`);
    try {
      const results = await findMusicByName(message);
      const buttons = results
        .slice(0, 5)
        .map((result) => [
          Markup.button.callback(
            `🎵 ${result.title} - ${result.artist.name}`,
            `info_${result.id}`
          ),
        ]);
      await ctx.reply(
        "estos son tus resultados de busqueda:",
        Markup.inlineKeyboard(buttons)
      );
    } catch (err) {
      await ctx.reply(`${err}`);
    }
    console.log(ctx);
  });
};
//"Ups, algo salió mal con la búsqueda."
