"use client";
import {
  addBookmarkMovie,
  addFavoriteMovie,
  deleteBookmarkMovie,
  deleteFavoriteMovie,
} from "@/store/apiRequest";
import { loginSuccess } from "@/store/authSlice";
// import { addArrFavorite, addArrWatchLater } from "@/store/filmSlice";
import { createAxios } from "@/utils/createInstance";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const VideoActions = ({ movie, toast }) => {
  // const film = useSelector((state) => state.film);
  // const { favoriteFilm, watchLaterFilm } = film;
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.login.currentUser);
  const userId = user?._id;
  const accessToken = user?.accessToken;

  let axiosJWT = createAxios(user, dispatch, loginSuccess, router, userId);
  const [checkFavoriteExist, setCheckFavoriteExist] = useState(false);
  const [checkWatchLaterExist, setCheckWatchLaterExist] = useState(false);
  // console.log("favoriteFilm", favoriteFilm);
  // console.log("watchLaterFilm", watchLaterFilm);

  useEffect(() => {
    if (user && userId && accessToken) {
      const controller = new AbortController();
      const fetchCheckFavMark = async () => {
        try {
          const checkFavMark = await axiosJWT.get(
            `${process.env.NEXT_PUBLIC_URL}/api/v1/user/check-fav-mark/${userId}/${movie._id}`,

            {
              headers: { token: `Bearer ${accessToken}` },
              signal: controller.signal,
            }
          );
          if (checkFavMark.status === 200) {
            console.log("checkFavMark", checkFavMark);
            console.log(
              "checkFavMark",
              checkFavMark.data.metadata?.data?.isMovieInFavorites
            );
            console.log(
              "checkFavMark",
              checkFavMark.data.metadata?.data?.isMovieInMarkedBooks
            );

            setCheckFavoriteExist(
              checkFavMark.data.metadata?.data?.isMovieInFavorites
            );
            setCheckWatchLaterExist(
              checkFavMark.data.metadata?.data?.isMovieInMarkedBooks
            );
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchCheckFavMark();

      return () => {
        controller.abort();
      };
    }
  }, []);

  // const checkFavoriteExist = useMemo(() => {
  //   if (!user) return;
  //   const isExist =
  //     favoriteFilm.length > 0 &&
  //     favoriteFilm.some((film) => film?._id === movie?._id);

  //   return isExist;
  // }, [favoriteFilm, movie]);

  // const checkWatchLaterExist = useMemo(() => {
  //   if (!user) return;
  //   const isExist =
  //     watchLaterFilm.length > 0 &&
  //     watchLaterFilm.some((film) => film?._id === movie?._id);
  //   return isExist;
  // }, [watchLaterFilm, movie]);

  const handleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      if (!user || !accessToken) {
        toast.warning("Đăng nhập để sử dụng tính năng này");
        return;
      }

      if (!checkFavoriteExist) {
        if (
          window.confirm(
            `Bạn có chắc muốn thêm ${movie?.title} vào danh sách yêu thích không?`
          )
        ) {
          const res = await addFavoriteMovie(
            userId,
            movie._id,
            accessToken,
            axiosJWT
          );
          console.log(">>> addFavoriteMovie <<<", res);
          if (res.status === 200) {
            // dispatch(
            //   addArrFavorite([...favoriteFilm, res?.data.metadata?.newMovie])
            // );
            setCheckFavoriteExist(true);
          }
          toast.success(res?.data?.metadata?.message);
        }
      } else {
        if (
          window.confirm(
            `Bạn có chắc muốn xóa ${movie?.title} khỏi danh sách yêu thích không?`
          )
        ) {
          const res = await deleteFavoriteMovie(
            userId,
            movie._id,
            accessToken,
            axiosJWT
          );
          console.log(">>> deleteFavoriteMovie <<<", res);

          // const newArrFavMovie = favoriteFilm.filter(
          //   (film) => film._id !== movie._id
          // );
          // console.log("newArrFavMovie", newArrFavMovie);

          if (res.status === 200) {
            // dispatch(addArrFavorite([...newArrFavMovie]));
            setCheckFavoriteExist(false);
            toast.success(res?.data?.metadata?.message);
          }
        }
      }
    } catch (err) {
      console.log(err);
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
        if (
          window.confirm(
            `Bạn có chắc muốn thêm ${movie?.title} vào danh sách xem sau không?`
          )
        ) {
          const res = await addBookmarkMovie(
            userId,
            movie._id,
            accessToken,
            axiosJWT
          );
          console.log(res);

          if (res.status === 200) {
            setCheckWatchLaterExist(true);
            // dispatch(
            //   addArrWatchLater([
            //     ...watchLaterFilm,
            //     res?.data.metadata?.newMovie,
            //   ])
            // );
          }
          toast.success(res?.data?.metadata?.message);
        }
      } else {
        if (
          window.confirm(
            `Bạn có chắc muốn xóa ${movie?.title} khỏi danh sách xem sau không?`
          )
        ) {
          const res = await deleteBookmarkMovie(
            userId,
            movie._id,
            accessToken,
            axiosJWT
          );
          console.log(">>> deleteBookMarkMovie <<<", res);

          // const newArrBookMarkMovie = watchLaterFilm.filter(
          //   (film) => film._id !== movie._id
          // );
          // console.log("newArrBookMarkMovie", newArrBookMarkMovie);

          if (res.status === 200) {
            // dispatch(addArrWatchLater([...newArrBookMarkMovie]));
            setCheckWatchLaterExist(false);
            toast.success(res?.data?.metadata?.message);
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
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
  );
};

export default VideoActions;
