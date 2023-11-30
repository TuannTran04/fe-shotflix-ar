import axios from "axios";

const useRefreshToken = () => {
  const refreshToken = async () => {
    try {
      console.log("call api refresh");
      // truyen len cookies
      const base_url = process.env.NEXT_PUBLIC_URL;
      const res = await axios.get(`${base_url}/api/v1/auth/refresh`, {
        withCredentials: true,
      });
      console.log(res);

      return res.data;
    } catch (err) {
      console.log("loi cmnr", err);
    }
  };
  return refreshToken;
};

export default useRefreshToken;
