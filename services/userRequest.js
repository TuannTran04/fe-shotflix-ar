import axios from "axios";
import Cookies from "js-cookie";
import {
  registerFailed,
  registerStart,
  registerSuccess,
} from "../store/authSlice";

export const forgotPwdUser = async (
  formData,
  router,
  dispatch,
  toast,
  verifyOTP,
  setVerifyOTP,
  setIsLoading
) => {
  const base_url = process.env.NEXT_PUBLIC_URL;
  dispatch(registerStart());

  try {
    setIsLoading(true);

    let response;
    if (!verifyOTP) {
      response = await axios.put(
        `${base_url}/api/v1/auth/forgot-pwd-user`,
        formData
      );
      console.log(response);
      if (response.status === 200) {
        setVerifyOTP(true);
        setIsLoading(false);
        toast(response?.data?.message);
      }
    } else {
      response = await axios.put(
        `${base_url}/api/v1/auth/forgot-pwd-user-verify`,
        formData
      );
      console.log(">>> Response FORGOT VERIFY <<<", response);
      const { password, email } = formData;
      dispatch(registerSuccess({ password, email }));
      toast(response?.data?.message);
      setIsLoading(false);
      router.push("/dang-nhap");
    }
  } catch (error) {
    console.log(error);
    setIsLoading(false);
    dispatch(registerFailed());

    const errorCodes = [401, 403, 404];

    errorCodes.forEach((code) => {
      if (error?.response?.data?.code === code) {
        toast(error?.response?.data?.message);
      }
    });
  }
};

// SEARCH MOVIES
export const searchMovies = async (query) => {
  const base_url = process.env.NEXT_PUBLIC_URL;
  try {
    const res = await axios.get(
      `${base_url}/api/v1/movie/search-movie?q=${query}`
    );
    return res;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

export const getMoviesByCate = async (cateId, currentPage, pageSize) => {
  const base_url = process.env.NEXT_PUBLIC_URL;
  try {
    const res = await axios.get(
      `${base_url}/api/v1/movie/get-category-movie?cateId=${cateId}&page=${currentPage}&pageSize=${pageSize}`
    );
    return res;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

export const getMoreMovies = async (name, currentPage, pageSize) => {
  const base_url = process.env.NEXT_PUBLIC_URL;
  try {
    const res = await axios.get(
      `${base_url}/api/v1/movie/get-more-movies?moreFilm=${name}&page=${currentPage}&pageSize=${pageSize}`
    );
    return res;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};
