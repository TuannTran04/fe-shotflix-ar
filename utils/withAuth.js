import { useEffect } from "react";
import { redirect } from "next/navigation";
import { useSelector } from "react-redux";

const withAuth = (Component) => {
  return function WithAuth(props) {
    const user = useSelector((state) => state.auth.login?.currentUser) || null;
    // console.log(user);

    useEffect(() => {
      if (user == null || !user.accessToken) {
        redirect("/");
        return;
      }
    }, []);

    if (user == null || !user) {
      return null;
    }

    return <Component {...props} />;
  };
};

export default withAuth;
