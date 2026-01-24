let results = [] as any;
export const getAllMusic = async () => {
  const req = await fetch("https://jsonplaceholder.typicode.com/albums");
  const res = await req.json();
  return res;
};
export const search = async (query: string) => {
  try {
    const req = await fetch(
      `http://localhost:3000/api/music/search?q=${encodeURIComponent(query)}`
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
  const response = await fetch(
    `http://localhost:3000/api/music/download?title=${encodeURIComponent(
      title
    )}&artist=${encodeURIComponent(artist)}`
  );
  const arrayBuffer = await response.arrayBuffer(); // Espera a que la API haga res.end()
  const buffer = Buffer.from(arrayBuffer);
  console.log("Tamaño final recibido:", buffer.length);
  return buffer;
};
