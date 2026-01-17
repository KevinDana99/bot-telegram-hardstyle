import "dotenv/config";
import { bot } from "./bot/index.js";
import { setupHandlers } from "./bot/handlers/index.js";
import { setupActions } from "./bot/actions/index.js";

async function initBot() {
  try {
    // 1. Cargamos los Handlers (Comandos y Texto)
    setupHandlers();
    console.log("📝 Handlers registrados");

    // 2. Cargamos las Actions (Botones y Callbacks)
    setupActions();
    console.log("🔘 Actions registradas");

    // 3. Configuramos el menú de comandos en la interfaz de Telegram
    await bot.telegram.setMyCommands([
      { command: "start", description: "🚀 Iniciar el bot" },
      { command: "help", description: "📖 Guía de uso" },
      { command: "about", description: "ℹ️ Sobre este proyecto" }, // ESTO es lo que activa la sugerencia
    ]);
    await bot.launch();
    console.log("🚀 ¡Bot de Música Online y escuchando!");
  } catch (error) {
    console.error("❌ Error al iniciar el bot:", error);
    process.exit(1);
  }
}

initBot();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
