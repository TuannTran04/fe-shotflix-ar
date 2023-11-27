import axios from "axios";

const getAllCategories = async () => {
  try {
    const categoriesResponse = await axios.get(
      `${process.env.NEXT_PUBLIC_URL}/api/v1/category`
    );

    if (!categoriesResponse && !categoriesResponse?.data?.data) return null;

    const dataCategories = categoriesResponse?.data?.data;
    console.log(dataCategories);

    return dataCategories;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};
const getAllFilms = async () => {
  try {
    const filmsResponse = await axios.get(
      `${process.env.NEXT_PUBLIC_URL}/api/v1/movie/get-all-movies-sitemap`
    );

    if (!filmsResponse && !filmsResponse?.data?.movie) return null;

    const dataFilms = filmsResponse?.data?.movie;
    console.log(dataFilms);

    return dataFilms;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

export default async function sitemap() {
  const baseURL = "http://localhost:3001";

  // Get All Categories from Server
  const categories = await getAllCategories();
  const categoriesUrls =
    categories?.map((item) => {
      return {
        url: `${baseURL}/the-loai/${item.slug}`,
        lastModified: new Date(),
      };
    }) ?? [];

  // Get All Film from Server
  const films = await getAllFilms();
  const filmsUrls =
    films?.map((item) => {
      return {
        url: `${baseURL}/xem-phim/${item.slug}`,
        lastModified: new Date(),
      };
    }) ?? [];

  return [
    {
      url: baseURL,
      lastModified: new Date(),
    },
    ...categoriesUrls,
    ...filmsUrls,
  ];
}
