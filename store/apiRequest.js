import {
  loginFailed,
  loginStart,
  loginSuccess,
  logOutSuccess,
  logOutFailed,
  logOutStart,
  registerStart,
  registerSuccess,
  registerFailed,
} from "./authSlice";
import {
  addArrFavorite,
  addArrWatchLater,
  deleteSuccess,
  deleteSuccess_user,
} from "./filmSlice";
import axios from "axios";
import Cookies from "js-cookie";

////////////////////******************** AUTH ********************////////////////////////////
export const login = async (user, dispatch, router, toast, setIsLoading) => {
  const base_url = process.env.NEXT_PUBLIC_URL;
  dispatch(loginStart());
  try {
    setIsLoading(true);

    const res = await axios.post(`${base_url}/api/v1/auth/login`, user, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
    console.log(res);
    if (res.data.status == 200) {
      // const { loveMovie, markBookMovie, ...other } = res.data.data;
      // console.log(loveMovie);
      // console.log(markBookMovie);
      // console.log(other);
      // let c = res.data.data.accessToken.toString();
      // Cookies.set("user-server", "abc");
      // Cookies.set("accessToken", c);
      dispatch(loginSuccess(res.data.metadata));
      // dispatch(addArrFavorite(loveMovie));
      // dispatch(addArrWatchLater(markBookMovie));
      setIsLoading(false);
      toast("Đăng nhập thành công");
      router.push("/");
    }
  } catch (err) {
    console.log(err);
    setIsLoading(false);
    dispatch(loginFailed());
    if (err?.response?.data?.code === 403) {
      toast(err.response.data.message);
    }
    if (err?.response?.data?.code === 401) {
      toast(err.response.data.message);
    }
  }
};

export const registerOTP = async (
  dataForm,
  verifyOTP,
  setVerifyOTP,
  dispatch,
  router,
  toast,
  setIsLoading
) => {
  const base_url = process.env.NEXT_PUBLIC_URL;
  dispatch(registerStart());

  try {
    setIsLoading(true);

    let response;
    // console.log(">>> dataForm REGISTER VERIFY <<<", dataForm);

    if (!verifyOTP) {
      response = await axios.post(`${base_url}/api/v1/auth/register`, dataForm);
      console.log(">>> Response REGISTER <<<", response);
      if (response.status === 200) {
        setVerifyOTP(true);
        console.log(response.data);
        setIsLoading(false);
        toast(response?.data?.message);
      }
    } else {
      response = await axios.post(
        `${base_url}/api/v1/auth/register/verify`,
        dataForm
      );
      console.log(">>> Response REGISTER VERIFY <<<", response);
      console.log(">>> dataForm REGISTER VERIFY <<<", dataForm);
      const { username, password, email } = dataForm;
      dispatch(registerSuccess({ username, password, email }));
      setIsLoading(false);
      toast(response?.data?.message);
      router.push("/dang-nhap");
    }
  } catch (error) {
    console.log(error);
    setIsLoading(false);
    dispatch(registerFailed());

    if (error?.response?.data?.code == 401) {
      toast(error?.response?.data?.message);
    }
    if (error?.response?.data?.code == 404) {
      toast(error?.response?.data?.message);
    }
  }
};

export const logOut = async (dispatch, id, router) => {
  const base_url = process.env.NEXT_PUBLIC_URL;
  try {
    dispatch(logOutStart());
    dispatch(logOutSuccess());
    dispatch(deleteSuccess_user());
    await axios.get(`${base_url}/api/v1/auth/logout`, {
      withCredentials: true,
    });
    // Cookies.remove("accessToken");
    router.push("/");
  } catch (err) {
    dispatch(logOutFailed());
  }
};

////////////////////******************** USERS ********************////////////////////////////
// export const getAllUsers = async (token, dispatch, axiosJWT) => {
//   // dispatch(getUsersStart());
//   const base_url = process.env.NEXT_PUBLIC_URL;
//   try {
//     const res = await axiosJWT.get(`${base_url}/api/v1/user/`, {
//       headers: { token: `Bearer ${token}` },
//     });
//     // dispatch(getUsersSuccess(res.data));
//     // console.log(res);
//     return res;
//   } catch (err) {
//     // dispatch(getUsersFailed());
//     console.log(err);
//     throw new Error(err);
//   }
// };

export const updateInfoUser = async (
  formData,
  token,
  controller,
  dispatch,
  router,
  axiosJWT,
  toast,
  setIsLoading
) => {
  // dispatch(getUsersStart());
  const base_url = process.env.NEXT_PUBLIC_URL;
  try {
    setIsLoading(true);
    const res = await axiosJWT.put(
      `${base_url}/api/v1/user/update-info-user`,
      formData,
      {
        headers: {
          token: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        signal: controller.signal,
      }
    );
    console.log(res);

    if (res?.status === 200 && res?.data?.metadata?.data) {
      setIsLoading(false);
      const newData = { ...res?.data?.metadata?.data, accessToken: token };
      dispatch(loginSuccess(newData));
      toast.success("Chỉnh sửa thành công!");
      router.push("/trang-ca-nhan/" + res?.data?.metadata?.data?.username);
    } else {
      toast.success("Eo dc!");
    }

    // return res;
  } catch (err) {
    // dispatch(getUsersFailed());
    console.log(err);
    setIsLoading(false);
    controller.abort();
  }
};

// export const deleteUser = async (id, dispatch, token) => {
//   dispatch(deleteUsersStart());
//   try {
//     const res = await axios.delete("/v1/user/" + id, {
//       headers: { token: `Bearer ${token}` },
//     });
//     dispatch(deleteUsersSuccess(res.data));
//   } catch (err) {
//     dispatch(deleteUsersFailed(err.response.data));
//   }
// };

////////////////////******************** MOVIES ********************////////////////////////////
export const getAllMovies = async () => {
  const base_url = process.env.NEXT_PUBLIC_URL;
  // dispatch(getUsersStart());
  try {
    const res = await axios.get(`${base_url}/api/v1/movie`);
    // console.log(res);
    return res;
    // dispatch(getUsersSuccess(res.data));
  } catch (err) {
    // dispatch(getUsersFailed());
    console.log(err);
    throw new Error(err);
  }
};

export const getFavoriteAndWatchLaterMovies = async (
  token,
  dispatch,
  axiosJWT,
  controller
) => {
  const base_url = process.env.NEXT_PUBLIC_URL;

  const config = {
    headers: { token: `Bearer ${token}` },
  };

  if (controller) {
    config.signal = controller.signal;
  }

  try {
    const res = await axiosJWT.get(
      `${base_url}/api/v1/user/get-favorite-bookmark-movie`,
      config
    );

    dispatch(addArrFavorite(res.data.metadata.user.loveMovie));
    dispatch(addArrWatchLater(res.data.metadata.user.markBookMovie));

    console.log(">>> getFavoriteAndWatchLaterMovies <<<", res);
    return res;
  } catch (err) {
    console.log(err);
    // throw new Error(err);
  }
};

export const getFavoriteMovies = async (
  token,
  dispatch,
  axiosJWT,
  controller
) => {
  const base_url = process.env.NEXT_PUBLIC_URL;

  const config = {
    headers: { token: `Bearer ${token}` },
  };

  if (controller) {
    config.signal = controller.signal;
  }

  try {
    const res = await axiosJWT.get(
      `${base_url}/api/v1/user/get-favorite-movie`,
      config
    );
    dispatch(addArrFavorite(res.data.loveMovie));
    console.log(">>> getFavoriteMovies <<<", res);
    return res;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

export const getWatchLaterMovies = async (
  token,
  dispatch,
  axiosJWT,
  controller
) => {
  // dispatch(getUsersStart());
  const base_url = process.env.NEXT_PUBLIC_URL;

  const config = {
    headers: { token: `Bearer ${token}` },
  };

  if (controller) {
    config.signal = controller.signal;
  }

  try {
    const res = await axiosJWT.get(
      `${base_url}/api/v1/user/get-bookmark-movie`,
      config
    );
    dispatch(addArrWatchLater(res.data.markBookMovie));
    // console.log(">>> getWatchLaterMovies <<<", res);
    return res;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

export const addFavoriteMovie = async (
  userId,
  movieId,
  accessToken,
  axiosJWT
) => {
  const data = { userId, movieId };
  const base_url = process.env.NEXT_PUBLIC_URL;
  // dispatch(getUsersStart());
  try {
    const res = await axiosJWT.post(
      `${base_url}/api/v1/movie/add-favorite-movie`,
      data,
      {
        headers: { token: `Bearer ${accessToken}` },
      }
    );
    return res;
    // dispatch(getUsersSuccess(res.data));
  } catch (err) {
    // dispatch(getUsersFailed());
    console.log(err);
    throw new Error(err);
  }
};
export const deleteFavoriteMovie = async (
  userId,
  movieId,
  accessToken,
  axiosJWT
) => {
  const data = { userId, movieId };
  const base_url = process.env.NEXT_PUBLIC_URL;
  // dispatch(getUsersStart());
  try {
    const res = await axiosJWT.post(
      `${base_url}/api/v1/movie/delete-favorite-movie`,
      data,
      {
        headers: { token: `Bearer ${accessToken}` },
      }
    );
    return res;
    // dispatch(getUsersSuccess(res.data));
  } catch (err) {
    // dispatch(getUsersFailed());
    console.log(err);
    throw new Error(err);
  }
};

export const addBookmarkMovie = async (
  userId,
  movieId,
  accessToken,
  axiosJWT
) => {
  const data = { userId, movieId };
  const base_url = process.env.NEXT_PUBLIC_URL;
  // dispatch(getUsersStart());
  try {
    const res = await axiosJWT.post(
      `${base_url}/api/v1/movie/add-bookmark-movie`,
      data,
      {
        headers: { token: `Bearer ${accessToken}` },
      }
    );
    console.log(res);
    return res;
    // dispatch(getUsersSuccess(res.data));
  } catch (err) {
    // dispatch(getUsersFailed());
    console.log(err);
    throw new Error(err);
  }
};
export const deleteBookmarkMovie = async (
  userId,
  movieId,
  accessToken,
  axiosJWT
) => {
  const data = { userId, movieId };
  const base_url = process.env.NEXT_PUBLIC_URL;
  // dispatch(getUsersStart());
  try {
    const res = await axiosJWT.post(
      `${base_url}/api/v1/movie/delete-bookmark-movie`,
      data,
      {
        headers: { token: `Bearer ${accessToken}` },
      }
    );
    console.log(res);
    return res;
    // dispatch(getUsersSuccess(res.data));
  } catch (err) {
    // dispatch(getUsersFailed());
    console.log(err);
    throw new Error(err);
  }
};

export const ratingMovie = async (token, dispatch, axiosJWT, data) => {
  // const data = { userId, movieId, isBookmark };
  const base_url = process.env.NEXT_PUBLIC_URL;
  // dispatch(getUsersStart());
  try {
    const res = await axiosJWT.put(`${base_url}/api/v1/movie/rating`, data, {
      headers: { token: `Bearer ${token}` },
    });
    console.log(res);
    return res;
    // dispatch(getUsersSuccess(res.data));
  } catch (err) {
    // dispatch(getUsersFailed());
    console.log(err);
    throw new Error(err);
  }
};

////////////////////******************** COMMENT ********************////////////////////////////
export const getCommentV2 = async (
  movieId,
  nextCursor,
  batchSize,
  accessToken,
  axiosJWT,
  controller
) => {
  const base_url = process.env.NEXT_PUBLIC_URL;
  // dispatch(getUsersStart());
  try {
    const res = await axiosJWT.get(
      `${base_url}/api/v1/comment/getAllCmtV2/${movieId}?&batchSize=${batchSize}&nextCursor=${nextCursor}`,
      {
        headers: { token: `Bearer ${accessToken}` },
        signal: controller.signal,
      }
    );

    return res;
  } catch (err) {
    console.log(err);
    // throw new Error(err);
  }
};
export const getCommentInBranchV2 = async (
  movieId,
  parentCommentId,
  nextCursorChild,
  batchSize,
  accessToken,
  axiosJWT,
  controller
) => {
  const base_url = process.env.NEXT_PUBLIC_URL;
  // dispatch(getUsersStart());
  try {
    const res = await axiosJWT.get(
      `${base_url}/api/v1/comment/getCmtInBranchV2/${movieId}/${parentCommentId}?nextCursor=${nextCursorChild}&batchSize=${batchSize}`,
      {
        headers: { token: `Bearer ${accessToken}` },
        signal: controller.signal,
      }
    );
    return res;
  } catch (err) {
    console.log(err);
    controller.abort();
  }
};
export const getComment = async (
  movieId,
  page,
  batchSize,
  accessToken,
  axiosJWT,
  controller
) => {
  const base_url = process.env.NEXT_PUBLIC_URL;
  // dispatch(getUsersStart());
  try {
    const res = await axiosJWT.get(
      `${base_url}/api/v1/comment/${movieId}?page=${page}&batchSize=${batchSize}`,
      {
        headers: { token: `Bearer ${accessToken}` },
        signal: controller.signal,
      }
    );
    // console.log(res);
    return res;
    // dispatch(getUsersSuccess(res.data));
  } catch (err) {
    // dispatch(getUsersFailed());
    console.log(err);
    throw new Error(err);
  }
};
export const addCommentV2 = async (
  userId,
  movieId,
  parentCommentId = null,
  text,
  accessToken,
  axiosJWT
) => {
  const data = { userId, movieId, text, parentCommentId };
  const base_url = process.env.NEXT_PUBLIC_URL;
  try {
    const res = await axiosJWT.post(
      `${base_url}/api/v1/comment/add-commentV2`,
      data,
      {
        headers: {
          token: `Bearer ${accessToken}`,
        },
      }
    );
    return res;
  } catch (err) {
    console.log(err);
  }
};
export const addComment = async (
  userId,
  movieId,
  text,
  accessToken,
  axiosJWT
) => {
  const data = { userId, movieId, text };
  const base_url = process.env.NEXT_PUBLIC_URL;
  // dispatch(getUsersStart());
  try {
    const res = await axiosJWT.post(
      `${base_url}/api/v1/comment/add-comment`,
      data,
      {
        headers: {
          token: `Bearer ${accessToken}`,
        },
      }
    );
    return res;
    // dispatch(getUsersSuccess(res.data));
  } catch (err) {
    // dispatch(getUsersFailed());
    console.log(err);
  }
};
export const addReplyComment = async (
  userId,
  movieId,
  commentId,
  text,
  accessToken,
  axiosJWT
) => {
  const data = { userId, movieId, commentId, text };
  const base_url = process.env.NEXT_PUBLIC_URL;
  // dispatch(getUsersStart());
  try {
    const res = await axiosJWT.post(
      `${base_url}/api/v1/comment/add-reply-comment`,
      data,
      {
        headers: {
          token: `Bearer ${accessToken}`,
        },
      }
    );
    return res;
    // dispatch(getUsersSuccess(res.data));
  } catch (err) {
    // dispatch(getUsersFailed());
    console.log(err);
  }
};
export const updateCommentByIdV2 = async (
  userId,
  movieId,
  commentId,
  text,
  accessToken,
  axiosJWT
) => {
  const data = { userId, movieId, commentId, text };
  const base_url = process.env.NEXT_PUBLIC_URL;
  // dispatch(getUsersStart());
  try {
    const res = await axiosJWT.put(
      `${base_url}/api/v1/comment/update-commentV2`,
      data,
      {
        headers: {
          token: `Bearer ${accessToken}`,
        },
      }
    );
    return res;
  } catch (err) {
    console.log(err);
  }
};
export const updateCommentById = async (
  userId,
  movieId,
  commentId,
  text,
  accessToken,
  axiosJWT
) => {
  const data = { userId, movieId, commentId, text };
  const base_url = process.env.NEXT_PUBLIC_URL;
  // dispatch(getUsersStart());
  try {
    const res = await axiosJWT.put(
      `${base_url}/api/v1/comment/update-comment`,
      data,
      {
        headers: {
          token: `Bearer ${accessToken}`,
        },
      }
    );
    return res;
    // dispatch(getUsersSuccess(res.data));
  } catch (err) {
    // dispatch(getUsersFailed());
    console.log(err);
  }
};
export const updateReplyCommentById = async (
  userId,
  movieId,
  commentId,
  commentParentId,
  text,
  accessToken,
  axiosJWT
) => {
  const data = { userId, movieId, commentId, commentParentId, text };
  const base_url = process.env.NEXT_PUBLIC_URL;
  // dispatch(getUsersStart());
  try {
    const res = await axiosJWT.put(
      `${base_url}/api/v1/comment/update-reply-comment`,
      data,
      {
        headers: {
          token: `Bearer ${accessToken}`,
        },
      }
    );
    return res;
    // dispatch(getUsersSuccess(res.data));
  } catch (err) {
    // dispatch(getUsersFailed());
    console.log(err);
  }
};
export const deleteCommentByIdV2 = async (commentId, accessToken, axiosJWT) => {
  const base_url = process.env.NEXT_PUBLIC_URL;
  try {
    const res = await axiosJWT.delete(
      `${base_url}/api/v1/comment/delete-commentV2/${commentId}`,
      {
        headers: {
          token: `Bearer ${accessToken}`,
        },
      }
    );
    console.log(res);
    return res;
  } catch (err) {
    console.log(err);
  }
};
export const deleteCommentById = async (commentId, accessToken, axiosJWT) => {
  const base_url = process.env.NEXT_PUBLIC_URL;
  try {
    const res = await axiosJWT.delete(
      `${base_url}/api/v1/comment/delete-comment/${commentId}`,
      {
        headers: {
          token: `Bearer ${accessToken}`,
        },
      }
    );
    console.log(res);
    return res;
  } catch (err) {
    console.log(err);
  }
};
export const deleteReplyCommentById = async (
  commentId,
  commentParentId,
  accessToken,
  axiosJWT
) => {
  const base_url = process.env.NEXT_PUBLIC_URL;
  try {
    const res = await axiosJWT.delete(
      `${base_url}/api/v1/comment/delete-reply-comment/${commentParentId}/${commentId}`,
      {
        headers: {
          token: `Bearer ${accessToken}`,
        },
      }
    );
    console.log(res);
    return res;
  } catch (err) {
    console.log(err);
  }
};

////////////////////******************** NOTIFY ********************////////////////////////////
export const getNotify = async (
  id,
  page,
  batchSize,
  accessToken,
  axiosJWT,
  controller
) => {
  const base_url = process.env.NEXT_PUBLIC_URL;
  // dispatch(getUsersStart());
  try {
    const res = await axiosJWT.get(
      `${base_url}/api/v1/notify/${id}?page=${page}&batchSize=${batchSize}`,
      {
        headers: { token: `Bearer ${accessToken}` },
        signal: controller.signal,
      }
    );
    // console.log(res);
    return res;
    // dispatch(getUsersSuccess(res.data));
  } catch (err) {
    // dispatch(getUsersFailed());
    console.log(err);
  }
};
export const getUnreadNotifyCount = async (
  id,
  accessToken,
  axiosJWT,
  controller
) => {
  const base_url = process.env.NEXT_PUBLIC_URL;
  // dispatch(getUsersStart());
  try {
    const res = await axiosJWT.get(
      `${base_url}/api/v1/notify/get-unread-notify/${id}`,
      {
        headers: { token: `Bearer ${accessToken}` },
        signal: controller.signal,
      }
    );
    // console.log(res);
    return res;
    // dispatch(getUsersSuccess(res.data));
  } catch (err) {
    // dispatch(getUsersFailed());
    console.log(err);
  }
};
export const addNotify = async (
  sender,
  recipient,
  movieId,
  commentId,
  text,
  accessToken,
  axiosJWT
) => {
  const data = { sender, recipient, movieId, commentId, text };
  const base_url = process.env.NEXT_PUBLIC_URL;
  // dispatch(getUsersStart());
  try {
    const res = await axiosJWT.post(
      `${base_url}/api/v1/notify/add-notify`,
      data,
      {
        headers: {
          token: `Bearer ${accessToken}`,
        },
      }
    );
    return res;
    // dispatch(getUsersSuccess(res.data));
  } catch (err) {
    // dispatch(getUsersFailed());
    console.log(err);
  }
};
export const updateNotifyRead = async (notifyId, accessToken, axiosJWT) => {
  const data = { notifyId };
  const base_url = process.env.NEXT_PUBLIC_URL;

  try {
    const res = await axiosJWT.put(
      `${base_url}/api/v1/notify/update-notify-read`,
      data,
      {
        headers: {
          token: `Bearer ${accessToken}`,
        },
      }
    );
    return res;
  } catch (err) {
    console.log(err);
  }
};
export const updateNotifySeen = async (userId, accessToken, axiosJWT) => {
  const data = { userId };
  const base_url = process.env.NEXT_PUBLIC_URL;
  // dispatch(getUsersStart());
  try {
    const res = await axiosJWT.put(
      `${base_url}/api/v1/notify/update-notify-seen`,
      data,
      {
        headers: {
          token: `Bearer ${accessToken}`,
        },
      }
    );
    return res;
    // dispatch(getUsersSuccess(res.data));
  } catch (err) {
    // dispatch(getUsersFailed());
    console.log(err);
  }
};
export const deleteNotifyById = async (notifyId, accessToken, axiosJWT) => {
  const base_url = process.env.NEXT_PUBLIC_URL;
  // dispatch(getUsersStart());
  try {
    const res = await axiosJWT.delete(
      `${base_url}/api/v1/notify/delete-notify/${notifyId}`,
      {
        headers: {
          token: `Bearer ${accessToken}`,
        },
      }
    );
    console.log(res);
    return res;
    // dispatch(getUsersSuccess(res.data));
  } catch (err) {
    // dispatch(getUsersFailed());
    console.log(err);
  }
};
