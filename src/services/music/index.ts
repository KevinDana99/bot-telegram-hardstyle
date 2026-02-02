let results = [] as any;
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
export const download = async (artist: string, title: string) => {
  try {
    const url = `https://e100c0fa6055.ngrok-free.app/api/music/download?title=${encodeURIComponent(title)}&artist=${encodeURIComponent(artist)}`;
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const soundTrack = Buffer.from(arrayBuffer);
    const durationTrack = parseInt(
      response.headers.get("duration-track") || "0",
    );
    if (!response.ok) throw new Error("La API falló al dar la respuesta");
    if (!response.body)
      throw new Error("No se pudo obtener el cuerpo de la respuesta");
    return { soundTrack, durationTrack };
  } catch (err) {
    console.error(err);
    throw err;
  }
};
