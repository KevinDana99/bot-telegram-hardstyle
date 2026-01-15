import { bot } from "../";

export const setupActions = () => {
  bot.action(/download_(.+)/, async (ctx) => {
    const songId = ctx.match[1];
    await ctx.answerCbQuery("Descargando...");
    // Lógica para enviar el audio
  });
};
