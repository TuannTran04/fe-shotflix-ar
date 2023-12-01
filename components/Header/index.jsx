import Image from "next/legacy/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { logOut } from "../../store/apiRequest";
import { useRouter } from "next/navigation";

import { searchMovies } from "../../services/userRequest";
import axios from "axios";
import SidebarHomeMobile from "../SidebarMobile/SidebarMobile";
import Notification from "../Notification/Notification";
import _ from "lodash";
import useDebounce from "@/hooks/useDebounce";
import Loading from "../Loading/Loading";

export default function Header({ categories }) {
  const router = useRouter();
  const user = useSelector((state) => state.auth.login.currentUser);
  const accessToken = user?.accessToken;
  const id = user?._id;
  const dispatch = useDispatch();

  const [arrSearchMovie, setArrSearchMovie] = useState([]);

  const [searchInput, setSearchInput] = useState("");
  const [showSearchResults, setSearchResults] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [showSearchInputMobile, setShowSearchInputMobile] = useState(false);

  const [showSideBarMobile, setShowSideBarMobile] = useState(false);

  const [isMdScreen, setIsMdScreen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const inputRef = useRef();
  const resultsRef = useRef(null);

  //////////////////////// SEARCH IP DEBOUNCE /////////////////////////////////
  const handleSearchInput = async (e) => {
    const { name, value } = e.target;
    setSearchInput(value);
  };
  const debouncedSearch = useDebounce(searchInput, 1000);
  useEffect(() => {
    setIsLoading(true);
    // search the api
    async function fetchData() {
      const res = await searchMovies(searchInput);
      if (res.data.code === 200) {
        setArrSearchMovie(res.data.data.movies);
        setIsLoading(false);
      } else {
        setArrSearchMovie([]);
        setIsLoading(false);
      }
    }
    // console.log(Boolean(debouncedSearch));
    if (debouncedSearch) fetchData();
  }, [debouncedSearch]);
  /////////////////////////////////////////////////////////

  // Handle Mobile
  const handleShowSidebarMobile = (e) => {
    setShowSideBarMobile((prev) => !prev);
  };
  const handleShowSearchInputMobile = (e) => {
    setShowSearchInputMobile((prev) => !prev);
    setSearchInput("");
  };

  const handleSubmitSearchInputMobile = (e) => {
    e.preventDefault();

    if (searchInput) {
      router.push(`/tim-kiem/${searchInput.replace(/\s+/g, "+")}`);
      handleShowSearchInputMobile();
      setSearchInput("");
    }
  };
  //////////////////////////////////////////

  const handleSubmitSearchInput = (e) => {
    e.preventDefault();
    setShowSearchInput((prev) => !prev);
    inputRef.current.focus();
    if (searchInput) {
      router.push(`/tim-kiem/${searchInput.replace(/\s+/g, "+")}`);
      setSearchInput("");
    }
  };

  const handleLogout = (e) => {
    e.preventDefault();
    logOut(dispatch, id, router);
  };

  // Sự kiện lắng nghe khi click chuột toàn trang
  useEffect(() => {
    const handleClickOutside = (e) => {
      // console.log(resultsRef.current);
      // Kiểm tra nếu kết quả đang hiển thị và chuột không nằm trong phần tử kết quả
      if (
        resultsRef.current &&
        !resultsRef.current.contains(e.target) &&
        e.target !==
          document.querySelector(".fa-magnifying-glass").parentNode &&
        e.target !== document.querySelector(".fa-magnifying-glass") &&
        e.target !== inputRef.current
      ) {
        setShowSearchInput(false); // Ẩn kết quả
        setShowSearchInputMobile(false); // Ẩn kết quả

        setSearchInput("");
        // console.log("ok");
      } else if (
        !resultsRef.current &&
        e.target !==
          document.querySelector(".fa-magnifying-glass").parentNode &&
        e.target !== document.querySelector(".fa-magnifying-glass") &&
        e.target !== inputRef.current
      ) {
        setShowSearchInput(false); // Ẩn kết quả
        setShowSearchInputMobile(false); // Ẩn kết quả
        // console.log("ok");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // Xác định kích thước màn hình và cập nhật trạng thái isLgScreen
    const handleResize = () => {
      setIsMdScreen(window.innerWidth >= 768); // Thay đổi ngưỡng theo yêu cầu của bạn
    };

    // Gắn sự kiện lắng nghe sự thay đổi kích thước màn hình
    window.addEventListener("resize", handleResize);

    // Khởi tạo trạng thái ban đầu
    handleResize();

    // Loại bỏ sự kiện lắng nghe khi component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <header className="bg-[#151414] h-20 relative top-0 left-0 right-0 z-[100] shadow-xl">
      <nav className="px-2 md:px-0 h-full mx-auto max-w-[1200px]">
        <div className="h-full flex justify-between items-center">
          <div className="block md:hidden">
            <span
              className="rounded bg-white text-black p-[8px] h-11 w-11 z-20"
              onClick={handleShowSidebarMobile}
            >
              <i className="fa-solid fa-bars"></i>
            </span>
          </div>

          {/* NAV MOBILE */}
          <SidebarHomeMobile
            categories={categories}
            showSideBarMobile={showSideBarMobile}
            setShowSideBarMobile={setShowSideBarMobile}
          />

          <div className="flex justify-center items-center bg-[#000543] px-[15px] w-[180px] h-full text-center">
            <Link href="/" className="relative inline-block w-full h-full">
              <Image
                // src="https://phimmoiyyy.net/wp-content/uploads/2023/03/phimmoi.png"
                className="block w-full h-full object-contain"
                src="/logo_shotflix.png"
                alt="Logo Shotflix"
                // src="https://ssphim.cc/themes/bptv/images/ssphim.png?v=1.0"
                // width={55}
                // height={55}
                layout="fill"
                priority
              />
            </Link>
          </div>

          <div className="hidden md:block flex-1 text-white">
            <ul className="flex justify-center items-center ">
              <li className="inline-block">
                <Link
                  href="/"
                  className="px-5 py-5 mx-2 block text-base font-semibold cursor-pointer hover:text-[#da966e]"
                >
                  Trang chủ
                </Link>
              </li>

              <li className="inline-block relative group hover:text-[#da966e]">
                <Link
                  href="#"
                  className="px-5 py-5 mx-2 block text-base font-semibold cursor-pointer"
                >
                  Thể loại
                  <span className="ml-1.5">
                    <i className="fa-solid fa-caret-down"></i>
                  </span>
                </Link>

                <ul className="overflow-hidden absolute top-14 w-[400px] lg:w-[450px] hidden bg-white text-gray-700 border border-gray-300 rounded-md group-hover:flex flex-wrap z-50">
                  {categories?.map((item, i) => (
                    <li
                      key={item._id}
                      className="w-4/12 min-h-[30px] inline-block hover:bg-gray-100"
                    >
                      <Link
                        href={`/the-loai/${item.slug}`}
                        className="py-1 px-3 block w-full text-[12px] overflow-hidden text-ellipsis whitespace-nowrap"
                        title={`${item.name}`}
                      >
                        <span>
                          {" "}
                          <span className="mr-2">
                            <i className="fa-solid fa-caret-right"></i>
                          </span>
                          {item.name}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </div>

          <div className="flex justify-end items-center  ">
            <div className="relative">
              <div className="md:mr-[8px] relative flex">
                {/* // SHOW IPNUT SEARCH LAPTOP */}
                <div className="relative h-[44px] w-[44px]">
                  {isMdScreen && (
                    <input
                      // className="absolute right-full inset-y-0 bg-[#2D2D2D] focus:outline-none px-3.5 text-white"
                      className={`hidden md:block absolute inset-y-0 placeholder:text-xs bg-[#2D2D2D] text-white transition-all duration-500 outline-none rounded-[5px] ${
                        showSearchInput
                          ? "opacity:100 w-[230px] right-[60%] px-3.5"
                          : "opacity:0 right-[30%] w-0 px-0"
                      }`}
                      ref={inputRef}
                      type="text"
                      name="searchInput"
                      value={searchInput}
                      onChange={handleSearchInput}
                      placeholder="vd: Tên phim, đạo diễn, diễn viên..."
                      autoComplete="off"
                    />
                  )}

                  {/* // SHOW ICON SEARCH LAPTOP */}
                  {isMdScreen && (
                    <button
                      className="absolute right-0 mr-2 rounded-full bg-white text-black h-11 w-11 z-[100]"
                      title="Tìm kiếm"
                      onClick={handleSubmitSearchInput}
                    >
                      <i className="fa-solid fa-magnifying-glass"></i>
                    </button>
                  )}

                  {/* // SHOW ICON SEARCH MOBILE */}
                  {!isMdScreen && !showSearchInputMobile && (
                    <button
                      className="mr-2 flex justify-center items-center rounded-full bg-white text-black h-11 w-11 z-20"
                      title="Tìm kiếm"
                      onClick={handleShowSearchInputMobile}
                    >
                      <i className="fa-solid fa-magnifying-glass text-[15px]"></i>
                    </button>
                  )}
                  {!isMdScreen && showSearchInputMobile && (
                    <button
                      className="mr-2 flex justify-center items-center rounded-full bg-red-600 text-black h-11 w-11 z-20"
                      title="Tắt tìm kiếm"
                      onClick={handleShowSearchInputMobile}
                    >
                      <i className="fa-solid fa-xmark text-[20px]"></i>
                    </button>
                  )}
                </div>

                {/* NOTFICATION  */}
                {isMdScreen && <Notification />}
              </div>

              {/* // SEARCH RESULTS LAPTOP? */}
              {searchInput && showSearchInput && isMdScreen && (
                <div
                  ref={resultsRef}
                  className="scroll_search_header absolute top-[110%] right-[80%] min-h-[50px] max-h-[300px] w-[330px] bg-[rgba(0,0,0,.8)] overflow-y-auto z-[100]"
                >
                  {isLoading ? (
                    <Loading />
                  ) : arrSearchMovie.length === 0 ? (
                    <p className="p-2 text-white text-center">
                      Không có kết quả tìm kiếm
                    </p>
                  ) : (
                    arrSearchMovie.map((item, i) => (
                      <div
                        key={item._id}
                        className="mb-[10px] p-2 h-[55px] flex items-center overflow-hidden"
                      >
                        <Link
                          href={`/xem-phim/${item.slug}`}
                          className="flex items-center justify-between w-full h-[55px] group"
                        >
                          <span className="relative max-w-[40%] w-full h-full mr-[10px] overflow-hidden">
                            <Image
                              src={item.photo?.[0]}
                              alt="pic"
                              className="object-cover w-full h-full group-hover:scale-110 transition-all duration-300"
                              layout="fill"
                            />
                          </span>

                          <span className="max-w-[60%] w-full h-full overflow-hidden group-hover:opacity-80">
                            <span className="block mb-[3px] text-[14px] text-[#0285b5] font-medium whitespace-nowrap text-ellipsis overflow-hidden">
                              {item.title}
                            </span>
                            <span className="block text-[12px] text-[#0285b5] font-extralight whitespace-nowrap text-ellipsis overflow-hidden">
                              {item.yearPublish}
                            </span>
                            <span className="block text-[11px] text-[#fff] font-thin whitespace-nowrap text-ellipsis overflow-hidden">
                              {item.views} views
                            </span>
                          </span>
                        </Link>
                      </div>
                    ))
                  )}

                  <div className="p-2 text-center border-t-[1px] border-[rgba(255,255,255,.3)]">
                    <p
                      className="text-xs text-white cursor-pointer italic"
                      onClick={handleSubmitSearchInput}
                    >
                      Xem tất cả kết quả
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="hidden md:block mr-[8px] w-[1px] h-[30px] bg-white opacity-50"></div>

            {!user ? (
              <div className="hidden md:flex justify-end items-center">
                <div className="mr-2.5">
                  <Link
                    className="text-sm font-semibold cursor-pointer text-white hover:underline"
                    href="/dang-nhap"
                  >
                    Đăng nhập
                  </Link>
                </div>
                <div className="">
                  <Link
                    className="text-sm font-semibold cursor-pointer text-white hover:underline"
                    href="/dang-ky"
                  >
                    Đăng ký
                  </Link>
                </div>
              </div>
            ) : (
              <div className="hidden md:block p-[5px] relative cursor-pointer group w-[150px] bg-white rounded">
                <div className="grid grid-cols-5">
                  <div className="col-span-4">
                    <Link
                      href={`/trang-ca-nhan/${user?.username
                        .replace(/\s+/g, "")
                        .toLowerCase()}`}
                      className="text-black font-bold whitespace-nowrap text-ellipsis overflow-hidden"
                      title={user?.username}
                    >
                      <p className="whitespace-nowrap text-ellipsis overflow-hidden">
                        {user?.username}
                      </p>
                    </Link>

                    <span className="flex items-center text-xs mt-[2px] col-span-1">
                      <i className="fa-solid fa-coins text-yellow-400 mr-[4px]"></i>
                      <p className="text-[#2DAAED] flex-1 font-semibold whitespace-nowrap text-ellipsis overflow-hidden">
                        12000
                      </p>
                    </span>
                  </div>

                  <span className="flex items-center justify-center">
                    <i className="fa-solid fa-caret-down"></i>
                  </span>
                </div>

                <ul className="overflow-hidden absolute z-50 top-[100%] left-0 right-0 hidden bg-white text-gray-700 border border-gray-300 rounded-md group-hover:block">
                  <li className="block hover:bg-gray-100">
                    <Link
                      href={`/trang-ca-nhan/${user?.username
                        .replace(/\s+/g, "-")
                        .toLowerCase()}`}
                      className="py-2.5 px-3.5 block w-full text-sm"
                    >
                      Trang cá nhân
                    </Link>
                  </li>
                  <li className="block hover:bg-gray-100">
                    <Link
                      href="#"
                      className="py-2.5 px-3.5 block w-full text-sm"
                      onClick={handleLogout}
                    >
                      Đăng xuất
                    </Link>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </nav>

      {!isMdScreen && showSearchInputMobile && (
        <div className="w-full flex flex-col justify-between">
          <div className="relative w-full">
            <input
              // className="absolute right-full inset-y-0 bg-[#2D2D2D] focus:outline-none px-3.5 text-white"
              className={`block px-2 py-4 w-full placeholder:text-base bg-[#2D2D2D] text-white outline-none transition-all duration-500 border-[0.3px] ${
                showSearchInput ? "" : ""
              }`}
              ref={inputRef}
              type="text"
              name="searchInput"
              value={searchInput}
              onChange={handleSearchInput}
              placeholder="vd: Tên phim, đạo diễn, diễn viên...."
              autoComplete="off"
            />
            <button
              className="p-[14px] absolute top-[50%] right-0 -translate-y-1/2 text-white"
              title="Tìm kiếm"
              onClick={handleSubmitSearchInputMobile}
            >
              <i className="fa-solid fa-magnifying-glass text-[20px]"></i>
            </button>
          </div>

          {/* // SEARCH RESULTS MOBILE? */}
          {searchInput && !isMdScreen && (
            <div
              ref={resultsRef}
              className="scroll_search_header min-h-[50px] max-h-[500px] bg-[rgba(0,0,0,.8)] overflow-y-auto "
            >
              {isLoading ? (
                <Loading />
              ) : arrSearchMovie.length === 0 ? (
                <p className="p-2 text-white text-center">
                  Không có kết quả tìm kiếm
                </p>
              ) : (
                arrSearchMovie.map((item, i) => (
                  <div
                    key={item._id}
                    className=" px-1 py-2 flex items-center overflow-hidden"
                  >
                    <Link
                      href={`/xem-phim/${item.slug}`}
                      className="flex items-center justify-between w-full h-[80px] group"
                      // rel="preload"
                      // as="script"
                    >
                      <span className="relative max-w-[40%] w-full h-full mr-[10px] overflow-hidden">
                        <Image
                          src={item.photo?.[0]}
                          alt="pic"
                          className="object-cover w-full h-full group-hover:scale-110 transition-all duration-300"
                          layout="fill"
                        />
                      </span>

                      <span className="max-w-[60%] w-full h-full overflow-hidden group-hover:opacity-80">
                        <span className="block mb-[3px] text-[14px] text-[#0285b5] font-medium whitespace-nowrap text-ellipsis overflow-hidden">
                          {item.title}
                        </span>
                        <span className="block text-[12px] text-[#0285b5] font-extralight whitespace-nowrap text-ellipsis overflow-hidden">
                          {item.yearPublish}
                        </span>
                        <span className="block text-[11px] text-[#fff] font-thin whitespace-nowrap text-ellipsis overflow-hidden">
                          {item.views} views
                        </span>
                      </span>
                    </Link>
                  </div>
                ))
              )}

              <div className="py-4 px-2 text-center border-t-[1px] border-[rgba(255,255,255,.3)]">
                <p
                  className="text-xs text-white cursor-pointer italic"
                  onClick={handleSubmitSearchInputMobile}
                >
                  Xem tất cả kết quả
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
