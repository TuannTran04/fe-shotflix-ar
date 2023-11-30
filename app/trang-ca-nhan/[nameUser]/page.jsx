"use client";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import FavoriteMovie from "./tabs/FavoriteMovie";
import WatchLaterMovie from "./tabs/WatchLaterMovie";
import { useSelector } from "react-redux";
import ProtectedRoute from "../../../utils/ProtectedRoutes";
import ProfileUser from "./tabs/ProfileUser";
import Header from "@/components/Header";
import ArrowGotoUp from "@/components/ArrowGoToUp";
import Footer from "@/components/Footer";
import Image from "next/legacy/image";
import LayoutRoot from "@/components/LayoutRoot";
import axios from "axios";

const arrTabs = [
  { id: 1, tabName: "Hồ sơ", tabPath: "profile" },
  { id: 2, tabName: "Yêu thích", tabPath: "favorite" },
  { id: 3, tabName: "Xem sau", tabPath: "watchLater" },
];

const UserManagePage = ({ params }) => {
  const nameUser = params.nameUser;

  const pathName = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const user = useSelector((state) => state.auth.login.currentUser);

  const [categories, setCategories] = useState([]);

  const [activeTab, setActiveTab] = useState(
    searchParams.get("tab") || "profile"
  );
  const handleNavigate = (tabName) => {
    router.push(
      `/trang-ca-nhan/${nameUser.replace(/\s+/g, "-")}?tab=${tabName}`
    );
  };

  const [showBigAvatar, setShowBigAvatar] = useState(false);

  // console.log(pathName);
  // console.log(pathName && pathName == `/trang-ca-nhan/${nameUser}`);

  useEffect(() => {
    router.push(
      `/trang-ca-nhan/${nameUser.replace(/\s+/g, "-")}?tab=${activeTab}`
    );
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
        // console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <ProtectedRoute>
      <LayoutRoot categories={categories}>
        <div className="sm:mt-2 mb-8 overflow-hidden">
          <div className="flex justify-start items-center mb-[25px]">
            <div className="relative h-[150px] w-[150px] select-none">
              <Image
                src={user?.avatar || "/unknowAvatar.webp"}
                className="nameUser-image-border block w-full h-full rounded-[50%] object-cover hover:!border-[1px] transition-all duration-100 cursor-pointer"
                alt="pic"
                layout="fill"
                priority
                onClick={() => {
                  setShowBigAvatar(true);
                }}
              />
            </div>

            {/* big overlay img */}
            {showBigAvatar && (
              <>
                <div
                  className="fixed inset-x-0 inset-y-0 bg-[rgba(0,0,0,0.7)] z-[150] cursor-pointer"
                  onClick={() => {
                    setShowBigAvatar(false);
                  }}
                ></div>

                <div className="fixed top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-[200]">
                  <div className="relative w-[400px] h-[500px] sm:w-[500px] sm:h-[500px]  select-none z-[200]">
                    <Image
                      src={user?.avatar || "/unknowAvatar.webp"}
                      className="block flex-1 w-full object-cover z-[200]"
                      alt="big pic"
                      layout="fill"
                      priority
                    />
                    <i
                      className="fa-solid fa-xmark absolute top-1 right-1 w-[30px] h-[30px] bg-white opacity-60 rounded-[50%] z-[250] cursor-pointer hover:opacity-100
                      before:flex before:h-full before:justify-center before:items-center 
                      "
                      onClick={() => {
                        setShowBigAvatar(false);
                      }}
                    ></i>
                  </div>
                </div>
              </>
            )}

            <div className="ml-[15px]">
              <div className="mb-[10px] max-w-[300px]">
                <h1 className="w-full text-xl font-semibold text-white whitespace-nowrap text-ellipsis overflow-hidden">
                  {user?.username || nameUser}
                </h1>
              </div>
              <div>
                <Link
                  className="py-[6px] px-[10px] bg-[#567] text-[#c8d4e0] text-sm font-normal tracking-[.075em] rounded-[3px] shadow cursor-pointer select-none hover:bg-[#678] hover:text-white"
                  href={`/chinh-sua-thong-tin/${user?.username || nameUser}`}
                >
                  Chỉnh sửa hồ sơ
                </Link>
              </div>
            </div>
          </div>

          {/* TABs */}
          <nav className="block border-[1px] border-[#24303c] rounded-[3px]">
            <ul className="scroll_tab_manage_user flex flex-nowrap mx-auto items-center overflow-x-auto">
              {arrTabs.map((item, index) => (
                <li key={item.id} className="mx-auto">
                  <Link
                    href="#"
                    className={`block p-[12px] text-base text-white underline-offset-8 hover:underline ${
                      activeTab == item.tabPath ? "underline" : ""
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setActiveTab(item.tabPath);
                      handleNavigate(item.tabPath);
                    }}
                  >
                    {item.tabName}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {searchParams.get("tab") && searchParams.get("tab") == "profile" ? (
          <ProfileUser userData={user} />
        ) : (
          ""
        )}

        {/* FILMs */}

        {searchParams.get("tab") && searchParams.get("tab") == "favorite" && (
          <FavoriteMovie />
        )}
        {searchParams.get("tab") && searchParams.get("tab") == "watchLater" && (
          <WatchLaterMovie />
        )}
      </LayoutRoot>
    </ProtectedRoute>
  );
};

export default UserManagePage;

// export async function getServerSideProps({ params }) {
//   const nameUser = params.nameUser;
//   let allCategory = await axios.get(
//     `${process.env.NEXT_PUBLIC_URL}/api/v1/category`
//   );
//   return {
//     props: {
//       nameUser,
//       categories: allCategory.data.data,
//     },
//   };
// }
