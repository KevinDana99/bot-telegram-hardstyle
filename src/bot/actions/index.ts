import { download } from "../../services/music-v2/index.js";
import { bot } from "../index.js";

export const setupActions = () => {
  bot.action(/^info_(.+)$/, async (ctx) => {
    try {
      const trackId = ctx.match[1] as string;
      const keyboard = (
        ctx.callbackQuery.message as any
      ).reply_markup.inline_keyboard.flat();

      const findById = keyboard.find((btn: any) =>
        btn.callback_data.includes(trackId),
      );
      if (!findById) return await ctx.answerCbQuery("No se encontró el track.");

      const rawName = findById.text.replace(/^\d+\.\s*/, "").trim();
      const [artist, title] = rawName.includes("-")
        ? rawName.split("-")
        : ["Hardstyle", rawName];

      downloadProcess(ctx, artist.trim(), title.trim());
    } catch (error) {
      console.error("Error en la acción info:", error);
      await ctx.reply("❌ Error al iniciar la descarga.");
    }
  });
};

// Función separada para manejar la descarga pesada
async function downloadProcess(ctx: any, artist: string, title: string) {
  try {
    const audio = await download(artist, title, ctx);
    if (audio) {
      const desctiption = `${artist} - ${title}`;
      await ctx.replyWithAudio(
        {
          url: audio.soundTrack,
          filename: `${desctiption}.mp3`,
        },
        {
          duration: audio.durationTrack,
          title: desctiption,
          performer: artist,
          caption: `✅ ¡Listo! <b>${artist} - ${title}</b>`,
          parse_mode: "HTML",
        },
      );
    } else {
      await ctx.reply("❌ El audio llegó vacío. Intenta de nuevo.");
    }
  } catch (err) {
    console.error("❌ Error en descarga de fondo:", err);
    await ctx.reply("❌ Hubo un error al descargar el archivo.");
  }
}
