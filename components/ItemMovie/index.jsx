"use client";
import Image from "next/legacy/image";
import Link from "next/link";
import { useSelector } from "react-redux";
import { addBookmarkMovie, addFavoriteMovie } from "@/store/apiRequest";
import { useEffect, useRef, useState } from "react";

const ItemMovie = ({
  item,
  toast,
  isTrendFilm,
  isMainContent,
  isRelatedFilm,
  isLayoutAllFilm,
}) => {
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

  // console.log(item);

  const user = useSelector((state) => state.auth.login.currentUser);
  const userId = user?._id;
  const accessToken = user?.accessToken;

  const containerMenu = useRef(null);
  const btnShowMenuFilm = useRef(null);

  const [showMenu, setShowMenu] = useState(false);
  const handleShowMenuMovie = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowMenu(!showMenu);
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

        toast.success(res?.data?.message);
      }
    } catch (err) {
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

        toast.success(res?.data?.message);
      }
    } catch (err) {
      throw new Error(err);
    }
  };

  // Sự kiện lắng nghe khi click chuột toàn trang
  useEffect(() => {
    const handleClickOutsideHideMenu = (e) => {
      // Kiểm tra nếu kết quả đang hiển thị và chuột không nằm trong phần tử kết quả
      if (
        !containerMenu.current?.contains(e.target) &&
        e.target != btnShowMenuFilm.current &&
        !btnShowMenuFilm.current?.contains(e.target)
      ) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutsideHideMenu);

    return () => {
      document.removeEventListener("mousedown", handleClickOutsideHideMenu);
    };
  }, []);

  return (
    <div className="h-full">
      <div
        className={`relative overflow-hidden h-full group 
        ${isMainContent ? "flex flex-col justify-between mx-2" : ""}
        ${isTrendFilm || isRelatedFilm ? "mx-2.5" : ""}
        ${isLayoutAllFilm ? "" : ""}`}
      >
        <Link
          className={`relative inline-block w-full z-20
          ${isTrendFilm || isRelatedFilm ? "h-full" : ""}
          ${isMainContent ? "flex h-[160px] items-center justify-center" : ""} 
          ${isLayoutAllFilm ? "h-[300px]" : ""}`}
          href={`/xem-phim/${slug}`}
          title={title}
        >
          <Image
            className={`h-full block w-full object-cover transition-all duration-300 group-hover:opacity-50 ${
              isTrendFilm ? "group-hover:scale-110" : ""
            }`}
            src={photo?.[0] || "/vercel.svg"}
            alt={photo?.[0]}
            layout="fill"
            priority
          />

          <span className="flex justify-center absolute top-[43%] inset-x-0">
            <i
              className={`fa-solid fa-circle-play  text-white scale-150 opacity-0 group-hover:scale-100 group-hover:opacity-80 duration-500 ease-in-out ${
                isMainContent ? "text-4xl" : "text-5xl"
              }`}
            ></i>
          </span>

          {/* <span className="opacity-0 group-hover:opacity-100 absolute top-[40%] inset-x-0 text-white text-center transition-all duration-500">
            <i className="fa-regular fa-circle-play text-4xl"></i>
          </span> */}

          <span className="h-[20px] w-[20px] absolute top-0 right-0 z-50">
            <span
              className={`block h-full w-full bg-[rgba(255,255,255,0.6)] cursor-pointer z-50 hover:bg-[rgba(255,255,255,1)] ${
                showMenu ? "bg-[rgba(255,255,255,1)]" : ""
              }`}
              ref={btnShowMenuFilm}
              onClick={handleShowMenuMovie}
            >
              <i className="fa-solid fa-ellipsis-vertical absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-50"></i>
            </span>

            {showMenu && (
              <span
                className="py-1 absolute top-0 right-[100%] bg-white min-h-[50px] min-w-[100px] z-40"
                ref={containerMenu}
              >
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

          {!isMainContent && (
            <span className="p-2 absolute bottom-0 inset-x-0 text-white bg-black bg-opacity-70">
              <h3 className="whitespace-nowrap text-ellipsis overflow-hidden">
                {title}
              </h3>
              <p className="text-sm opacity-50 whitespace-nowrap text-ellipsis overflow-hidden">
                {titleWithoutAccent}
              </p>
            </span>
          )}
        </Link>

        {/* <div className="absolute bottom-0 left-0 right-0 text-center p-2 bg-black bg-opacity-70 z-20">
          <span className=" block text-white">
            <h3 className="whitespace-nowrap text-ellipsis overflow-hidden">
              <Link href={`/xem-phim/${slug}`} title="film">
                {title || "title"}
              </Link>
            </h3>
          </span>
        </div> */}

        {isMainContent && (
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
        )}
      </div>
    </div>
  );
};

export default ItemMovie;
