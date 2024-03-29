// import { Inter } from "next/font/google";

import axios from "axios";

// import ArrowGotoUp from "@/components/ArrowGoToUp";
// import Footer from "@/components/Footer";
// import Header from "@/components/Header";

// const inter = Inter({ subsets: ['latin'] })

export async function generateMetadata({ params }) {
  const nameFilm = params.nameFilm;

  try {
    let res = await axios.get(
      `${process.env.NEXT_PUBLIC_URL}/api/v1/movie/user/${nameFilm}`
    );

    if (!res && !res.data?.metadata.data) {
      return {
        title: "Không tìm thấy",
        description: "Trang này không tồn tại",
      };
    }

    let [movie] = res.data.metadata.data.movieSingle;

    // console.log("res meta", movie);

    return {
      title: movie.title,
      description: movie.desc,
      alternates: {
        canonical: `/xem-phim/${movie.slug}`,
        languages: {
          "vi-VN": `/vi-VN/xem-phim/${movie.slug}`,
        },
      },
      openGraph: {
        title: movie.title + " | Shotflix",
        description: movie.desc,
        locale: "vi_VN",
        type: "video.movie",
        url: `/xem-phim/${movie.slug}`,
        siteName: "Shotflix",
        images: [movie.photo[0]],
      },
    };
  } catch (err) {
    console.log(err);
    return {
      title: "Không tìm thấy",
      description: "Trang này không tồn tại",
    };
  }
}

export async function generateStaticParams() {
  const filmsResponse = await axios.get(
    `${process.env.NEXT_PUBLIC_URL}/api/v1/movie/get-all-movies-sitemap`
  );

  if (!filmsResponse && filmsResponse?.data?.metadata?.movie?.length === 0)
    return [];

  const dataFilms = filmsResponse?.data?.metadata?.movie;
  console.log("page xem phims", dataFilms);

  return dataFilms.map((film) => ({
    nameFilm: film?.slug,
  }));
}

export default function RootLayout({ children }) {
  return <main>{children}</main>;
}
