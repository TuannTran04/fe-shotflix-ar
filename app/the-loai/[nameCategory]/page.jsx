"use client";
import LayoutRoot from "@/components/LayoutRoot";
import { useSearchParams } from "next/navigation";
import Pagination from "../../../components/Pagination";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { getMoviesByCate } from "../../../services/userRequest";
import Breadcrumb from "../../../components/BreadCrumb";
import Heading from "../../../components/Heading";
import LayoutAllFilm from "../../../components/LayoutAllFilm";

const CategoryPage = ({ params }) => {
  const slugCategory = params.nameCategory;

  // console.log(categories);
  const router = useRouter();
  const searchParams = useSearchParams();
  const pageNumber = searchParams.get("page");

  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const [arrMovie, setArrMovie] = useState([]);
  const [currentPage, setCurrentPage] = useState(parseInt(pageNumber) || 1);
  const [pageSize, setPageSize] = useState(30);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    if (slugCategory) {
      router.push(`${slugCategory}?page=${currentPage}`);
    }
  }, [currentPage, slugCategory]);

  useEffect(() => {
    const renderMoviesByCategory = async () => {
      try {
        if (category._id) {
          const res = await getMoviesByCate(
            category._id,
            currentPage,
            pageSize
          );
          console.log(">>> Category Film <<<", res?.data.data.movies);
          console.log(">>> Category Film <<<", res?.data.data.totalCount);
          setArrMovie(res?.data.data.movies);
          setTotalPages(Math.ceil(res?.data.data.totalCount / pageSize));
          setIsLoading(false);
        }
      } catch (err) {
        console.log(err);
        setIsLoading(false);
      }
    };
    renderMoviesByCategory();
  }, [category._id, currentPage, pageSize]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_URL}/api/v1/category`
        );

        const categories = categoriesResponse?.data?.data || [];

        if (categories.length > 0) {
          const [category] = categoriesResponse?.data?.data.filter(
            (item) => item.slug === slugCategory
          );

          setCategory(category);

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
        <Breadcrumb content={category.name} />

        <Heading
          content={category.name}
          styleDiv="mb-4 md:mb-8"
          styleTitle="text-[#da966e] text-2xl font-normal border-l-4 pl-2.5"
        />

        <LayoutAllFilm arrMovie={arrMovie} isLoading={isLoading} />

        {arrMovie.length !== 0 ? (
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

export default CategoryPage;
