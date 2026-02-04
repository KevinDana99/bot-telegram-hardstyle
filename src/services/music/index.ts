import axios from "axios";
let results = [] as any;
interface DownloadResult {
  soundTrack: Buffer;
  durationTrack: number;
}
export const getAllMusic = async () => {
  const req = await fetch("https://jsonplaceholder.typicode.com/albums");
  const res = await req.json();
  return res;
};
export const search = async (query: string) => {
  try {
    const req = await fetch(
      `http://localhost:3001/api/music/search?q=${encodeURIComponent(query)}`,
    );
    const res = await req.json();
    results = res;
    return res;
  } catch (err) {
    console.log(err);
  }
};
export const findById = async (id: string) => {
  console.log({ results, find: true });
  const result = results.find((res: { id: string }) => res.id === id);
  return result[0];
};
export const download = async (
  artist: string,
  title: string,
  ctx: any,
): Promise<DownloadResult> => {
  const startTime = Date.now();

  try {
    const url = `https://e100c0fa6055.ngrok-free.app/api/music/download?title=${encodeURIComponent(title)}&artist=${encodeURIComponent(artist)}`;

    const response = await axios({
      method: "get",
      url: url,
      responseType: "stream",
    });

    // Axios en Node pone los headers en minúsculas
    const total = parseInt(response.headers["content-length"] || "0", 10);
    const durationTrack = parseInt(
      response.headers["duration-track"] || "0",
      10,
    );

    let loaded = 0;
    const chunks: any[] = [];
    let count = 0;
    let message: any;
    let intervalTime: NodeJS.Timeout;
    const clock = ["🕛", "🕒", "🕕", "🕘"][Math.floor(Date.now() / 10000) % 4];
    const sendDownloadMessage = async () => {
      const notifyTime = async () => {
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
    setTimeout(sendDownloadMessage, 500);
    return new Promise((resolve, reject) => {
      response.data.on("data", (chunk: Buffer) => {
        loaded += chunk.length;
        chunks.push(chunk);

        if (total > 0) {
          console.clear();
        }
      });

      response.data.on("end", () => {
        const soundTrack = Buffer.concat(chunks);
        clearInterval(intervalTime);
        resolve({ soundTrack, durationTrack });
      });

      response.data.on("error", (err: Error) => {
        reject(err);
      });
    });
  } catch (err) {
    console.error("Error en la descarga del bot:", err);
    throw err;
  }
};
