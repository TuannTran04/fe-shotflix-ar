"use client";
import Image from "next/legacy/image";
import Link from "next/link";
import React from "react";
import { useSelector } from "react-redux";

const FormHeader = ({ nameUserEdit }) => {
  const user = useSelector((state) => state.auth.login.currentUser);

  return (
    <div className="flex justify-start items-center mb-[25px]">
      <div className="relative h-[150px] w-[150px]">
        <Image
          src={user?.avatar || "/unknowAvatar.webp"}
          className="block w-full rounded-[50%] object-cover"
          alt="pic"
          layout="fill"
          priority
        />
      </div>

      <div className="ml-[15px]">
        <div className="mb-[10px] max-w-[300px]">
          <h1 className="w-full text-xl font-semibold text-white whitespace-nowrap text-ellipsis overflow-hidden">
            {user?.username || nameUserEdit}
          </h1>
        </div>
        <div>
          <Link
            className="py-[6px] px-[10px] bg-[#567] text-[#c8d4e0] text-sm font-normal tracking-[.075em] rounded-[3px] shadow cursor-pointer select-none hover:bg-[#678] hover:text-white"
            href="#"
          >
            HEHE!
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FormHeader;
