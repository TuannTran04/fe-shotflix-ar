"use client";
import Image from "next/legacy/image";
import { useRouter } from "next/navigation";
import { memo, useEffect, useState } from "react";
import {
  addComment,
  addCommentV2,
  getComment,
  getCommentInBranchV2,
  getCommentV2,
} from "../../store/apiRequest";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CommentUI from "./components/CommentUI";
import { useSearchParams } from "next/navigation";
import Loading from "../Loading/Loading";
import { createAxios } from "@/utils/createInstance";
import { loginSuccess } from "@/store/authSlice";

const CommentFilm = ({ movieId, nameFilm }) => {
  const [comments, setComments] = useState({
    parentCmt: [],
    childCmt: [],
    tempChildCmt: [],
  });

  const [totalComments, setTotalComments] = useState(0);
  console.log(comments);

  const [hasScrolled, setHasScrolled] = useState(false);

  const [loadingV2, setLoadingV2] = useState({
    renderCmt: false,
    addCmt: false,
  });
  const [hasMaxParentCmt, setHasMaxParentCmt] = useState(false);

  const [nextCursor, setNextCursor] = useState("");
  const batchSize = 3; // Kích thước lô thông báo

  const searchParams = useSearchParams();
  const commentIdScrollTo = searchParams.get("commentId");
  // console.log(commentIdScrollTo);

  useEffect(() => {
    if (commentIdScrollTo && comments.length > 0 && !hasScrolled) {
      const commentElement = document.getElementById(`${commentIdScrollTo}`);
      if (commentElement) {
        commentElement.scrollIntoView({ behavior: "smooth" });
        setHasScrolled(true);
      }
    }
  }, [commentIdScrollTo, comments, hasScrolled]);

  const router = useRouter();
  const dispatch = useDispatch();
  // console.log("comment", router);
  const user = useSelector((state) => state.auth.login.currentUser);
  const userId = user?._id;
  const accessToken = user?.accessToken;

  let axiosJWT = createAxios(user, dispatch, loginSuccess, router, userId);

  const [textInputs, setTextInputs] = useState({
    commentInput: "",
  });
  const { commentInput } = textInputs;
  // console.log(textInputs);

  const handleChangeInputs = (e) => {
    // console.log([e.target]);
    const { name, value } = e.target;
    setTextInputs((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Add comment
  const handleSubmitCommentInput = async (parentCommentId = null) => {
    // e.preventDefault();
    console.log(movieId, commentInput, parentCommentId);
    try {
      if (!user || !accessToken) {
        toast("Đăng nhập để sử dụng tính năng này");
        return;
      }
      if (!commentInput) {
        toast("Chưa có nội dung bình luận");
        return;
      }

      setLoadingV2((prev) => {
        return { ...prev, addCmt: true };
      });

      const res = await addCommentV2(
        userId,
        movieId,
        parentCommentId,
        commentInput,
        accessToken,
        axiosJWT
      );
      console.log(">>> addCommentV2 <<<", res);
      if (res.status === 200 && res.data?.metadata?.data) {
        toast(res?.data?.message);
        // setComments((prevComments) => {
        //   return [res.data.metadata.data, ...prevComments];
        // });

        setComments((prevComments) => {
          const newComment = res.data.metadata.data;
          const newParentCmt = [...prevComments.parentCmt];
          newParentCmt.unshift(newComment);
          return {
            ...prevComments,
            parentCmt: newParentCmt,
          };
        });
        setTextInputs((prevState) => ({
          ...prevState,
          commentInput: "",
        }));
        setLoadingV2((prev) => {
          return { ...prev, addCmt: false };
        });
      }
    } catch (err) {
      console.log(err);
      setLoadingV2((prev) => {
        return { ...prev, addCmt: false };
      });
    }
  };

  const renderComments = async (controller) => {
    try {
      setLoadingV2((prev) => {
        return { ...prev, renderCmt: true };
      });

      let commentsRes = await getCommentV2(
        movieId,
        nextCursor,
        batchSize,
        accessToken,
        axiosJWT,
        controller
      );
      console.log(">>> GET COMMENTS <<<", commentsRes);
      console.log(">>> BEFORE GET nextCursor <<<", nextCursor);

      if (commentsRes.status === 200) {
        // const newComments = commentsRes.data.metadata.data;
        const newComments = commentsRes.data.metadata.data.filter(
          (comment) => comment !== null
        );
        console.log("newComments", newComments);
        setTotalComments(commentsRes.data.metadata.count);
        setNextCursor(commentsRes.data.metadata.nextCursor);
        setComments((prevComments) => {
          console.log(">>> BEFORE GET COMMENTS 2<<<", prevComments);

          const newParentCmt = prevComments.parentCmt.concat(newComments);
          // const newParentCmt = [
          //   ...new Set([...prevComments.parentCmt.concat(newComments)]),
          // ];

          console.log(">>> AFTER GET COMMENTS 2<<<", newParentCmt);

          return {
            ...prevComments,
            parentCmt: newParentCmt,
          };
        });
        setLoadingV2((prev) => {
          return { ...prev, renderCmt: false };
        });
      }
    } catch (err) {
      console.log(err);
      setLoadingV2((prev) => {
        return { ...prev, renderCmt: false };
      });
    }
  };

  useEffect(() => {
    if (movieId) {
      const controller = new AbortController();

      renderComments(controller);

      return () => {
        controller.signal;
      };
    }
  }, [movieId, nameFilm, accessToken, batchSize, user]);
  // loi khi add 1 cmt thi bam load cmt se bi duplicate (ko lq toi useState)
  useEffect(() => {
    if (
      totalComments > 0 &&
      !hasMaxParentCmt &&
      comments.parentCmt?.length == totalComments
    ) {
      console.log("totalComments:::", totalComments);
      console.log("comments.parentCmt?.length:::", comments.parentCmt?.length);
      setHasMaxParentCmt(true);
    }
  }, [totalComments, comments]);

  return (
    <div className="mt-[40px] p-3 lg:p-6 bg-[#333333]">
      {loadingV2.addCmt ? (
        <div className="h-[50px] mb-5">
          <Loading />
        </div>
      ) : (
        <div className="flex items-center h-[50px] mb-5">
          <div className="relative h-full w-[50px] mr-2.5 border-[2px] border-[#444] flex items-center justify-center">
            {user && user?.avatar ? (
              <Image
                src={user?.avatar}
                className="absolute block object-cover w-full h-full"
                alt="pic"
                layout="fill"
              />
            ) : (
              <i className="fa-solid fa-user inline-block text-xl text-white"></i>
            )}
          </div>
          <div className="h-full flex-1 flex border-[1px] border-[#444]">
            <input
              className="w-full bg-[#2D2D2D] focus:outline-0 focus:outline-none px-3.5 text-white"
              type="text"
              name="commentInput"
              value={commentInput}
              onChange={handleChangeInputs}
              autoComplete="off"
              placeholder="Bình luận..."
            />
            <button
              className="text-black  w-11 border-[2px] border-[#444]"
              onClick={(e) => handleSubmitCommentInput()}
            >
              <i className="fa-solid fa-paper-plane text-white"></i>
            </button>
          </div>
        </div>
      )}

      <div className="section_comment max-h-[400px] md:max-h-[500px] overflow-y-auto">
        {comments.parentCmt.length > 0 ? (
          comments.parentCmt?.map((item, i) => {
            // Lọc ra các comment con tương ứng với comment cha
            const generateReplyComments = (
              replyCommentsData,
              isTemp = false
            ) => {
              const uniqueReplyComments = replyCommentsData.filter(
                (comment) => comment.path === item._id
              );

              console.log("uniqueReplyComments >>", uniqueReplyComments);
              return uniqueReplyComments.map((reply, i) => (
                <CommentUI
                  key={reply._id}
                  movieId={movieId}
                  item={reply}
                  isLastItem={i !== replyCommentsData.length - 1}
                  setComments={setComments}
                  isReplyCmt={true}
                  commentParentId={item._id}
                />
              ));
            };

            const replyComments = generateReplyComments(comments.childCmt);

            const tempReplyComments = generateReplyComments(
              comments.tempChildCmt,
              true
            );

            console.log(
              `replyComments ${item._id}`,
              replyComments,
              replyComments.length,
              item.childCount,
              replyComments.length < item.childCount
            );
            return (
              <CommentUI
                key={item._id}
                movieId={movieId}
                item={item}
                isLastItem={i !== comments.parentCmt.length - 1}
                setComments={setComments}
                replyComments={replyComments}
                tempReplyComments={tempReplyComments}
              />
            );
          })
        ) : loadingV2.renderCmt ? (
          <Loading />
        ) : (
          <p className="p-2 text-white text-center">Không có bình luận nào</p>
        )}

        {comments.parentCmt.length > 0 && loadingV2.renderCmt ? (
          <Loading />
        ) : (
          <></>
        )}
      </div>

      {totalComments > 0 &&
      comments.parentCmt.length > 0 &&
      !hasMaxParentCmt &&
      !loadingV2.renderCmt ? (
        <div
          className="py-2 flex justify-center items-center cursor-pointer hover:bg-[rgba(255,255,255,0.5)] select-none"
          onClick={renderComments}
        >
          <span className="italic text-xs text-white">
            Tải thêm bình luận?...
          </span>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default memo(CommentFilm);
