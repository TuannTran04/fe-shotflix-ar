import Link from "next/link";
import Image from "next/legacy/image";
import React from "react";
import { useSelector } from "react-redux";
import Heading from "../Heading";
import SkeletonImg from "../SkeletonImg";

const SidebarContentFilm = ({}) => {
  // console.log("sidebar", movies);
  const film = useSelector((state) => state.film);
  const { movies, isFetching } = film;

  const arrTopTrendingFilm = [
    {
      id: 1,
      title: "Phim đạt giải thưởng",
      listFilm: movies?.awards,
    },
  ];

  return (
    <>
      {arrTopTrendingFilm?.map((item) => {
        {
          /* if (item?.listFilm?.length === 0 || !item?.listFilm?.length) {
          return <></>;
        } */
        }

        return (
          <div key={item.id} className="h-full overflow-hidden">
            <Heading
              content={item.title}
              styleDiv="mb-4"
              styleTitle="text-[#da966e] text-2xl font-normal border-l-4 pl-2.5"
            />

            {isFetching ? (
              Array(4)
                .fill("")
                .map((_, index) => (
                  <SkeletonImg
                    key={index}
                    height="h-[100px]"
                    isSidebarContent={true}
                  />
                ))
            ) : (
              <div className="list_top_trend_film max-h-[400px] md:max-h-[600px] overflow-y-auto">
                {item.listFilm?.map((itemFilm) => (
                  <div
                    key={itemFilm._id}
                    className="overflow-hidden grid grid-cols-4 mb-2.5 h-[120px] md:h-[100px] gap-1"
                    // className={`overflow-hidden grid grid-cols-4 h-[120px] md:h-[100px] gap-1 ${
                    //   index === item.listFilm.length - 1 ? "" : "mb-2.5"
                    // }`}
                  >
                    <div className="col-span-1 h-full">
                      <Link
                        className="relative block w-[100%] h-[120px] md:h-[100px] border-[1px]"
                        href={`/xem-phim/${itemFilm.slug}`}
                      >
                        <Image
                          src={itemFilm.photo?.[0]}
                          alt={itemFilm.photo?.[0]}
                          title={itemFilm.title}
                          layout="fill"
                          priority
                          className="block w-full h-full object-cover"
                        />
                      </Link>
                    </div>

                    <div className="p-2 col-span-3 text-white bg-black opacity-60 hover:opacity-100 flex flex-col justify-center">
                      <h3 className="font-semibold">
                        <Link
                          href={`/xem-phim/${itemFilm.slug}`}
                          title={itemFilm.title}
                        >
                          {itemFilm.title}
                        </Link>
                      </h3>
                      <p className="text-[12px]">
                        Giải thưởng:{" "}
                        {itemFilm.awards?.map((subText, i) => (
                          <React.Fragment key={i}>
                            {subText}
                            {i !== itemFilm.awards.length - 1 && ", "}
                          </React.Fragment>
                        ))}
                      </p>
                      <p className="text-[12px] italic">
                        {itemFilm.views} Lượt xem
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </>
  );
};

export default SidebarContentFilm;
