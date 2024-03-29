import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createAxios } from "../../../../utils/createInstance";
import { useState } from "react";
import { deleteFavoriteMovie } from "../../../../store/apiRequest";
import Link from "next/link";
import Image from "next/legacy/image";
import { addArrFavorite } from "@/store/filmSlice";
import { loginSuccess } from "@/store/authSlice";
import { useRouter } from "next/navigation";

const Favorite = ({ movie, toast, arrFavoriteMovie, setArrFavoriteMovie }) => {
  const user = useSelector((state) => state.auth.login.currentUser);
  const userId = user?._id;
  const router = useRouter();
  const dispatch = useDispatch();
  const accessToken = user?.accessToken;
  let axiosJWT = createAxios(user, dispatch, loginSuccess, router, userId);
  const [showMenu, setShowMenu] = useState(false);

  const containerMenu = useRef(null);
  const btnShowMenuFilm = useRef(null);

  const handleShowMenuMovie = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleDeleteFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      if (!user || !accessToken) {
        toast.warning("Đăng nhập để sử dụng tính năng này");
        return;
      }

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
        // console.log(">>> deleteFavoriteMovie <<<", res);

        setArrFavoriteMovie((prevFavorires) => {
          return prevFavorires.filter((favorite) => favorite._id !== movie._id);
        });

        // const newArrFavMovie = arrFavoriteMovie.filter(
        //   (film) => film._id !== movie._id
        // );
        // console.log("newArrFavMovie", newArrFavMovie);

        if (res.status === 200) {
          // dispatch(addArrFavorite([...newArrFavMovie]));
          toast.success(res?.data?.metadata?.message);
        }
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
    <div className="">
      <Link
        href={`/xem-phim/${movie.slug}`}
        className="relative block h-[300px] overflow-hidden group"
      >
        <Image
          src={movie.photo?.[0]}
          className="block w-full h-full object-cover group-hover:opacity-50 transition-all duration-500"
          layout="fill"
          alt="pic"
          priority
        />
        <span className="absolute top-[50%] inset-x-0 opacity-0 group-hover:opacity-100 text-white text-center transition-all duration-500">
          <i className="fa-regular fa-circle-play text-4xl"></i>
        </span>

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
              className="py-1 absolute top-0 right-[100%] bg-white min-w-[100px] z-40"
              ref={containerMenu}
            >
              <span
                className="px-2 flex justify-start items-center hover:bg-[rgba(0,0,0,0.3)] z-50"
                onClick={handleDeleteFavorite}
              >
                <p className="flex-1 w-full whitespace-nowrap">Xóa yêu thích</p>
                {/* <i className="fa-regular fa-heart ml-1 my-auto"></i> */}
                <i className="fa-solid fa-heart ml-1 my-auto"></i>
              </span>
            </span>
          )}
        </span>
      </Link>
    </div>
  );
};

export default Favorite;
