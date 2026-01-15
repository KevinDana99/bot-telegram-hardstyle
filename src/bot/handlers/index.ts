import { bot } from "../index";
import { aboutCommand, helpCommand, startCommand } from "./commands";

export const setupHandlers = () => {
  bot.start(startCommand);
  bot.help(helpCommand);
  bot.command("about", aboutCommand);
  bot.on("text", async (ctx) => {
    console.log(ctx);
  });
};
