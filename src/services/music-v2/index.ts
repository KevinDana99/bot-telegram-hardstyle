import axios from "axios";
import config from "../../config/index.js";
interface DownloadResult {
  soundTrack: Buffer;
  durationTrack: number;
}
export const search = async (query: string) => {
  try {
    const req = await fetch(
      `${config.API_HOST}/api/music/search?q=${encodeURIComponent(query)}`,
    );
    const res = await req.json();
    return res;
  } catch (err) {
    console.log(err);
  }
};
export const download = async (
  artist: string,
  title: string,
  ctx: any,
): Promise<DownloadResult> => {
  const startTime = Date.now();

  try {
    const url = `${config.API_HOST}/api/music/download?title=${encodeURIComponent(title)}&artist=${encodeURIComponent(artist)}`;

    const patchResponse = await axios({
      method: "get",
      url: url,
      responseType: "json", // Axios parseará el JSON automáticamente
    });
    const response = await patchResponse.data;
    const durationTrack = parseInt(response.meta_data.duration.seconds);
    console.log({ response });

    let loaded = 0;
    let count = 0;
    let message: any;
    let intervalTime: NodeJS.Timeout;
    const clock = ["🕛", "🕒", "🕕", "🕘"][Math.floor(Date.now() / 10000) % 4];
    const sendDownloadMessage = async () => {
      const notifyTime = async () => {
        const total = parseInt(response.meta_data.size);

        const elapsedTime = (Date.now() - startTime) / 1000; // segundos
        const speed = loaded / elapsedTime; // bytes/seg
        const eta = (total - loaded) / speed;
        if (count === 0) {
          message = await ctx.reply(
            `Descargando ${artist} - ${title}..

${clock} Tu descarga estara lista en ${Math.ceil(eta / 60)} min aprox`,
          );
        } else {
          try {
            message = await ctx.telegram.editMessageText(
              ctx.chat.id,
              message.message_id,
              undefined,
              `Descargando ${artist} - ${title}..

${clock} Tu descarga estara lista en ${Math.ceil(eta / 60)} min aprox`,
            );
          } catch (err) {
            if (
              err.response?.description?.includes("message is not modified")
            ) {
              return;
            }
            console.error("Error al editar:", err.description);
          }
        }
        count = 1;
      };
      notifyTime();
      intervalTime = setInterval(notifyTime, 5000);
    };
    //setTimeout(sendDownloadMessage, 300);

    const soundTrack = response.audio_track;

    return { soundTrack, durationTrack };
  } catch (err) {
    console.error("Error en la descarga del bot:", err);
    throw err;
  }
};

const MusicService = {
  download,
  search,
};
export default MusicService;
