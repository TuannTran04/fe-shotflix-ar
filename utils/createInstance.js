"use client";
import useRefreshToken from "@/hooks/useRefreshToken";
import { logOut } from "@/store/apiRequest";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const refreshToken = async ({ userId }) => {
  try {
    const base_url = process.env.NEXT_PUBLIC_URL;
    console.log("call api refresh");

    // Thêm thông tin x-client-id vào header
    const headers = {
      "x-client-id": userId, // Thêm thông tin x-client-id ở đây
    };

    // const res = await axios.post(`${base_url}/api/v1/auth/login`, user, {
    //   headers: { "Content-Type": "application/json" },
    //   withCredentials: true,
    // });

    // truyen len cookies
    const res = await axios.get(`${base_url}/api/v1/auth/refresh`, {
      headers,
      withCredentials: true,
    });
    console.log("res of RT:::", res);

    return res.data.metadata;
  } catch (err) {
    console.log("loi cmnr", err);
  }
};

// export const createAxios = (user, dispatch, stateSuccess, router) => {
//   // console.log("user createAxios", user);
//   const newInstance = axios.create({
//     baseURL: process.env.NEXT_PUBLIC_URL,
//     headers: { "Content-Type": "application/json" },
//     withCredentials: true,
//   });

//   const refresh = useRefreshToken();

//   useEffect(() => {
//     const requestIntercept = newInstance.interceptors.request.use(
//       (config) => {
//         console.log(">>> requestIntercept: <<<", config);
//         console.log(">>> requestIntercept: <<<", config.headers.Authorization);

//         // const decodedToken = jwt_decode(user?.accessToken);
//         // console.log(">>> decodedToken : <<<", decodedToken);

//         if (!config.headers["Authorization"]) {
//           console.log("khong co authorize thi gan'");
//           config.headers["Authorization"] = `Bearer ${user?.accessToken}`;
//         }
//         return config;
//       },
//       (error) => Promise.reject(error)
//     );

//     const responseIntercept = newInstance.interceptors.response.use(
//       (response) => {
//         console.log(">>> responseIntercept: <<<", response);
//         return response;
//       },
//       async (error) => {
//         const prevRequest = error?.config;
//         console.log(error);
//         if (error?.response?.status === 403 && !prevRequest?.sent) {
//           console.log("refresh tokennnnnnnnnnnnnnnnnnnnnnnn");
//           prevRequest.sent = true;
//           const newAccessToken = await refresh();

//           if (!newAccessToken && router) {
//             logOut(dispatch, null, router);
//             alert("Bạn đã hết phiên đăng nhập. Vui lòng đăng nhập lại!!!");
//             console.log("log outttttttttttttttttttt");
//           }

//           console.log("newAccessToken", newAccessToken);
//           const refreshUser = {
//             ...user,
//             accessToken: newAccessToken.accessToken,
//           };
//           console.log(">>> refreshUser new <<<", refreshUser);
//           if (dispatch && stateSuccess) {
//             console.log("dispatch ok");
//             dispatch(stateSuccess(refreshUser));
//           }

//           prevRequest.headers[
//             "Authorization"
//           ] = `Bearer ${newAccessToken.accessToken}`;
//           return newInstance(prevRequest);
//         }
//         return Promise.reject(error);
//       }
//     );

//     return () => {
//       newInstance.interceptors.request.eject(requestIntercept);
//       newInstance.interceptors.response.eject(responseIntercept);
//     };
//   }, []);

//   return newInstance;
// };

// Hàm đợi cho đến khi token được làm mới
function waitForRefreshToken() {
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      if (!refreshTokenInProgress) {
        clearInterval(interval);
        resolve();
      }
    }, 100);
  });
}

