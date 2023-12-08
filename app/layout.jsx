// import { Inter } from "next/font/google";

import "./globals.css";
import Script from "next/script";
// import ErrorBoundary from "@/components/ErrorBoundary";
import { StoreProvider } from "@/store/StoreProvider";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ErrorBoundary from "@/components/ErrorBoundary";
import axios from "axios";

// const inter = Inter({ subsets: ['latin'] })

// export const metadata = {
//   metadataBase: new URL("http://localhost:3001"),
//   title: {
//     default: "Shotflix",
//     template: `%s | Shotflix`,
//   },
//   description:
//     "Đây là trang web xem phim ngắn. Một 'sân chơi' dành cho các bạn trẻ đam mê nghệ thuật, điện ảnh...",
//   keywords: "từ-khóa-1, từ-khóa-2, từ-khóa-3",
//   robots: {
//     index: true,
//     follow: true,
//     // nocache: true,
//   },
//   // alternates: {
//   //   canonical: `/xem-phim/${movie.slug}`,
//   //   languages: {
//   //     "vi-VN": `/vi-VN/xem-phim/${movie.slug}`,
//   //   },
//   // },
//   openGraph: {
//     title: "Shotflix",
//     description:
//       "Đây là trang web xem phim ngắn. Một 'sân chơi' dành cho các bạn trẻ đam mê nghệ thuật, điện ảnh...",
//     locale: "vi_VN",
//     type: "video.movie",
//     url: `/`,
//     siteName: "Shotflix",
//     // images: [movie.photo[0]],
//   },
// };

export async function generateMetadata({}) {
  // const nameFilm = params.nameFilm;

  try {
    let res = await axios.get(
      `${process.env.NEXT_PUBLIC_URL}/api/v1/info_shotflix`
    );

    // console.log("res meta", !res.data.data && res.data.data[0]);
    // if (!res?.data && res.data.data[0]) {
    //   return {
    //     title: "Không tìm thấy",
    //     description: "Trang này không tồn tại",
    //   };
    // }

    let infoShotflix = res?.data?.data?.[0];

    if (!infoShotflix) {
      return {
        title: "Không tìm thấy title",
        description: "Trang này không tồn tại",
      };
    }

    // console.log("res meta", infoShotflix);

    return {
      // metadataBase: new URL("http://localhost:3001"),
      metadataBase: new URL("https://shotflix.vn"),

      title: {
        default: infoShotflix?.title ? infoShotflix?.title : "Shotflix",
        template: `%s | ${
          infoShotflix?.title ? infoShotflix?.title : "Shotflix"
        }`,
      },
      description: infoShotflix.description,
      keywords: infoShotflix.keyword,
      robots: {
        index: true,
        follow: true,
        // nocache: true,
      },
      // alternates: {
      //   canonical: `/xem-phim/${infoShotflix.slug}`,
      //   languages: {
      //     "vi-VN": `/vi-VN/xem-phim/${infoShotflix.slug}`,
      //   },
      // },
      openGraph: {
        title: infoShotflix?.title || "test",
        description: infoShotflix.description,
        locale: infoShotflix.locale,
        type: infoShotflix.typeWeb,
        url: infoShotflix.urlWeb,
        siteName: infoShotflix.siteName,
        images: [
          infoShotflix?.photo?.[0]
            ? infoShotflix?.photo?.[0]
            : "https://firebasestorage.googleapis.com/v0/b/prj-cv-film.appspot.com/o/images_seo_shotflix%2Flogo_shotflix.png?alt=media&token=552dbdfc-2dde-4376-bc44-500179bc9f63",
        ],
      },
    };
  } catch (err) {
    console.log(err);
    return {
      title: "Không tìm thấy catch",
      description: "Trang này không tồn tại",
    };
  }
}

const jsonLD = {
  "@context": "https://schema.org",
  "@type": "Movie",
  name: "Shotflix",
  // sameAs: [
  //   "https://www.facebook.com/ShopeeVN",
  //   "https://www.instagram.com/Shopee_VN/",
  //   "https://www.youtube.com/channel/UCKcxoGpxOJx3nt83MCG-nuQ",
  //   "https://play.google.com/store/apps/details?id=com.shopee.vn",
  //   "https://itunes.apple.com/VN/app/id959841449",
  // ],
  image: {
    "@type": "ImageObject",
    url: "https://firebasestorage.googleapis.com/v0/b/prj-cv-film.appspot.com/o/images_seo_shotflix%2Flogo_shotflix.png?alt=media&token=552dbdfc-2dde-4376-bc44-500179bc9f63",
    width: 1080,
    height: 1080,
  },
  telephone: "19006035",
  // url: "http://localhost:3001",
  url: "https://shotflix.vn",
  address: {
    "@type": "PostalAddress",
    streetAddress: "52 Ut Tich, Ward 4, Tan Binh District, Ho Chi Minh City",
    addressLocality: "Ho Chi Minh",
    postalCode: "700000",
    addressRegion: "Ho Chi Minh",
    addressCountry: "VN",
  },
  // priceRange: "1000 - 1000000000",
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "08:00",
      closes: "21:00",
    },
  ],
  geo: {
    "@type": "GeoCoordinates",
    latitude: "10.79664498748942",
    longitude: "106.65856519879867",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css"
          integrity="sha512-z3gLpd7yknf1YoNbCzqRKc4qyor8gaKU1qmn+CShxbuBusANI9QpRohGBreCFkKxLhei6S9CQXFEbbKuqLg0DA=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        <link rel="stylesheet" href="https://cdn.plyr.io/3.7.8/plyr.css" />
        <link
          href="https://vjs.zencdn.net/8.5.2/video-js.css"
          rel="stylesheet"
        />
        {/* <link
          rel="shortcut icon"
          href="/unknowAvatar.webp"
          type="image/x-icon"
        ></link> */}
        {/* <link
          rel="icon"
          href="/unknowAvatar.webp"
          type="image/x-icon"
          sizes="16x16"
        ></link> */}
      </head>
      <body>
        <ErrorBoundary>
          <StoreProvider>{children}</StoreProvider>
        </ErrorBoundary>

        <Script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/1.8.0/flowbite.min.js" />
        {/* <Script src="https://cdn.jsdelivr.net/npm/hls.js@latest" />
        <Script src="https://cdn.plyr.io/3.7.8/plyr.polyfilled.js" /> */}
        <Script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLD) }}
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
