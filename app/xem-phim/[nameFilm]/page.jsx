"use client";
import CommentFilm from "../../../components/CommentFilm2";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SliderTopRatingofWeek from "../../../components/SliderRelatedFilm";
import axios from "axios";
import VideoContainer from "./components/VideoContainer";
import VideoDetail from "./components/VideoDetail";
import Breadcrumb from "../../../components/BreadCrumb";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createAxios } from "../../../utils/createInstance";
import { loginSuccess } from "../../../store/authSlice";
import {
  addBookmarkMovie,
  addFavoriteMovie,
  deleteBookmarkMovie,
  deleteFavoriteMovie,
} from "../../../store/apiRequest";
import { addArrFavorite, addArrWatchLater } from "../../../store/filmSlice";
import { useMemo } from "react";
import { useRouter } from "next/navigation";

import LayoutRoot from "@/components/LayoutRoot";

const PlayFilmPage = ({ params }) => {
  const nameFilm = params.nameFilm;

  const [categories, setCategories] = useState([]);

  const film = useSelector((state) => state.film);
  const { movies, favoriteFilm, watchLaterFilm } = film;
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state) => state.auth.login.currentUser);
  const userId = user?._id;
  const accessToken = user?.accessToken;
  // const favoriteFilm = user && user.loveMovie;
  // const watchLaterFilm = user && user.markBookMovie;

  let axiosJWT = createAxios(user, dispatch, loginSuccess);
  console.log(favoriteFilm);
  console.log(watchLaterFilm);

  // console.log(user);

  // console.log(">>> dataMovies <<<", movies?.topRatingofWeek);

  const [movie, setMovie] = useState({});
  // console.log(movie?._id);
  const [isLgScreen, setIsLgScreen] = useState(false);

  const checkFavoriteExist = useMemo(() => {
    if (!user) return;
    const isExist =
      favoriteFilm.length > 0 &&
      favoriteFilm.some((film) => film?._id === movie._id);

    return isExist;
  }, [favoriteFilm, movie]);

  const checkWatchLaterExist = useMemo(() => {
    if (!user) return;
    const isExist =
      watchLaterFilm.length > 0 &&
      watchLaterFilm.some((film) => film?._id === movie._id);
    return isExist;
  }, [watchLaterFilm, movie]);

  console.log(checkFavoriteExist);
  console.log(checkWatchLaterExist);

  const handleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      if (!user || !accessToken) {
        toast.warning("Đăng nhập để sử dụng tính năng này");
        return;
      }
      if (!checkFavoriteExist) {
        const res = await addFavoriteMovie(userId, movie._id);
        console.log(">>> addFavoriteMovie <<<", res);
        if (res.status === 200 && res?.data.newMovie) {
          dispatch(addArrFavorite([...favoriteFilm, res.data.newMovie]));
        }
        toast.success(res?.data?.message);
      } else {
        const res = await deleteFavoriteMovie(userId, movie._id);
        console.log(">>> deleteFavoriteMovie <<<", res);

        const newArrFavMovie = favoriteFilm.filter(
          (film) => film._id !== movie._id
        );
        console.log("newArrFavMovie", newArrFavMovie);

        if (res.status === 200) {
          dispatch(addArrFavorite([...newArrFavMovie]));
          toast.success(res?.data?.message);
        }
      }
    } catch (err) {
      console.log(err);
      throw new Error(err);
    }
  };

  const handleBookmark = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      if (!user || !accessToken) {
        toast.warning("Đăng nhập để sử dụng tính năng này");
        return;
      }
      if (!checkWatchLaterExist) {
        const res = await addBookmarkMovie(userId, movie._id);
        console.log(res);

        if (res.status === 200 && res?.data.newMovie) {
          dispatch(addArrWatchLater([...watchLaterFilm, res.data.newMovie]));
        }
        toast.success(res?.data?.message);
      } else {
        const res = await deleteBookmarkMovie(userId, movie._id);
        console.log(">>> deleteBookMarkMovie <<<", res);

        const newArrBookMarkMovie = watchLaterFilm.filter(
          (film) => film._id !== movie._id
        );
        console.log("newArrBookMarkMovie", newArrBookMarkMovie);

        if (res.status === 200) {
          dispatch(addArrWatchLater([...newArrBookMarkMovie]));
          toast.success(res?.data?.message);
        }
      }
    } catch (err) {
      console.log(err);
      throw new Error(err);
    }
  };

  useEffect(() => {
    // Xác định kích thước màn hình và cập nhật trạng thái isLgScreen
    const handleResize = () => {
      setIsLgScreen(window.innerWidth >= 1024); // Thay đổi ngưỡng theo yêu cầu của bạn
    };

    // Gắn sự kiện lắng nghe sự thay đổi kích thước màn hình
    window.addEventListener("resize", handleResize);

    // Khởi tạo trạng thái ban đầu
    handleResize();

    // Loại bỏ sự kiện lắng nghe khi component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const renderSingleMovie = async () => {
      try {
        let res = await axios.get(
          `${process.env.NEXT_PUBLIC_URL}/api/v1/movie/user/${nameFilm}`
        );
        // let comments = await axios.get(
        //   `${process.env.NEXT_PUBLIC_URL}/api/v1/comment/${movies?._id}`
        // );
        // console.log(">>> Results Search <<<", comments);
        if (res.data.code === 200) {
          // console.log(">>> Results Search <<<", res.data.data.movieSingle[0]);
          setMovie(res.data.data.movieSingle[0]);
        }
        // if (comments.data.code === 200) {
        //   // console.log(">>> Results Search <<<", res.data.data.movieSingle[0]);
        //   setComments(comments.data.data);
        // }
      } catch (err) {
        console.log(err);
      }
    };
    renderSingleMovie();
  }, [nameFilm, movie?._id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_URL}/api/v1/category`
        );

        const categories = categoriesResponse?.data?.data || [];

        if (categories.length > 0) {
          setCategories(categories);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <LayoutRoot categories={categories}>
        <div className="md:mt-2">
          <Breadcrumb content={`Xem phim ${movie?.title}`} />

          <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
            {/* LEFT */}
            <div className="lg:col-span-5">
              <div className="p-1 sm:p-2.5 bg-[#2D2D2D]">
                <div className="overflow-hidden">
                  <VideoContainer movie={movie} nameFilm={nameFilm} />
                </div>

                <div className="flex items-center mt-[10px] select-none">
                  <div
                    className="flex justify-around items-center bg-[#0a5c6f] mr-[10px] py-[2px] px-2 rounded cursor-pointer"
                    onClick={handleFavorite}
                  >
                    {!checkFavoriteExist ? (
                      <i className="fa-regular fa-heart text-sm text-[#06a2d4] mr-[5px]"></i>
                    ) : (
                      <i className="fa-solid fa-heart text-sm text-[#06a2d4] mr-[5px]"></i>
                    )}

                    <span className="text-sm text-[#06a2d4]">Thích</span>
                  </div>

                  <div
                    className="flex justify-around items-center bg-[#0a5c6f] mr-[10px] py-[2px] px-2 rounded cursor-pointer"
                    onClick={handleBookmark}
                  >
                    {!checkWatchLaterExist ? (
                      <i className="fa-regular fa-bookmark text-sm text-[#06a2d4] mr-[5px]"></i>
                    ) : (
                      <i className="fa-solid fa-bookmark text-sm text-[#06a2d4] mr-[5px]"></i>
                    )}

                    <span className="text-sm text-[#06a2d4]">Xem sau</span>
                  </div>
                </div>

                {isLgScreen && (
                  <div className="hidden lg:block">
                    {/* Hiển thị CommentFilm khi màn hình lớn */}
                    <CommentFilm movieId={movie?._id} nameFilm={nameFilm} />
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT */}
            <div className="mt-[20px] lg:mt-0 lg:col-span-2">
              <VideoDetail movie={movie} />
            </div>

            {!isLgScreen && (
              <div className="col-span-1 lg:hidden">
                {/* Hiển thị CommentFilm khi màn hình lớn */}
                <CommentFilm movieId={movie?._id} nameFilm={nameFilm} />
              </div>
            )}
          </div>

          <SliderTopRatingofWeek
            movies={movies?.topRatingofWeek}
            toast={toast}
          />
        </div>
      </LayoutRoot>

      <ToastContainer />
    </>
  );
};

export default PlayFilmPage;

// export async function getServerSideProps({ params }) {
//   let allCategory = await axios.get(
//     `${process.env.NEXT_PUBLIC_URL}/api/v1/category`
//   );
//   return {
//     props: {
//       test: allCategory.data.data,
//     },
//   };
// }
