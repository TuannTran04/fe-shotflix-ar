"use client";
import { useEffect, useState } from "react";

import axios from "axios";
import { useSelector } from "react-redux";
import { searchMovies } from "../../../services/userRequest";
import Heading from "../../../components/Heading";
import LayoutAllFilm from "../../../components/LayoutAllFilm";
import LayoutRoot from "@/components/LayoutRoot";

const SearchFilmPage = ({ params }) => {
  const queryString = params.queryString;
  const queryStringDecodeURL = decodeURIComponent(queryString).replace(
    /\+/g,
    " "
  );

  const user = useSelector((state) => state.auth.login.currentUser);

  const [categories, setCategories] = useState([]);

  const [arrMovie, setArrMovie] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // console.log(queryString);
  // console.log(decodeURIComponent(queryString));
  // console.log(decodeURIComponent(queryString).replace(/\+/g, " "));

  useEffect(() => {
    const renderSearchMovies = async () => {
      try {
        const res = await searchMovies(queryStringDecodeURL);
        // console.log(">>> Results Search <<<", res);

        if (res.status === 200 && res.data.metadata?.data?.movies.length > 0) {
          setArrMovie(res.data.metadata.data.movies);
          setIsLoading(false);
        } else {
          setArrMovie([]);
          setIsLoading(false);
        }
      } catch (err) {
        console.log(err);
        setIsLoading(false);
      }
    };
    renderSearchMovies();
  }, [queryStringDecodeURL]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_URL}/api/v1/category`
        );

        const categories = categoriesResponse?.data?.metadata?.data || [];

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
    <LayoutRoot categories={categories}>
      <div className="md:mt-2">
        <Heading
          content={`Kết quả tìm kiếm: ${queryStringDecodeURL}`}
          styleDiv="mb-4"
          styleTitle="text-[#da966e] text-2xl font-normal border-l-4 pl-2.5"
        />

        <LayoutAllFilm arrMovie={arrMovie} isLoading={isLoading} />
      </div>
    </LayoutRoot>
  );
};

export default SearchFilmPage;
