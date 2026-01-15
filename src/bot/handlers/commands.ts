import { Context } from "telegraf";

export const startCommand = async (ctx: Context) => {
  const user = ctx.from?.first_name ?? "Melómano";
  await ctx.reply(
    `¡Hola ${user}! 👋\n\nBienvenido a **MusicBot**.\n\nEscribí el nombre de una canción, artista o álbum y te ayudaré a encontrarlo.`
  );
};

export const helpCommand = async (ctx: Context) => {
  const helpText = `
📖 *Guía de Ayuda*

1️⃣ Escribí el nombre de una canción directamente.
2️⃣ El bot te mostrará una lista de resultados.
3️⃣ Seleccioná uno para descargar el audio.

*Comandos:*
/start - Reiniciar el bot
/help - Ver este mensaje
/about - Info sobre el desarrollador
  `;
  await ctx.reply(helpText, { parse_mode: "Markdown" });
};

export const aboutCommand = async (ctx: Context) => {
  await ctx.reply(
    "Bot creado con Node, Typescript, Telegraf y mucho café terere.♥"
  );
};
