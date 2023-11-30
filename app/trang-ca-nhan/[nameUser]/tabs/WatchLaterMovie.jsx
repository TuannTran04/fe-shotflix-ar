import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createAxios } from "../../../../utils/createInstance";
import { getWatchLaterMovies } from "../../../../store/apiRequest";
import WatchLater from "../components/WatchLater";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loginSuccess } from "../../../../store/authSlice";
import Loading from "@/components/Loading/Loading";
import { useRouter } from "next/navigation";

const WatchLaterMovie = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state) => state.auth.login.currentUser);
  // console.log(">>> store user", user);
  const accessToken = user?.accessToken;
  const userId = user?._id;
  let axiosJWT = createAxios(user, dispatch, loginSuccess, router);

  const [arrWatchLaterMovie, setArrWatchLaterMovie] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const renderWatchLaterMovies = async () => {
      try {
        const res = await getWatchLaterMovies(
          accessToken,
          dispatch,
          axiosJWT,
          controller
        );
        // console.log(">>> Watch Later Film <<<", res.data.markBookMovie);

        if (res.status === 200) {
          isMounted && setArrWatchLaterMovie(res.data.markBookMovie);
          setIsLoading(false);
        }
      } catch (err) {
        // console.log(err);
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      }
    };
    renderWatchLaterMovies();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  return (
    <>
      {isLoading && <Loading />}

      <div className="srcoll_film_manage_user grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 max-h-[1000px] min-h-[200px] overflow-y-auto">
        {arrWatchLaterMovie.length > 0 ? (
          arrWatchLaterMovie.map((movie, index) => (
            <WatchLater
              key={movie._id}
              movie={movie}
              toast={toast}
              setArrWatchLaterMovie={setArrWatchLaterMovie}
            />
          ))
        ) : isLoading ? (
          <></>
        ) : (
          <p className="absolute left-[50%] -translate-x-1/2 mx-auto text-white">
            Không có phim xem sau nào!
          </p>
        )}
      </div>

      <ToastContainer />
    </>
  );
};

export default WatchLaterMovie;