let refreshTokenPromise;
export const createAxios = (user, dispatch, stateSuccess, router, userId) => {
  // let isRefreshing = false;
  // let subscribers = [];
  // let refreshPromise = null;

  // console.log("user createAxios", user);
  const newInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_URL,
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  });

  const requestIntercept = newInstance.interceptors.request.use(
    (config) => {
      console.log(">>> requestIntercept: <<<", config);
      console.log(">>> requestIntercept: <<<", config.headers.Authorization);

      // const decodedToken = jwt_decode(user?.accessToken);
      // console.log(">>> decodedToken : <<<", decodedToken);

      if (!config.headers["Authorization"]) {
        console.log("khong co authorize thi gan'");
        config.headers["Authorization"] = `Bearer ${user?.accessToken}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  const responseIntercept = newInstance.interceptors.response.use(
    (response) => {
      console.log(">>> responseIntercept: <<<", response);
      return response;
    },
    async (error) => {
      const prevRequest = error?.config;
      console.log(error);
      if (error?.response?.status === 403 && !prevRequest?.sent) {
        prevRequest.sent = true;
        if (!refreshTokenPromise) {
          console.log("refresh tokennnnnnnnnnnnnnnnnnnnnnnn");

          refreshTokenPromise = refreshToken({ userId })
            .then((token) => {
              console.log("newAccessToken", token.accessToken);

              // console.log("newAccessToken",  token.accessToken);
              const refreshUser = {
                ...user,
                accessToken: token.accessToken,
              };
              console.log(">>> refreshUser new <<<", refreshUser);
              if (dispatch && stateSuccess && token.accessToken) {
                // && newAccessToken
                console.log("dispatch ok");
                dispatch(stateSuccess(refreshUser));
              }

              refreshTokenPromise = null; // clear state
              return token.accessToken; // resolve with the new token
            })
            .catch((err) => {
              console.log("catch err:::", err);
              if (err && router) {
                logOut(dispatch, null, router);
                alert("Bạn đã hết phiên đăng nhập. Vui lòng đăng nhập lại!!!");
                console.log("log outttttttttttttttttttt");
              }
            });
        }

        return refreshTokenPromise.then((token) => {
          console.log("newAccessToken 2222", token);

          prevRequest.headers["Authorization"] = `Bearer ${token}`;

          return newInstance(prevRequest);
        });

        // console.log("refresh tokennnnnnnnnnnnnnnnnnnnnnnn");
        // prevRequest.sent = true;
        // const newAccessToken = await refreshToken({ userId });

        // console.log("newAccessToken", newAccessToken);

        // if (!newAccessToken && router) {
        //   logOut(dispatch, null, router);
        //   // alert("Bạn đã hết phiên đăng nhập. Vui lòng đăng nhập lại!!!");
        //   console.log("log outttttttttttttttttttt");
        // }

        // console.log("newAccessToken", newAccessToken);
        // const refreshUser = {
        //   ...user,
        //   accessToken: newAccessToken.accessToken,
        // };
        // console.log(">>> refreshUser new <<<", refreshUser);
        // if (dispatch && stateSuccess) {
        //   // && newAccessToken
        //   console.log("dispatch ok");
        //   dispatch(stateSuccess(refreshUser));
        // }

        // prevRequest.headers[
        //   "Authorization"
        // ] = `Bearer ${newAccessToken.accessToken}`;
        // return newInstance(prevRequest);
      }
      return Promise.reject(error);
    }
  );

  // const responseIntercept = newInstance.interceptors.response.use(
  //   (response) => {
  //     console.log(">>> responseIntercept: <<<", response);
  //     return response;
  //   },
  //   async (error) => {
  //     const prevRequest = error?.config;
  //     if (error?.response?.status === 403 && !prevRequest?.sent) {
  //       if (!isRefreshing) {
  //         isRefreshing = true;
  //         prevRequest.sent = true;

  //         try {
  //           if (!refreshPromise) {
  //             console.log("refresh tokennnnnnnnnnnnnnnnnnnnnnnn");
  //             refreshPromise = refreshToken({ userId });
  //           }

  //           const newAccessToken = await refreshPromise;
  //           console.log("newAccessToken", newAccessToken);

  //           if (dispatch && stateSuccess && newAccessToken) {
  //             const refreshUser = {
  //               ...user,
  //               accessToken: newAccessToken.accessToken,
  //             };
  //             console.log(">>> refreshUser new <<<", refreshUser);
  //             // && newAccessToken
  //             console.log("dispatch ok");
  //             dispatch(stateSuccess(refreshUser));
  //           }

  //           // Cập nhật token mới cho các request đang đợi
  //           subscribers.forEach((callback) => callback(newAccessToken));
  //         } catch (refreshError) {
  //           // Xử lý lỗi khi gọi refreshToken
  //           console.log("log outttttttttttttttttttt");
  //           console.error("Error refreshing token:", refreshError);
  //           // Nếu có lỗi, đăng xuất và chuyển hướng tới trang đăng nhập
  //           logOut(dispatch, null, router);
  //         } finally {
  //           // Đặt lại các biến kiểm soát
  //           isRefreshing = false;
  //           refreshPromise = null;
  //           subscribers = [];
  //         }
  //       } else {
  //         // Nếu refreshToken đang được gọi, chờ đợi token mới
  //         const newToken = await new Promise((resolve) => {
  //           subscribers.push(resolve);
  //         });

  //         prevRequest.headers["Authorization"] = `Bearer ${newToken}`;
  //         return newInstance(prevRequest);
  //       }
  //     }
  //     return Promise.reject(error);
  //   }
  // );

  return newInstance;
};

// newInstance.interceptors.request.use(
//   async (config) => {
//     let date = new Date();
//     const decodedToken = jwt_decode(user?.accessToken);
//     //   check accesstoken expires , get new token with refresh token
//     if (decodedToken.exp < date.getTime() / 1000) {
//       const data = await refreshToken();
//       const refreshUser = {
//         ...user,
//         accessToken: data.accessToken,
//       };
//       if (dispatch && stateSuccess) {
//         dispatch(stateSuccess(refreshUser));
//       }
//       config.headers["token"] = "Bearer " + data.accessToken;
//     }
//     //
//     return config;
//   },
//   (err) => {
//     return Promise.reject(err);
//   }
// );
// return newInstance;
