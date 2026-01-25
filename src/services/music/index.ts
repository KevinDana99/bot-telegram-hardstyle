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
  const url = `http://127.0.0.1:3001/api/music/download?title=${encodeURIComponent(title)}&artist=${encodeURIComponent(artist)}`;

  const response = await fetch(url);
  if (!response.ok) throw new Error("La API falló");

  const reader = response.body?.getReader();
  if (!reader) throw new Error("No se pudo obtener el cuerpo de la respuesta");

  const chunks: Uint8Array[] = [];

  // Bucle infinito hasta que el servidor haga res.end()
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) {
      chunks.push(value);
      // Opcional: console.log(`Recibiendo chunk de ${value.length} bytes...`);
    }
  }

  // Unimos todos los trozos en un solo Buffer sólido
  const finalBuffer = Buffer.concat(chunks.map((c) => Buffer.from(c)));

  console.log(
    `📏 Tamaño final capturado por el Bot: ${finalBuffer.length} bytes`,
  );
  return finalBuffer;
};
