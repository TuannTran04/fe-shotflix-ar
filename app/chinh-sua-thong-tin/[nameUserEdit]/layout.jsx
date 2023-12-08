// import { Inter } from "next/font/google";
"use client";

import withAuth from "@/utils/withAuth";

// import withAuth from "@/utils/withAuth";

// import ArrowGotoUp from "@/components/ArrowGoToUp";
// import Footer from "@/components/Footer";
// import Header from "@/components/Header";

// const inter = Inter({ subsets: ['latin'] })

export default withAuth(function RootLayout({ children }) {
  return <main>{children}</main>;
});
