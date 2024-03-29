import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LayoutRoot from "@/components/LayoutRoot";
import FormEdit from "./components/FormEdit";
import FormHeader from "./components/FormHeader";

export const metadata = {
  title: "Chỉnh sửa thông tin",
  description: "Chỉnh sửa thông tin cá nhân",
};

const EditInfoUser = async ({ params }) => {
  const nameUserEdit = params.nameUserEdit;

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

  return (
    <>
      <LayoutRoot categories={cate}>
        <div className="sm:mt-2 mb-8 min-h-[400px] overflow-hidden">
          <FormHeader nameUserEdit={nameUserEdit} />
          <FormEdit toast={toast} />
        </div>
      </LayoutRoot>
      <ToastContainer />
    </>
  );
};

export default EditInfoUser;
