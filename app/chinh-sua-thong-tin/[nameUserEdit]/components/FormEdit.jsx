"use client";
import { loginSuccess } from "@/store/authSlice";
import { createAxios } from "@/utils/createInstance";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { updateInfoUser } from "@/store/apiRequest";
import Loading from "@/components/Loading/Loading";

const FormEdit = ({ toast }) => {
  const schema = yup.object().shape({
    username: yup
      .string()
      .min(6)
      .max(20)
      .matches(/^\S*$/, "Username cannot contain spaces")
      .required(),
    email: yup.string().email("Invalid email format").required(),
  });

  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.login.currentUser);
  const accessToken = user?.accessToken;
  const refreshToken = user?.refreshToken;
  // let axiosJWT = createAxios(user, null, null);
  let axiosJWT = createAxios(user, dispatch, loginSuccess, router);

  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    const controller = new AbortController();

    // console.log(">>> Data EDIT <<<", data);

    const newData = { ...data, avatar2: data?.avatar2?.[0] };

    const formData = new FormData();
    Object.entries(newData).forEach(([key, value]) => {
      if (value !== null) {
        if (key === "avatar2") {
          formData.append(key, value);
        } else {
          formData.append(key, value?.toString());
        }
      }
    });

    console.log(...formData.entries());

    const response = await updateInfoUser(
      formData,
      accessToken,
      controller,
      dispatch,
      router,
      axiosJWT,
      toast,
      setIsLoading
    );
    // console.log(response);
    // console.log(response.data.code === 200);
  };

  useEffect(() => {
    if (user) {
      setValue("username", user?.username);
      setValue("email", user?.email);
      setValue("givenName", user?.givenName);
      setValue("familyName", user?.familyName);
      setValue("national", user?.national);
      setValue("avatar", user?.avatar);
    }
  }, [user]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
      <div className="md:col-span-2 md:col-start-3">
        <h2 className="mb-[20px] text-xl font-normal text-white">
          Chỉnh sửa thông tin
        </h2>
        <form className="" onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-[20px]">
            <label className="block mb-[5px] text-base text-white">
              Username
            </label>
            <input
              className="block p-[9px] w-full text-[#89a] bg-[#2c3440] shadow-md outline-none rounded focus:bg-white focus:text-black"
              name="username"
              type="text"
              {...register("username", { required: true })}
            />
            {<span className="text-red-500">{errors.username?.message}</span>}
          </div>

          <div className="mb-[20px] grid md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label className="block mb-[5px] text-base text-white">Tên</label>
              <input
                className="block p-[9px] w-full text-[#89a] bg-[#2c3440] shadow-md outline-none rounded focus:bg-white focus:text-black"
                name="givenName"
                type="text"
                {...register("givenName", { required: false })}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block mb-[5px] text-base text-white">Họ</label>
              <input
                className="block p-[9px] w-full text-[#89a] bg-[#2c3440] shadow-md outline-none rounded focus:bg-white focus:text-black"
                name="familyName"
                type="text"
                {...register("familyName", { required: false })}
              />
            </div>
          </div>

          <div className="mb-[20px]">
            <label className="block mb-[5px] text-base text-white">Email</label>
            <input
              className="block p-[9px] w-full text-[#89a] bg-[#2c3440] shadow-md outline-none rounded focus:bg-white focus:text-black"
              name="email"
              type="email"
              {...register("email", { required: true })}
            />
            {<span className="text-red-500">{errors.email?.message}</span>}
          </div>

          <div className="mb-[20px]">
            <label className="block mb-[5px] text-base text-white">
              Quốc gia
            </label>
            <input
              className="block p-[9px] w-full text-[#89a] bg-[#2c3440] shadow-md outline-none rounded focus:bg-white focus:text-black"
              name="national"
              type="text"
              {...register("national", { required: false })}
            />
          </div>

          <div className="mb-[20px]">
            <label className="block mb-[5px] text-base text-white">
              Ảnh đại diện (Link)
            </label>
            <input
              className="block p-[9px] w-full text-[#89a] bg-[#2c3440] shadow-md outline-none rounded focus:bg-white focus:text-black"
              name="avatar"
              type="text"
              placeholder="link ảnh bất kỳ"
              {...register("avatar", { required: false })}
            />
          </div>

          <div className="mb-[20px]">
            <label className="block mb-[5px] text-base text-white">
              Ảnh đại diện 2 (File)
            </label>
            <input
              className="block p-[9px] w-full text-[#89a] bg-[#2c3440] shadow-md outline-none rounded focus:bg-white focus:text-black"
              name="avatar2"
              type="file"
              placeholder="link ảnh bất kỳ"
              {...register("avatar2", { required: false })}
            />
          </div>
          {isLoading ? (
            <Loading />
          ) : (
            <div className="flex items-center justify-end">
              <button
                type="submit"
                className="py-[9px] px-[16px] tracking-[.085em] text-sm font-bold text-[#f4fcf0] bg-[#00b020] rounded select-none cursor-pointer"
              >
                Lưu
              </button>
              <button
                type="button"
                className="ml-[10px] py-[9px] px-[16px] tracking-[.085em] text-sm font-bold text-[#f4fcf0] bg-[#2daaed] rounded select-none cursor-pointer"
                onClick={() => {
                  router.back();
                }}
              >
                Trở lại
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default FormEdit;
