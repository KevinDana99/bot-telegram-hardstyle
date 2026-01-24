import { download } from "../../services/music/index.js";
import { bot } from "../index.js";

export const setupActions = () => {
  bot.action(/^info_(.+)$/, async (ctx) => {
    try {
      const trackId = ctx.match[1] as string;
      const keyboard = (
        ctx.callbackQuery.message as any
      ).reply_markup.inline_keyboard.flat();

      const findById = keyboard.find((btn: any) =>
        btn.callback_data.includes(trackId)
      );
      if (!findById) return await ctx.answerCbQuery("No se encontró el track.");

      // Limpiamos el nombre para la búsqueda
      const rawName = findById.text.replace(/^\d+\.\s*/, "").trim();
      const [artist, title] = rawName.includes("-")
        ? rawName.split("-")
        : ["Hardstyle", rawName];

      await ctx.answerCbQuery("🎧 Buscando audio...");
      const processingMsg = await ctx.reply(`📥 Procesando: ${rawName}...`);

      const audioStream = await download(artist.trim(), title.trim());
      console.log({ audioStream });
      if (audioStream) {
        await ctx.replyWithAudio(
          { source: audioStream },
          { title: title, performer: artist }
        );
      }
    } catch (error) {
      console.error("Error en la acción info:", error);
      await ctx.reply("❌ Error al procesar el audio.");
    }
  });
};
