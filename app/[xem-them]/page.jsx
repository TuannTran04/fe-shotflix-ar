"use client";
import React, { useEffect, useState } from "react";

import axios from "axios";
import Breadcrumb from "../../components/BreadCrumb";
import Heading from "../../components/Heading";
import LayoutAllFilm from "../../components/LayoutAllFilm";
import Pagination from "../../components/Pagination";
import LayoutRoot from "@/components/LayoutRoot";
import { getMoreMovies } from "../../services/userRequest";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

const MoreFilm = ({ params }) => {
  const nameMoreFilm = decodeURIComponent(params["xem-them"]);

  const router = useRouter();
  const searchParams = useSearchParams();
  const pageNumber = searchParams.get("page");
  const pageTitle = searchParams.get("title");

  const [categories, setCategories] = useState([]);

  const [arrMovie, setArrMovie] = useState([]);
  const [currentPage, setCurrentPage] = useState(parseInt(pageNumber) || 1);
  const [pageSize, setPageSize] = useState(3); // lỗi khi back or forward bằng arrow của browser thì kh load lại data, chỉ khi bấm bằng pagination mới load data
  const [totalPages, setTotalPages] = useState(0);

  // console.log(pageTitle.replace(/-/g, " "));

  // useEffect(() => {
  //   const { data } = getQueryParams(window.location.search);
  //   console.log(data);
  // }, []);

  useEffect(() => {
    const renderMoreMovies = async () => {
      try {
        const res = await getMoreMovies(
          nameMoreFilm.replace(/-/g, " "),
          currentPage,
          pageSize
        );

        console.log(">>> getMoreMovies Film <<<", res);
        setArrMovie(res.data.data);
        setTotalPages(Math.ceil(res.data.totalCount / pageSize));
      } catch (err) {
        console.log(err);
      }
    };
    renderMoreMovies();
  }, [nameMoreFilm, currentPage, pageSize]);

  useEffect(() => {
    if (nameMoreFilm && pageTitle) {
      router.push(`${nameMoreFilm}?title=${pageTitle}&page=${currentPage}`);
    }
  }, [nameMoreFilm, pageTitle, currentPage, pageSize]);

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
    <LayoutRoot categories={categories}>
      <div className="sm:mt-2">
        <Breadcrumb content={pageTitle.replace(/-/g, " ")} />

        <Heading
          content={pageTitle.replace(/-/g, " ")}
          styleDiv="mb-4"
          styleTitle="text-[#da966e] text-2xl font-normal border-l-4 pl-2.5"
        />

        <LayoutAllFilm arrMovie={arrMovie} />

        {arrMovie?.length !== 0 ? (
          <Pagination
            paginationData={{
              currentPage,
              totalPages,
              setCurrentPage: setCurrentPage,
            }}
          />
        ) : (
          ""
        )}
      </div>
    </LayoutRoot>
  );
};

export default MoreFilm;

// export async function getServerSideProps(context) {
//   const nameMoreFilm = context.params.moreFilm;

//   let allCategory = await axios.get(
//     `${process.env.NEXT_PUBLIC_URL}/api/v1/category`
//   );
//   return {
//     props: {
//       nameMoreFilm,
//       categories: allCategory.data.data,
//     },
//   };
// }
