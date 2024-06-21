import Image from "next/legacy/image";
import { useRouter } from "next/navigation";
import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import {
  addCommentV2,
  addNotify,
  addReplyComment,
  deleteCommentById,
  deleteCommentByIdV2,
  deleteReplyCommentById,
  getCommentInBranchV2,
  updateCommentById,
  updateCommentByIdV2,
  updateReplyCommentById,
} from "../../../store/apiRequest";
import { memo } from "react";
import { io } from "socket.io-client";
import { createAxios } from "@/utils/createInstance";
import { loginSuccess } from "@/store/authSlice";
import Loading from "@/components/Loading/Loading";

function timeAgo(createdAt) {
  const currentTime = new Date();
  const timeDifferenceInMilliseconds = currentTime - createdAt;

  if (timeDifferenceInMilliseconds < 1000) {
    return "Vừa mới đây";
  }

  const seconds = Math.floor(timeDifferenceInMilliseconds / 1000);
  if (seconds < 60) {
    return `${seconds} giây trước`;
  }

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes} phút trước`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} giờ trước`;
  }

  const days = Math.floor(hours / 24);
  if (days < 30) {
    return `${days} ngày trước`;
  }

  const months = Math.floor(days / 30);
  return `${months} tháng trước`;
}

const CommentUI = ({
  movieId,
  item,
  isLastItem,
  setComments,
  commentParentId,
  replyComments,
  tempReplyComments,
  isReplyCmt,
}) => {
  console.log(item._id, replyComments, isReplyCmt);
  const router = useRouter();
  const dispatch = useDispatch();
  // console.log("comment", router);
  const user = useSelector((state) => state.auth.login.currentUser);
  const userId = user?._id;
  const accessToken = user?.accessToken;

  let axiosJWT = createAxios(user, dispatch, loginSuccess, router, userId);

  const [textInputs, setTextInputs] = useState({
    updatedText: "",
    replyText: "",
  });
  const { updatedText, replyText } = textInputs;
  // console.log(textInputs);

  const [showMenuCommentId, setShowMenuCommentId] = useState(null);
  const [showEditingCommentId, setShowEditingCommentId] = useState(null);
  const [showInputReply, setShowInputReply] = useState(null);

  const [nextCursorChild, setNextCursorChild] = useState("");
  const [collapsedCmt, setCollapsedCmt] = useState(false);
  const [apiCalledCmt, setApiCalledCmt] = useState(false);
  const batchSize = 3; // Kích thước lô thông báo

  const [loadingChildCmt, setLoadingChildCmt] = useState(false);
  const [hasMaxChildCmt, setHasMaxChildCmt] = useState(false);

  const [loadingBtn, setLoadingBtn] = useState({
    addCmt: false,
    updateCmt: false,
    deleteCmt: false,
  });
  console.log("loadingBtn >>", loadingBtn);

  const containerMenu = useRef(null);
  const btnShowMenuFilm = useRef(null);

  const handleChangeInputs = (e) => {
    // console.log([e.target]);
    const { name, value } = e.target;
    setTextInputs((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Show actions comment (edit, delete)
  const handleShowMenuComment = (commentId) => {
    if (showMenuCommentId === commentId) {
      setShowMenuCommentId("");
    } else {
      setShowMenuCommentId(commentId);
      setShowEditingCommentId(null);
      console.log("toggle", commentId);
    }
  };

  // Reply comment
  const handleShowInputReply = (commentReplyId) => {
    if (showInputReply === commentReplyId) {
      setShowInputReply("");
      setTextInputs((prevState) => ({
        ...prevState,
        replyText: "",
      }));
    } else {
      setShowInputReply(commentReplyId);
    }
  };
  const handleHideInputReply = () => {
    setShowInputReply(null);
    setTextInputs((prevState) => ({
      ...prevState,
      replyText: "",
    }));
  };
  const handleAddReplyComment = async (commentId, replyText) => {
    console.log("handleAddReplyComment", commentId, userId, replyText);
    try {
      if (!user || !accessToken) {
        toast("Đăng nhập để sử dụng tính năng này");
        return;
      }
      if (!replyText) {
        toast("Chưa có nội dung bình luận");
        return;
      }

      setLoadingBtn((prev) => {
        return { ...prev, addCmt: true };
      });
      const res = await addCommentV2(
        userId,
        movieId,
        commentId,
        replyText,
        accessToken,
        axiosJWT
      );
      console.log(">>> handleAddReplyComment <<<", res);

      if (res.status === 200 && res.data?.metadata?.data) {
        console.log("collapsedCmt::: ", collapsedCmt);
        console.log("replyComments?.length::: ", replyComments?.length);
        if (!collapsedCmt && !replyComments?.length) {
          setComments((prevComments) => {
            const newComment = res.data.metadata.data;
            const newChildCmt = [...prevComments.tempChildCmt];
            newChildCmt.push(newComment);
            return {
              ...prevComments,
              tempChildCmt: newChildCmt,
            };
          });
          setLoadingBtn((prev) => {
            return { ...prev, addCmt: false };
          });
          setShowInputReply(null);
          setTextInputs((prevState) => ({
            ...prevState,
            replyText: "",
          }));
          return;
        }

        setComments((prevComments) => {
          const newComment = res.data.metadata.data;
          const newChildCmt = [...prevComments.childCmt];
          const newTempChildCmt = [...prevComments.tempChildCmt];
          newChildCmt.push(newComment);
          newTempChildCmt.push(newComment);
          return {
            ...prevComments,
            childCmt: newChildCmt,
            tempChildCmt: newTempChildCmt,
          };
        });

        if (userId != item?.userId._id) {
          const resAddNotify = await addNotify(
            userId, // sender
            item?.userId._id,
            movieId,
            // commentId, //cmt parent
            item._id, //cmt ma` minh` rep
            replyText,
            accessToken,
            axiosJWT
          );
          console.log(">>> resAddNotify <<<", resAddNotify);

          if (resAddNotify && resAddNotify.data?.metadata?.data) {
            console.log("emit", resAddNotify.data?.metadata?.data);
          }
        }
      }
      // toast(res?.data?.message);
      setLoadingBtn((prev) => {
        return { ...prev, addCmt: false };
      });
      setShowInputReply(null);
      setTextInputs((prevState) => ({
        ...prevState,
        replyText: "",
      }));
    } catch (err) {
      console.log(err);
      setLoadingBtn((prev) => {
        return { ...prev, addCmt: false };
      });
    }
  };

  // Edit comment
  const handleShowInputEdit = (commentId, text) => {
    setShowEditingCommentId(commentId);
    setTextInputs((prevState) => ({
      ...prevState,
      updatedText: text,
    }));
    setShowMenuCommentId(null);
  };
  const updateComment = async (commentId, text) => {
    console.log("updateComment", commentId, text);
    try {
      if (!user || !accessToken) {
        toast("Đăng nhập để sử dụng tính năng này");
        return;
      }

      setLoadingBtn((prev) => {
        return { ...prev, updateCmt: true };
      });
      const res = await updateCommentByIdV2(
        userId,
        movieId,
        commentId,
        text,
        accessToken,
        axiosJWT
      );
      console.log(">>> updateComment <<<", res);

      if (res.status === 200 && res.data?.metadata?.data) {
        setComments((prevComments) => {
          return {
            ...prevComments,
            parentCmt: prevComments.parentCmt.map((prevComment) => {
              if (prevComment._id === res.data?.metadata?.data._id) {
                return res.data?.metadata?.data;
              } else {
                return prevComment;
              }
            }),
            childCmt: prevComments.childCmt.map((prevComment) => {
              if (prevComment._id === res.data?.metadata?.data._id) {
                return res.data?.metadata?.data;
              } else {
                return prevComment;
              }
            }),
            tempChildCmt: prevComments.tempChildCmt.map((prevComment) => {
              if (prevComment._id === res.data?.metadata?.data._id) {
                return res.data?.metadata?.data;
              } else {
                return prevComment;
              }
            }),
          };
        });

        // toast(res?.data?.message);
        setShowEditingCommentId(null);
        setLoadingBtn((prev) => {
          return { ...prev, updateCmt: false };
        });
      }
    } catch (err) {
      console.log(err);
      setLoadingBtn((prev) => {
        return { ...prev, updateCmt: false };
      });
    }
  };

  // DELETE COMMENT
  // const deleteComment = async (commentId) => {
  //   console.log("deleteComment", commentId);
  //   try {
  //     if (!user || !accessToken) {
  //       toast("Đăng nhập để sử dụng tính năng này");
  //       return;
  //     }

  //     const res = await deleteCommentByIdV2(commentId, accessToken, axiosJWT);
  //     console.log(">>> deleteComment <<<", res);

  //     if (res.status === 200) {
  //       setComments((prevComments) => {
  //         return {
  //           ...prevComments,
  //           parentCmt: prevComments.parentCmt.filter(
  //             (comment) => comment._id !== commentId
  //           ),
  //           childCmt: prevComments.childCmt.filter(
  //             (comment) => comment._id !== commentId
  //           ),
  //           tempChildCmt: prevComments.tempChildCmt.filter(
  //             (comment) => comment._id !== commentId
  //           ),
  //         };
  //       });

  //       // toast(res?.data?.message);
  //     }
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  const deleteComment = async (commentId, isReplyCmt) => {
    console.log("deleteComment", commentId);
    try {
      if (!user || !accessToken) {
        toast("Đăng nhập để sử dụng tính năng này");
        return;
      }

      setLoadingBtn((prev) => {
        return { ...prev, deleteCmt: true };
      });

      const res = await deleteCommentByIdV2(commentId, accessToken, axiosJWT);
      console.log(">>> deleteComment <<<", res);

      if (res.status === 200) {
        setComments((prevComments) => {
          let filteredComments;
          if (!isReplyCmt) {
            // Xóa comment cha và tất cả các comment con liên quan
            filteredComments = {
              ...prevComments,
              parentCmt: prevComments.parentCmt.filter(
                (comment) => comment._id !== commentId
              ),
              childCmt: prevComments.childCmt.filter(
                (comment) => comment.path !== commentId
              ),
              tempChildCmt: prevComments.tempChildCmt.filter(
                (comment) => comment.path !== commentId
              ),
            };
          } else {
            // Xóa comment con hoặc comment tạm thời
            filteredComments = {
              ...prevComments,
              childCmt: prevComments.childCmt.filter(
                (comment) => comment._id !== commentId
              ),
              tempChildCmt: prevComments.tempChildCmt.filter(
                (comment) => comment._id !== commentId
              ),
            };
          }
          return filteredComments;
        });

        setLoadingBtn((prev) => {
          return { ...prev, deleteCmt: false };
        });
        // toast(res?.data?.message);
      }
    } catch (err) {
      console.log(err);
      setLoadingBtn((prev) => {
        return { ...prev, deleteCmt: false };
      });
    }
  };

  // handleLoadMoreReplyComment
  const handleLoadMoreReplyCommentThenCollapse = useCallback(
    async (parentCommentId) => {
      console.log("handleLoadMoreReplyCommentThenCollapse", parentCommentId);
      try {
        if (!user || !accessToken) {
          toast("Đăng nhập để sử dụng tính năng này");
          return;
        }

        // Nếu API chưa được gọi, gọi API và đặt biến state đã gọi API thành true
        if (!apiCalledCmt) {
          setLoadingChildCmt(true);
          const controller = new AbortController();
          const res = await getCommentInBranchV2(
            movieId,
            parentCommentId,
            nextCursorChild,
            batchSize,
            accessToken,
            axiosJWT,
            controller
          );
          console.log(">>> handleLoadMoreReplyComment res <<<", res);

          if (res.status === 200) {
            // const newReplyComments = res.data.metadata.data;
            const newReplyComments = res.data.metadata.data.filter(
              (comment) => comment !== null
            );
            console.log("newReplyComments", newReplyComments);
            if (!res.data.metadata.nextCursorChild) {
              console.log(
                "res.data.metadata.nextCursorChild >>",
                res.data.metadata.nextCursorChild
              );
              setHasMaxChildCmt(true);
            }
            setNextCursorChild(res.data.metadata.nextCursorChild);
            setComments((prevComments) => {
              const newChildCmt =
                prevComments.childCmt.concat(newReplyComments);
              return {
                ...prevComments,
                childCmt: newChildCmt,
              };
            });

            setApiCalledCmt(true); // Đặt biến state đã gọi API thành true
            setLoadingChildCmt(false);
            setCollapsedCmt((prevCollapsed) => !prevCollapsed);
          }
        } else {
          // Nếu đã gọi API, chỉ thay đổi trạng thái của biến state để hiển thị hoặc thu gọn các comment con
          setCollapsedCmt((prevCollapsed) => !prevCollapsed);
        }
      } catch (err) {
        console.log(err);
        setLoadingChildCmt(false);
      }
    },
    [
      accessToken,
      batchSize,
      movieId,
      nextCursorChild,
      axiosJWT,
      user,
      collapsedCmt,
    ]
  );

  const handleLoadMoreReplyComment = useCallback(
    async (parentCommentId) => {
      console.log("handleLoadMoreReplyComment", parentCommentId);
      try {
        if (!user || !accessToken) {
          toast("Đăng nhập để sử dụng tính năng này");
          return;
        }
        setLoadingChildCmt(true);

        const controller = new AbortController();
        const res = await getCommentInBranchV2(
          movieId,
          parentCommentId,
          nextCursorChild,
          batchSize,
          accessToken,
          axiosJWT,
          controller
        );
        console.log(">>> handleLoadMoreReplyComment res <<<", res);

        if (res.status === 200) {
          // const newReplyComments = res.data.metadata.data;
          const newReplyComments = res.data.metadata.data.filter(
            (comment) => comment !== null
          );
          if (!res.data.metadata.nextCursorChild) {
            console.log(
              "res.data.metadata.nextCursorChild >>",
              res.data.metadata.nextCursorChild
            );
            setHasMaxChildCmt(true);
          }
          console.log("newReplyComments", newReplyComments);
          setNextCursorChild(res.data.metadata.nextCursorChild);

          setComments((prevComments) => {
            // Loại bỏ các phần tử trùng lặp
            const uniqueNewChildCmt = newReplyComments.filter((newComment) => {
              return !prevComments.childCmt.some(
                (existingComment) => existingComment._id === newComment._id
              );
            });

            console.log("uniqueNewChildCmt >>>", uniqueNewChildCmt);

            // Thêm các phần tử mới vào mảng childCmt
            const newChildCmt = prevComments.childCmt.concat(uniqueNewChildCmt);

            return {
              ...prevComments,
              childCmt: newChildCmt,
            };
          });

          setLoadingChildCmt(false);
          // toast(res?.data?.message);
          console.log("item.childCount:::", item.childCount);
          console.log("replyComments?.length:::", replyComments?.length);
        }
      } catch (err) {
        console.log(err);
        setLoadingChildCmt(false);
      }
    },
    [accessToken, batchSize, movieId, nextCursorChild, axiosJWT, user]
  );

  // Sự kiện lắng nghe khi click chuột toàn trang
  useEffect(() => {
    const handleClickOutsideHideMenu = (e) => {
      // Kiểm tra nếu kết quả đang hiển thị và chuột không nằm trong phần tử kết quả
      if (
        !containerMenu.current?.contains(e.target) &&
        e.target != btnShowMenuFilm.current &&
        !btnShowMenuFilm.current?.contains(e.target)
      ) {
        setShowMenuCommentId("");
      }
    };
    document.addEventListener("mousedown", handleClickOutsideHideMenu);

    return () => {
      document.removeEventListener("mousedown", handleClickOutsideHideMenu);
    };
  }, []);

  // useEffect(() => {
  //   if (
  //     item.childCount > 0 &&
  //     !hasMaxChildCmt &&
  //     replyComments?.length == item.childCount
  //   ) {
  //     console.log("commentParentId >>>>", item._id);
  //     console.log("replyComments.length:::", replyComments?.length);
  //     console.log("item.childCount:::", item.childCount);
  //     setHasMaxChildCmt(true);
  //   }
  // }, [replyComments, item, item.childCount]);

  return (
    <>
      {loadingBtn.deleteCmt ? (
        <Loading />
      ) : (
        <div
          id={item._id}
          className={`${isLastItem && !isReplyCmt ? "mb-4" : "mb-0"} ${
            isLastItem && isReplyCmt ? "mb-2" : "mb-0"
          } flex min-h-[60px]`}
        >
          <div
            // className="relative w-[50px] h-[50px] mr-2.5 "
            className={`${
              !isReplyCmt ? "w-[50px] h-[50px]" : "w-[35px] h-[35px]"
            } relative mr-2.5`}
          >
            {item.userId?.avatar ? (
              <Image
                src={item.userId?.avatar}
                className="absolute block object-cover w-full h-full"
                alt="pic"
                layout="fill"
              />
            ) : (
              <div
                // className="relative h-full w-[50px] mr-2.5 border-[2px] border-[#444] flex items-center justify-center"
                className={`${
                  !isReplyCmt ? "w-[50px]" : "w-[35px]"
                } relative h-full mr-2.5 border-[2px] border-[#444] flex items-center justify-center`}
              >
                <i className="fa-solid fa-user inline-block text-xl text-white"></i>
              </div>
            )}
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="flex justify-between items-start">
              <h4
                className={`${
                  !isReplyCmt ? "" : "text-[12px]"
                } text-[#0285b5] font-semibold`}
              >
                {item.userId?.username}
                {item.userId?.isAdmin ? (
                  <span
                    className={`${
                      !isReplyCmt ? "text-[8px]" : "text-[6px]"
                    } ml-2 p-[1px] tracking-[1px] italic text-white border-[1px] border-cyan-600 bg-cyan-600 rounded-sm`}
                  >
                    admin
                  </span>
                ) : (
                  <></>
                )}
              </h4>

              {userId === item.userId?._id ? (
                <span className="relative flex justify-center text-white">
                  <i
                    className="fa-solid fa-ellipsis-vertical px-2 cursor-pointer"
                    ref={btnShowMenuFilm}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleShowMenuComment(item._id);
                    }}
                  ></i>
                  {item._id === showMenuCommentId && (
                    <span
                      className="py-1 absolute top-0 right-[18px] bg-white min-h-[50px] min-w-[100px] z-40 select-none"
                      ref={containerMenu}
                    >
                      <span
                        className="px-2 flex justify-start items-center hover:bg-[rgba(0,0,0,0.3)] cursor-pointer"
                        onClick={() =>
                          handleShowInputEdit(item._id, item.content)
                        }
                      >
                        <p className="flex-1 w-full whitespace-nowrap text-black">
                          Chỉnh sửa
                        </p>
                      </span>

                      <span
                        className="px-2 flex justify-start items-center mt-1 hover:bg-[rgba(0,0,0,0.3)] cursor-pointer"
                        onClick={() => deleteComment(item._id, isReplyCmt)}
                      >
                        <p className="flex-1 w-full whitespace-nowrap text-black">
                          Xóa
                        </p>
                      </span>
                    </span>
                  )}
                </span>
              ) : (
                <></>
              )}
            </div>

            {showEditingCommentId === item._id && !loadingBtn.updateCmt ? (
              <div className="bg-[rgba(0,0,0,0.1)]">
                <textarea
                  name="updatedText"
                  className="p-2 w-full outline-none"
                  placeholder="Bình luận..."
                  value={updatedText}
                  onChange={handleChangeInputs}
                />
                <div className="flex items-center justify-end">
                  <button
                    type="button"
                    className="py-[9px] px-[16px] tracking-[.085em] text-sm font-bold text-[#f4fcf0] bg-[#DD0C39] rounded select-none cursor-pointer"
                    onClick={() => setShowEditingCommentId(null)}
                  >
                    Hủy
                  </button>

                  <button
                    type="button"
                    className="ml-[10px] py-[9px] px-[16px] tracking-[.085em] text-sm font-bold text-[#f4fcf0] bg-[#00b020] rounded select-none cursor-pointer"
                    onClick={() => updateComment(item._id, updatedText)}
                  >
                    Lưu
                  </button>
                </div>
              </div>
            ) : loadingBtn.updateCmt ? (
              <Loading />
            ) : (
              <p
                // className="break-words text-white my-1"
                className={`${
                  !isReplyCmt ? "" : "text-xs"
                } break-words text-white my-0`}
              >
                {item.content}
              </p>
            )}

            <div className="text-sm text-white">
              <span
                className="mr-[15px] cursor-pointer hover:underline"
                onClick={(e) => {
                  handleShowInputReply(item._id);
                }}
              >
                <i className="fa-solid fa-reply mr-[4px]"></i>
                <span
                  className={`${!isReplyCmt ? "text-[12px]" : "text-[10px]"} `}
                >
                  trả lời
                </span>
              </span>
              <span className="mr-[15px]">
                <i className="fa-regular fa-clock mr-[4px]"></i>
                <span
                  className={`${!isReplyCmt ? "text-[12px]" : "text-[10px]"} `}
                >
                  {timeAgo(new Date(item.createdAt))}
                </span>
              </span>
            </div>

            {showInputReply === item._id && !loadingBtn.addCmt ? (
              <div className="mt-2 flex">
                <div className="relative w-[50px] h-[50px] mr-2.5 ">
                  {user ? (
                    <Image
                      src={user?.avatar}
                      className="absolute block object-cover w-full h-full"
                      alt="pic"
                      layout="fill"
                    />
                  ) : (
                    <div className="relative h-full w-[50px] mr-2.5 border-[2px] border-[#444] flex items-center justify-center">
                      <i className="fa-solid fa-user inline-block text-xl text-white"></i>
                    </div>
                  )}
                </div>
                <div className="flex-1 bg-[rgba(0,0,0,0.1)]">
                  <textarea
                    name="replyText"
                    className="p-2 w-full outline-none"
                    autoFocus
                    placeholder="Bình luận..."
                    value={replyText}
                    onChange={handleChangeInputs}
                  />
                  <div className="flex items-center justify-end">
                    <button
                      type="button"
                      className="py-[9px] px-[16px] tracking-[.085em] text-sm font-bold text-[#f4fcf0] bg-[#DD0C39] rounded select-none cursor-pointer"
                      onClick={(e) => {
                        handleHideInputReply();
                      }}
                    >
                      Hủy
                    </button>
                    <button
                      type="button"
                      className="ml-[10px] py-[9px] px-[16px] tracking-[.085em] text-sm font-bold text-[#f4fcf0] bg-[#00b020] rounded select-none cursor-pointer"
                      onClick={() =>
                        handleAddReplyComment(
                          commentParentId ? commentParentId : item._id,
                          replyText
                        )
                      }
                    >
                      Gửi Reply
                    </button>
                  </div>
                </div>
              </div>
            ) : loadingBtn.addCmt ? (
              <Loading />
            ) : (
              <></>
            )}

            {/* //LOAD MORE COMMENT CON */}
            {/* {item.commentLevel === 1 && item.childCount > 0 && (
          <span
            className="inline-block text-[11px] text-[#0285b5] cursor-pointer italic hover:underline"
            onClick={() => handleLoadMoreReplyCommentThenCollapse(item._id)} // button 1
          >
            {
              <>
                {!collapsedCmt ? (
                  <i className="fa-solid fa-caret-down mr-[6px] text-[#0285b5]"></i>
                ) : (
                  <i className="fa-solid fa-caret-up mr-[6px] text-[#0285b5]"></i>
                )}
                <span>{item.childCount} phản hồi</span>
              </>
            }
          </span>
        )} */}
            {item.commentLevel === 1 && item.childCount > 0 && (
              <div>
                {loadingChildCmt && !apiCalledCmt ? ( // Kiểm tra loading, nếu đang loading thì hiển thị component loading
                  <Loading />
                ) : (
                  <span
                    className="inline-block text-[11px] text-[#0285b5] cursor-pointer italic hover:underline"
                    onClick={() =>
                      handleLoadMoreReplyCommentThenCollapse(item._id)
                    } // button 1
                  >
                    {!collapsedCmt ? (
                      <i className="fa-solid fa-caret-down mr-[6px] text-[#0285b5]"></i>
                    ) : (
                      <i className="fa-solid fa-caret-up mr-[6px] text-[#0285b5]"></i>
                    )}
                    <span>{item.childCount} phản hồi</span>
                  </span>
                )}
              </div>
            )}

            {/* //COMMENT CON */}
            {replyComments?.length > 0 && collapsedCmt ? (
              <div className="mt-4">
                {tempReplyComments?.length < 0 ? (
                  replyComments
                ) : (
                  <>
                    {" "}
                    {replyComments}
                    {/* {tempReplyComments} */}
                  </>
                )}
              </div>
            ) : (
              <></>
            )}
            {/* {replyComments?.length > 0 && collapsedCmt ? (
          <div className="mt-4">
            {tempReplyComments?.length < 0 ? (
              replyComments
            ) : (
              <>
                {" "}
                {replyComments}
                {tempReplyComments}
              </>
            )}
          </div>
        ) : (
          <></>
        )} */}

            {tempReplyComments?.length > 0 && !collapsedCmt ? (
              <div className="mt-4 vc">{tempReplyComments}</div>
            ) : (
              <></>
            )}

            {/* //COLLAPSE COMMENT CON */}
            {/* {item.childCount > 0 &&
          replyComments?.length > 0 &&
          item.childCount > replyComments?.length &&
          collapsedCmt && (
            <span
              className="inline-block text-[11px] text-[#0285b5] cursor-pointer italic hover:underline"
              onClick={() => handleLoadMoreReplyComment(item._id)} // button 2
            >
              <i className="fa-solid fa-reply mr-[6px] text-[#0285b5] rotate-180"></i>
              <span>Xem thêm phản hồi</span>
            </span>
          )} */}

            {item.childCount > 0 && !hasMaxChildCmt && collapsedCmt && (
              <div>
                {loadingChildCmt ? ( // Kiểm tra loading, nếu đang loading thì hiển thị component loading
                  <Loading />
                ) : (
                  <span
                    className="inline-block text-[11px] text-[#0285b5] cursor-pointer italic hover:underline"
                    onClick={() => handleLoadMoreReplyComment(item._id)} // button 2
                  >
                    <i className="fa-solid fa-reply mr-[6px] text-[#0285b5] rotate-180"></i>
                    <span>Xem thêm phản hồi</span>
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default memo(CommentUI);
