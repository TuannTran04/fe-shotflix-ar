import Image from "next/legacy/image";
import Link from "next/link";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addBookmarkMovie, addFavoriteMovie } from "../../../store/apiRequest";
import { createAxios } from "../../../utils/createInstance";

const MovieMainContent = ({ item, toast }) => {
  let {
    _id,
    title,
    titleWithoutAccent,
    slug,
    photo,
    category,
    quality,
    yearPublish,
    timeVideo,
    views,
  } = item;

  const user = useSelector((state) => state.auth.login.currentUser);
  const userId = user?._id;
  const accessToken = user?.accessToken;
  const film = useSelector((state) => state.film);
  const { favoriteFilm, watchLaterFilm } = film;
  const dispatch = useDispatch();

  const [showMenu, setShowMenu] = useState(false);
  const handleShowMenuMovie = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowMenu(!showMenu);
    console.log("toggle");
  };

  const handleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      if (!user || !accessToken) {
        toast.warning("Đăng nhập để sử dụng tính năng này");
        return;
      }

      if (
        window.confirm(
          `Bạn có chắc muốn thêm ${title} vào danh sách yêu thích không?`
        )
      ) {
        const res = await addFavoriteMovie(userId, _id);
        console.log(res);
        toast.success(res?.data?.message);
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

      if (
        window.confirm(
          `Bạn có chắc muốn thêm ${title} vào danh sách xem sau không?`
        )
      ) {
        const res = await addBookmarkMovie(userId, _id);
        console.log(res);
        toast.success(res?.data?.message);
      }
    } catch (err) {
      console.log(err);
      throw new Error(err);
    }
  };

  return (
    <div className="h-full">
      <div className="mx-1 sm:mx-[5px] relative h-full overflow-hidden group flex flex-col justify-between">
        <Link
          href={`/xem-phim/${slug}`}
          className="relative flex h-[150px] sm:h-[200px] items-center justify-center z-50 overflow-hidden"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <Image
            src={photo?.[0] || ""}
            alt="user profile avatar"
            layout="fill"
            className="block w-full object-cover group-hover:scale-110 transition-all duration-300 group-hover:opacity-50 "
          />
          <i className="fa-solid fa-circle-play text-4xl absolute text-white scale-150 opacity-0 group-hover:scale-100 group-hover:opacity-80 duration-500 ease-in-out"></i>

          <span
            className="h-[20px] w-[20px] absolute top-0 right-0 bg-white cursor-pointer z-30"
            onClick={handleShowMenuMovie}
          >
            <i className="fa-solid fa-ellipsis-vertical absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-30"></i>
            {showMenu && (
              <span className="py-1 absolute top-0 right-[100%] bg-white min-h-[50px] min-w-[100px] z-40">
                <span
                  className="px-2 flex justify-start items-center hover:bg-[rgba(0,0,0,0.3)] z-50"
                  onClick={handleFavorite}
                >
                  <p className="flex-1 w-full whitespace-nowrap">Yêu thích</p>
                  <i className="fa-regular fa-heart my-auto"></i>
                </span>
                <span
                  className="px-2 flex justify-start items-center mt-1 hover:bg-[rgba(0,0,0,0.3)] z-50"
                  onClick={handleBookmark}
                >
                  <p className="flex-1 w-full whitespace-nowrap">Xem sau</p>
                  <i className="fa-regular fa-clock my-auto"></i>
                </span>
              </span>
            )}
          </span>
        </Link>

        <div className="p-2 bg-black bg-opacity-70 text-white">
          <h3 className="whitespace-nowrap text-ellipsis overflow-hidden">
            <Link href={`/xem-phim/${slug}`} title={title}>
              {title}
            </Link>
          </h3>
          <p className="text-sm opacity-50 whitespace-nowrap text-ellipsis overflow-hidden">
            {titleWithoutAccent}
          </p>
          <p className="text-[10px] opacity-50 whitespace-nowrap text-ellipsis overflow-hidden">
            {category?.[0]?.name}{" "}
            {category?.[1]?.name ? `• ${category?.[1]?.name}` : ""} •{" "}
            {timeVideo}
            {/* &apos; */}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MovieMainContent;
