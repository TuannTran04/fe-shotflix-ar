const SkeletonImg = ({
  rows = 1,
  width,
  height = "h-[340px]",
  isSidebarContent,
}) => {
  let content;

  content = (
    <div className={`flex justify-center items-center ${height} mx-2.5`}>
      {Array(rows)
        .fill("")
        .map((_, index) => (
          <div
            key={index}
            role="status"
            className=" col-span-1 w-full h-full animate-pulse flex justify-center items-center"
          >
            <div className="flex items-center justify-center w-full h-full bg-gray-300 rounded sm:w-96 dark:bg-gray-700">
              <svg
                className="w-10 h-10 text-gray-200 dark:text-gray-600"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 18"
              >
                <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
              </svg>
            </div>
          </div>
        ))}
    </div>
  );

  if (isSidebarContent) {
    content = (
      <div
        role="status"
        className={`animate-pulse space-x-8 mb-2.5 flex items-center ${height}`}
      >
        <div className="flex items-center justify-center w-full h-full bg-gray-300 rounded dark:bg-gray-700">
          <svg
            className="w-10 h-10 text-gray-200 dark:text-gray-600"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 18"
          >
            <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
          </svg>
        </div>
        <div className="w-full">
          <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
          <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[480px] mb-2.5"></div>
          <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
          <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[440px] mb-2.5"></div>
          {/* <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[460px] mb-2.5"></div>
          <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px]"></div> */}
        </div>
      </div>
    );
  }

  return content;
};

export default SkeletonImg;

// const SkeletonImg = ({ rows = 3 }) => {
//   return (
//     <div className="bg-white px-[6px]">
//       <div className="flex gap-x-2">
//         {Array(rows)
//           .fill("")
//           .map((_, index) => (
//             <div
//               key={index}
//               role="status"
//               className="relative mb-2 flex w-[30px] animate-pulse items-start rounded border border-[#D6E0F5] bg-white p-3"
//             >
//               <div className="w-full">
//                 <div className="h-[50px] rounded-sm bg-gray-200"></div>
//               </div>
//             </div>
//           ))}
//       </div>
//     </div>
//   );
// };
