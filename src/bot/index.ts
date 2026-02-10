import "dotenv/config";
import { Telegraf } from "telegraf";
import config from "../config";
const BOT_TOKEN = config.ACCESS_TOKEN_TELEGRAM_BOT;

if (BOT_TOKEN === undefined || BOT_TOKEN === "") {
  throw new Error("BOT_TOKEN no encontrado. Revisá tu archivo .env");
}
export const bot = new Telegraf(BOT_TOKEN);
