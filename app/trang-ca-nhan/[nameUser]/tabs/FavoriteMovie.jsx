import React, { useEffect, useState } from "react";
import { createAxios } from "../../../../utils/createInstance";
import { getFavoriteMovies } from "../../../../store/apiRequest";
import { useDispatch, useSelector } from "react-redux";
import Favorite from "../components/Favorite";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loginSuccess } from "../../../../store/authSlice";
import Loading from "@/components/Loading/Loading";
import { useRouter } from "next/navigation";

const FavoriteMovie = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state) => state.auth.login.currentUser);
  const accessToken = user?.accessToken;
  const userId = user?._id;
  let axiosJWT = createAxios(user, dispatch, loginSuccess, router);

  const [arrFavoriteMovie, setArrFavoriteMovie] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  // console.log(isLoading);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const renderFavoriteMovies = async () => {
      try {
        const res = await getFavoriteMovies(
          accessToken,
          dispatch,
          axiosJWT,
          controller
        );
        // console.log(">>> Favorite Film <<<", res);
        if (res.status === 200) {
          isMounted && setArrFavoriteMovie(res.data.loveMovie);
          setIsLoading(false);
        }
      } catch (err) {
        // console.log(err);

        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      }
    };
    renderFavoriteMovies();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  return (
    <>
      {isLoading && <Loading />}

      <div className="relative srcoll_film_manage_user grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 max-h-[1000px] min-h-[200px] overflow-y-auto">
        {arrFavoriteMovie.length > 0 ? (
          arrFavoriteMovie.map((movie, index) => (
            <Favorite
              key={movie._id}
              movie={movie}
              toast={toast}
              setArrFavoriteMovie={setArrFavoriteMovie}
            />
          ))
        ) : isLoading ? (
          <></>
        ) : (
          <p className="absolute left-[50%] -translate-x-1/2 mx-auto text-white">
            Không có phim yêu thích nào!
          </p>
        )}
      </div>

      <ToastContainer />
    </>
  );
};

export default FavoriteMovie;
