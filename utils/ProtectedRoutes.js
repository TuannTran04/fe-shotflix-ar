import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children }) => {
  const router = useRouter();
  const user = useSelector((state) => state.auth.login.currentUser) || null;
  // console.log(user);

  if (user == null || !user.accessToken) {
    router.push("/");
    return; // Dừng quá trình render ở đây nếu không có user
  }

  // if (user || user?.accessToken) {
  //   return children;
  // }

  // Trả về children nếu có user
  return children;
};

export default ProtectedRoute;
