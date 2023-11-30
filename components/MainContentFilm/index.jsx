import Link from "next/link";
import Slider from "react-slick";
import { settings } from "./constant";
import SidebarContentFilm from "../SidebarContentFilm";
import MovieMainContent from "./components/Movie";
import { useSelector } from "react-redux";
import Heading from "../Heading";
import ItemMovie from "../ItemMovie";
import SkeletonImg from "../SkeletonImg";

const MainContentFilm = ({ toast }) => {
  const film = useSelector((state) => state.film);
  const { movies, isFetching } = film;
  // console.log(movies, "movies in MainContentFilm");
  // console.log(movies?.watchToday);

  const arrSliderCategory = [
    {
      id: 1,
      title: "Xem gì hôm nay",
      slug: "xem-gi-hom-nay",
      dataFilm: movies?.watchToday,
    },
    {
      id: 2,
      title: "Phim mới nhất",
      slug: "phim-moi-nhat",
      dataFilm: movies?.latest,
    },
  ];

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-7 -mx-2.5 gap-6">
        {/* LEFT */}
        <div className="col-span-5">
          <div className="flex flex-col justify-between">
            {arrSliderCategory?.map((item, index) => {
              {
                /* if (item?.dataFilm?.length === 0 || !item?.dataFilm?.length) {
                return <></>;
              } */
              }

              return (
                <div
                  key={item.id}
                  className={`${
                    index === arrSliderCategory.length - 1 ? "" : "mb-10"
                  }`}
                >
                  <div className="px-1 md:px-2.5 mb-4 flex justify-between items-center">
                    <Heading
                      content={item.title}
                      styleDiv=""
                      styleTitle="text-[#da966e] text-2xl font-normal border-l-4 pl-2.5"
                    />

                    <Link
                      // href={`/${item.slug.replace(/\s+/g, "-")}`}

                      href={{
                        pathname: `/${item.slug.replace(/\s+/g, "-")}`,
                        query: {
                          title: item.title.replace(/\s/g, "-"),
                          page: 1,
                        },
                      }}
                      className="py-[3px] px-[8px] rounded-[3px] bg-[#408BEA] font-light text-[10px] text-white uppercase select-none"
                    >
                      Xem thêm
                    </Link>
                  </div>

                  {/* <Slider {...settings}>
                  {item?.dataFilm?.map((item, index) => {
                    if (item !== null)
                      return (
                        <MovieMainContent
                          key={item?._id}
                          item={item}
                          toast={toast}
                        />
                      );
                  })}
                </Slider> */}
                  {isFetching ? (
                    <Slider {...settings}>
                      {Array(5)
                        .fill("")
                        .map((_, index) => (
                          <SkeletonImg key={index} height="h-[235px]" />
                        ))}
                    </Slider>
                  ) : (
                    <Slider {...settings}>
                      {item?.dataFilm?.map((item, index) => {
                        if (item !== null)
                          return (
                            <ItemMovie
                              key={item?._id}
                              item={item}
                              toast={toast}
                              isMainContent={true}
                            />
                          );
                      })}
                    </Slider>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT */}
        <div className="mt-6 sm:mt-0 col-span-5 lg:col-span-2 px-2 md:px-2.5">
          <SidebarContentFilm />
        </div>
      </div>
    </>
  );
};

export default MainContentFilm;
