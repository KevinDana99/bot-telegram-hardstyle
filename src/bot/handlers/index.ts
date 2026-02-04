import { Markup } from "telegraf";
import { search } from "../../services/music";
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
        "❌ Ese comando no existe. Escribí /help para ver qué puedo hacer.",
      );
    }
    await ctx.reply(`🔎 Buscando música relacionada con: "${message}"...`);
    try {
      const results: [] = await search(message);
      if (results.length === 0) {
        await ctx.reply("❌ No se encontro ningun resultado para tu busqueda");
        return;
      } else {
        const buttons = results?.map((result) => [
          Markup.button.callback(
            `🎵 ${result.title} - ${result.artist}`,
            `info_${result.id}`,
          ),
        ]);

        await ctx.reply(
          "estos son tus resultados de busqueda:",
          Markup.inlineKeyboard(buttons),
        );
      }
    } catch (err) {
      await ctx.reply(`${err}`);
    }
  });
};
