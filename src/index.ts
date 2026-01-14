import "dotenv/config";
import { Telegraf } from "telegraf";
const BOT_TOKEN = process.env.ACCESS_TOKEN_TELEGRAM_BOT;

if (BOT_TOKEN === undefined || BOT_TOKEN === "") {
  throw new Error("BOT_TOKEN no encontrado. Revisá tu archivo .env");
}
export const bot = new Telegraf(BOT_TOKEN);
