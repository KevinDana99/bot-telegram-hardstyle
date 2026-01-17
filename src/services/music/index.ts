export const getAllMusic = async () => {
  const req = await fetch("https://jsonplaceholder.typicode.com/albums");
  const res = await req.json();
  return res;
};
export const findMusicByName = async (query: string) => {
  try {
    const req = await fetch(
      `https://api.deezer.com/search?q=${encodeURIComponent(query)}`
    );
    const res = await req.json();
    console.log({ res });
    return res.data;
  } catch (err) {
    console.log(err);
  }
};
export const getDetails = async (id: string) => {
  const response = await fetch(`https://api.deezer.com/track/${id}`);
  if (!response.ok) throw new Error("Error al obtener track");
  return await response.json();
};
