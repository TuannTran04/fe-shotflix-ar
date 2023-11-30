function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    // <div
    //   className={`${className} z-10`}
    //   style={{
    //     ...style,
    //     display: "absolute",
    //     top: "50%",
    //     right: 0,
    //   }}
    //   onClick={onClick}
    // ></div>
    <button
      className="absolute top-[45%] right-0 text-white z-50 hover:bg-white hover:text-black rounded-md transition-all duration-300"
      onClick={onClick}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="w-12 h-12"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8.25 4.5l7.5 7.5-7.5 7.5"
        />
      </svg>
    </button>
  );
}

function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    // <div
    //   className={`${className} z-10`}
    //   style={{
    //     ...style,
    //     display: "absolute",
    //     top: "50%",
    //     left: 0,
    //   }}
    //   onClick={onClick}
    // />
    <button
      className="absolute top-[45%] left-0 text-white z-50 hover:bg-white hover:text-black rounded-md transition-all duration-300"
      onClick={onClick}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="w-12 h-12"
      >
        <path
          className="text-xl"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 19.5L8.25 12l7.5-7.5"
        />
      </svg>
    </button>
  );
}

export var settings = {
  className: "slider_latest_film",
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 5,
  slidesToScroll: 1,
  initialSlide: 0,
  autoplay: true,
  speed: 1000,
  autoplaySpeed: 5000,
  swipeToSlide: true,
  // arrows: false,
  nextArrow: <SampleNextArrow />,
  prevArrow: <SamplePrevArrow />,
  // appendDots: (dots) => (
  //   <div
  //     style={{
  //       width: "200px",
  //       backgroundColor: "#ddd",
  //       borderRadius: "10px",
  //       padding: "10px",
  //     }}
  //   >
  //     <ul style={{ margin: "0px" }}> {dots} </ul>
  //   </div>
  // ),
  // customPaging: (i) => (
  //   <div
  //     style={{
  //       width: "30px",
  //       color: "blue",
  //       border: "1px blue solid",
  //     }}
  //   >
  //     he
  //   </div>
  // ),
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
        infinite: true,
        dots: false,
      },
    },
    {
      breakpoint: 650,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
        initialSlide: 2,
        dots: false,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        dots: true,
      },
    },
  ],
};
