export const fetcherWithError = async (url: string) => {
  const res = await fetch(url);

  if (!res.ok) {
    const errorJson = await res.json();

    throw new Error(errorJson.error || "Errore nella comunicazione");
  }

  return res.json();
};
