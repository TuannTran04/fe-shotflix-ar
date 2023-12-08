"use client";
import LayoutRoot from "@/components/LayoutRoot";
import MainContentFilm from "@/components/MainContentFilm";
import SliderTopRatingofWeek from "@/components/SliderRelatedFilm";
import SliderTrendingFilm from "@/components/SliderTrendFilm";
import { getFavoriteAndWatchLaterMovies } from "@/store/apiRequest";
import { loginSuccess } from "@/store/authSlice";
import {
  addDataMovies,
  fetchFilmFailed,
  fetchFilmStart,
} from "@/store/filmSlice";
import { createAxios } from "@/utils/createInstance";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Dashboard() {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.login?.currentUser);
  const userId = user?._id;
  const accessToken = user?.accessToken;
  let axiosJWT = createAxios(user, dispatch, loginSuccess, router);

  const [categories, setCategories] = useState([]);
  // const [dataMovies, setDataMovies] = useState({});
  // console.log(dataMovies);

  // const film = useSelector((state) => state.film);
  // const { watchLaterFilm } = film;

  // console.log(film);

  useEffect(() => {
    const fetchData = async () => {
      dispatch(fetchFilmStart());
      try {
        const moviesResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_URL}/api/v1/movie`
        );

        const dataMovies = moviesResponse?.data?.data || {};

        if (dataMovies) {
          // setDataMovies(dataMovies);
          dispatch(addDataMovies(dataMovies));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        dispatch(fetchFilmFailed());
      }
    };

    fetchData();
  }, []);

  // useEffect(() => {
  //   if (dataMovies.length > 0) {
  //     // console.log("siu");
  //     dispatch(addDataMovies(dataMovies));
  //   }
  // }, [dataMovies]);

  useEffect(() => {
    if (user && accessToken) {
      // console.log("call film");

      const controller = new AbortController();

      const fetchMovies = async () => {
        try {
          getFavoriteAndWatchLaterMovies(
            accessToken,
            dispatch,
            axiosJWT,
            controller
          );
        } catch (err) {
          console.log(err);
        }
      };

      fetchMovies();

      return () => {
        controller.abort();
      };
    }
  }, []);

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
        <SliderTrendingFilm toast={toast} />
        <MainContentFilm toast={toast} />
        <SliderTopRatingofWeek toast={toast} />
      </LayoutRoot>

      <ToastContainer />
    </>
  );
}
