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
        btn.callback_data.includes(trackId),
      );
      if (!findById) return await ctx.answerCbQuery("No se encontró el track.");

      const rawName = findById.text.replace(/^\d+\.\s*/, "").trim();
      const [artist, title] = rawName.includes("-")
        ? rawName.split("-")
        : ["Hardstyle", rawName];

      // 1. Notificamos éxito del clic inmediatamente
      await ctx.answerCbQuery("🎧 Preparando descarga...");
      const processingMsg = await ctx.reply(
        `⏳ Descargando: ${rawName}...\nEsto puede tardar un minuto.`,
      );

      // 2. IMPORTANTE: Lanzamos la descarga SIN 'await' para que el handler de Telegraf termine.
      // Esto evita el Timeout de 90 segundos.

      const downloadTime = downloadProcess(
        ctx,
        artist.trim(),
        title.trim(),
        processingMsg.message_id,
      );
    } catch (error) {
      console.error("Error en la acción info:", error);
      await ctx.reply("❌ Error al iniciar la descarga.");
    }
  });
};

// Función separada para manejar la descarga pesada
async function downloadProcess(
  ctx: any,
  artist: string,
  title: string,
  msgId: number,
) {
  try {
    const audioBuffer = await download(artist, title);
    if (audioBuffer && audioBuffer.soundTrack.length > 0) {
      const desctiption = `${artist} - ${title}`;
      await ctx.replyWithAudio(
        {
          source: audioBuffer.soundTrack,
          filename: `${desctiption}.mp3`,
        },
        {
          duration: audioBuffer.durationTrack,
          title: desctiption,
          performer: artist,
          caption: `✅ ¡Listo! <b>${artist} - ${title}</b>`,
          parse_mode: "HTML",
        },
      );
      await ctx.deleteMessage(msgId).catch(() => {});
    } else {
      await ctx.reply("❌ El audio llegó vacío. Intenta de nuevo.");
    }
  } catch (err) {
    console.error("❌ Error en descarga de fondo:", err);
    await ctx.reply("❌ Hubo un error al descargar el archivo.");
  }
}
