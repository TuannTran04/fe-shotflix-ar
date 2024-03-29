import axios from "axios";
import Breadcrumb from "../../components/BreadCrumb";
import Heading from "../../components/Heading";
import LayoutAllFilm from "../../components/LayoutAllFilm";
import LayoutRoot from "@/components/LayoutRoot";
import { getMoreMovies } from "../../services/userRequest";
import { notFound } from "next/navigation";
import Pagination from "@/components/Pagination";

const MoreFilm = async ({ params, searchParams }) => {
  const nameMoreFilm = decodeURIComponent(params["xem-them"]);
  console.log(searchParams);

  const pageTitle = searchParams?.title ?? "unknown";

  const pageSize = 1;
  const currentPage = searchParams?.page ?? 1;

  const fetchDataFilm = async () => {
    try {
      const res = await getMoreMovies(nameMoreFilm, currentPage, pageSize);

      return res.data;
    } catch (error) {
      // console.error("Error fetching data:", error);
      notFound();
    }
  };

  const fetchDataCate = async () => {
    try {
      const categoriesResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_URL}/api/v1/category`
      );

      const categories = categoriesResponse?.data?.metadata?.data || [];

      if (categories.length > 0) {
        return categories;
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  };

  const cate = await fetchDataCate();
  const movie = await fetchDataFilm();

  const arrMovie = movie.data;
  const totalPages = Math.ceil(movie.totalCount / pageSize);

  //   console.log("arrMovie", arrMovie);
  console.log("totalPages", totalPages);

  return (
    <LayoutRoot categories={cate}>
      <div className="sm:mt-2">
        <Breadcrumb content={pageTitle?.replace(/-/g, " ")} />

        <Heading
          content={pageTitle?.replace(/-/g, " ")}
          styleDiv="mb-4"
          styleTitle="text-[#da966e] text-2xl font-normal border-l-4 pl-2.5"
        />

        <LayoutAllFilm arrMovie={arrMovie} />

        {arrMovie?.length !== 0 ? (
          <Pagination
            paginationData={{
              currentPage,
              totalPages,
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
