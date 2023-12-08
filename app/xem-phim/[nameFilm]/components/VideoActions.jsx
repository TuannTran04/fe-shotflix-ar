"use client";
import {
  addBookmarkMovie,
  addFavoriteMovie,
  deleteBookmarkMovie,
  deleteFavoriteMovie,
} from "@/store/apiRequest";
import { addArrFavorite, addArrWatchLater } from "@/store/filmSlice";
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

const VideoActions = ({ movie, toast }) => {
  const film = useSelector((state) => state.film);
  const { favoriteFilm, watchLaterFilm } = film;
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.login.currentUser);
  const userId = user?._id;
  const accessToken = user?.accessToken;

  const checkFavoriteExist = useMemo(() => {
    if (!user) return;
    const isExist =
      favoriteFilm.length > 0 &&
      favoriteFilm.some((film) => film?._id === movie?._id);

    return isExist;
  }, [favoriteFilm, movie]);

  const checkWatchLaterExist = useMemo(() => {
    if (!user) return;
    const isExist =
      watchLaterFilm.length > 0 &&
      watchLaterFilm.some((film) => film?._id === movie?._id);
    return isExist;
  }, [watchLaterFilm, movie]);

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
          const res = await addFavoriteMovie(userId, movie._id);
          console.log(">>> addFavoriteMovie <<<", res);
          if (res.status === 200 && res?.data.newMovie) {
            dispatch(addArrFavorite([...favoriteFilm, res.data.newMovie]));
          }
          toast.success(res?.data?.message);
        }
      } else {
        if (
          window.confirm(
            `Bạn có chắc muốn xóa ${movie?.title} khỏi danh sách yêu thích không?`
          )
        ) {
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
        if (
          window.confirm(
            `Bạn có chắc muốn thêm ${movie?.title} vào danh sách xem sau không?`
          )
        ) {
          const res = await addBookmarkMovie(userId, movie._id);
          console.log(res);

          if (res.status === 200 && res?.data.newMovie) {
            dispatch(addArrWatchLater([...watchLaterFilm, res.data.newMovie]));
          }
          toast.success(res?.data?.message);
        }
      } else {
        if (
          window.confirm(
            `Bạn có chắc muốn xóa ${movie?.title} khỏi danh sách xem sau không?`
          )
        ) {
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
      }
    } catch (err) {
      console.log(err);
      throw new Error(err);
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
