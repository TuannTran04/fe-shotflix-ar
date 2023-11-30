import Slider from "react-slick";

import { settings } from "./constants";
import Movie from "./components/Movie";

import { useSelector } from "react-redux";

import "react-toastify/dist/ReactToastify.css";
import Heading from "../Heading";
import ItemMovie from "../ItemMovie";
import SkeletonImg from "../SkeletonImg";

const SliderTrendingFilm = ({ toast }) => {
  const film = useSelector((state) => state.film);
  const { movies, isFetching } = film;

  return (
    <div className="mt-0 md:mt-2 mb-14 sm:mb-8 -mx-2.5">
      {/* <div>
        <img
          className="block w-full"
          src="https://ax.mpapis.xyz/motchill/uploads/342f50804f3a0bc5d9ff4b9e3b9c9964.gif"
          alt=""
        />
      </div> */}

      <Heading
        content="Top Trending"
        styleDiv="px-2.5 mb-4"
        styleTitle="text-[#da966e] text-3xl font-normal border-l-4 pl-2.5"
      />
      {/* movies?.trending?.length === 0 || !movies?.trending?.length */}
      {isFetching ? (
        <Slider {...settings}>
          {Array(5)
            .fill("")
            .map((_, index) => (
              <SkeletonImg key={index} />
            ))}
        </Slider>
      ) : (
        <Slider {...settings}>
          {movies?.trending?.map((item, index) => {
            return (
              <ItemMovie
                key={item._id}
                item={item}
                toast={toast}
                isTrendFilm={true}
              />
            );
          })}
        </Slider>
      )}

      {/* <Slider {...settings}>
        {movies?.trending?.map((item, index) => {
          return <Movie key={item._id} item={item} toast={toast} />;
        })}
      </Slider> */}
    </div>
  );
};

export default SliderTrendingFilm;
