import axios from "axios";
import CommentFilm from "../../../components/CommentFilm2";
import SliderTopRatingofWeek from "../../../components/SliderRelatedFilm";
import VideoContainer from "./components/VideoContainer";
import VideoDetail from "./components/VideoDetail";
import Breadcrumb from "../../../components/BreadCrumb";
import LayoutRoot from "@/components/LayoutRoot";
import VideoActions from "./components/VideoActions";
import { notFound } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PlayFilmPage = async ({ params }) => {
  const nameFilm = params.nameFilm;

  const fetchDataFilm = async () => {
    try {
      let res = await axios.get(
        `${process.env.NEXT_PUBLIC_URL}/api/v1/movie/user/${nameFilm}`
      );

      if (res.data.code === 200 && res.data.data.movieSingle.length > 0) {
        // console.log(">>> Results Search <<<", res.data.data.movieSingle[0]);
        return res.data.data.movieSingle[0];
      }
    } catch (error) {
      notFound();
    }
  };

  const fetchDataCate = async () => {
    try {
      const categoriesResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_URL}/api/v1/category`
      );

      const categories = categoriesResponse?.data?.data || [];

      if (categories.length > 0) {
        return categories;
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  };

  const [cate, movie] = await Promise.all([fetchDataCate(), fetchDataFilm()]);

  // console.log("cate 50", cate);
  // console.log("movie 51", movie);

  return (
    <>
      <LayoutRoot categories={cate}>
        <div className="md:mt-2">
          <Breadcrumb content={`Xem phim ${movie?.title}`} />

          <div className="grid grid-cols-1 lg:grid-cols-7 lg:gap-4">
            {/* LEFT */}
            <div className="lg:col-span-5 ">
              <div className="p-1 sm:p-2.5 bg-[#2D2D2D]">
                <div className="overflow-hidden">
                  <VideoContainer movie={movie} nameFilm={nameFilm} />
                </div>

                <VideoActions movie={movie} toast={toast} />
              </div>

              <div className="mt-[20px] block lg:hidden lg:mt-0">
                <VideoDetail movie={movie} />
              </div>

              <div className="">
                <CommentFilm movieId={movie?._id} nameFilm={nameFilm} />
              </div>
            </div>

            {/* RIGHT */}
            {/* Hiển thị VideoDetail khi màn hình lớn */}
            <div className="mt-[20px] hidden lg:block lg:mt-0 col-span-2 lg:col-span-2">
              <VideoDetail movie={movie} />
            </div>
          </div>

          <SliderTopRatingofWeek toast={toast} />
        </div>
      </LayoutRoot>

      <ToastContainer />
    </>
  );
};

export default PlayFilmPage;
