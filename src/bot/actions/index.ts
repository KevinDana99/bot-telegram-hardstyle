// src/bot/actions/index.ts
import { bot } from "../index.js";
import { findMusicByName, getDetails } from "../../services/music";
import { Markup } from "telegraf";

export const setupActions = () => {
  // 1. Action para ver detalles (el que ya teníamos)
  bot.action(/^info_(\d+)$/, async (ctx) => {
    const trackId = ctx.match[1];
    await ctx.answerCbQuery();
    const track = await getDetails(trackId);
    /* const keyboard = Markup.inlineKeyboard([
      [Markup.button.callback("▶️ Descargar y escuchar", `play_${track.id}`)],
    ]);*/

    await ctx.replyWithAudio(track.preview, {
      caption:
        `<b>🎵 ${track.title}</b>\n\n` +
        `👤 <b>Artista:</b> ${track.artist.name}\n` +
        `💿 <b>Álbum:</b> ${track.album.title}\n` +
        `⏱ <b>Duración:</b> ${Math.floor(track.duration / 60)}:${(
          track.duration % 60
        )
          .toString()
          .padStart(2, "0")}\n\n` +
        ``,
      parse_mode: "HTML",
    });
  });

  // 2. NUEVO: Action para reproducir el audio
  bot.action(/^play_(\d+)$/, async (ctx) => {
    const trackId = ctx.match[1];

    // Mostramos un aviso temporal en la parte de arriba de Telegram
    await ctx.answerCbQuery("Preparando audio... 🎧");

    try {
      const track = await getDetails(trackId);

      // Enviamos el archivo de audio directamente desde la URL de Deezer
      await ctx.replyWithAudio(track.preview, {
        title: track.title,
        performer: track.artist.name,
        thumb: track.album.cover_medium, // Opcional: pone la carátula en el reproductor
      });
    } catch (error) {
      console.error(error);
      await ctx.reply("No se pudo obtener el audio de esta canción.");
    }
  });
};
