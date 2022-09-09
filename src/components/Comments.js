import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Comments = ({ id }) => {
  const commentRef = useRef();
  const [allComments, setAllComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [likes, setLikes] = useState([]);
  const [success, setSuccess] = useState(false);

  const loginData = useSelector((state) => state.login.loginDataRedux);

  const commentFn = async () => {
    const url = "https://calm-meadow-38443.herokuapp.com/comments/addcomment";
    const tempObj = {};
    tempObj.commentid = "c" + parseInt(Math.random() * 10000000000000);
    tempObj.feedid = id;
    tempObj.userid = loginData.userid;
    tempObj.name = loginData.name;
    tempObj.text = commentRef.current.value;
    if (commentRef.current.value !== "") {
      const response = await axios.post(url, tempObj);
      if (response.status === 201) {
        setSuccess(true);
      }
      commentRef.current.value = "";
      console.log(response);
    }
  };

  const loadCommentsFn = async () => {
    const url = "https://calm-meadow-38443.herokuapp.com/comments/search/" + id;
    const response = await axios.get(url);
    if (response.status === 200) {
      setAllComments(response.data.reverse());
    }
  };

  const loadLikesFn = async () => {
    const url = "https://calm-meadow-38443.herokuapp.com/likes/search/" + id;
    const response = await axios.get(url);
    if (response.status === 200) {
      setLikes(response.data);
    }
  };

  const addlikeFn = async () => {
    const url = "https://calm-meadow-38443.herokuapp.com/likes/addlikes";
    const tempLike = {};
    tempLike.feedid = id;
    tempLike.userid = loginData.userid;
    tempLike.name = loginData.name;
    const response = await axios.post(url, tempLike);
    if (response.status === 201) {
      setSuccess(true);
      setInterval(() => {
        setSuccess(true);
      }, 1000);
    }
  };
  useEffect(() => {
    loadCommentsFn();
    loadLikesFn();
  }, [success]);

  console.log("show id.........", id);
  return (
    <>
      <hr />
      <p style={{ fontSize: "10px", marginLeft: "5px", fontWeight: "bold" }}>
        {likes.length} likes {allComments.length} comments
      </p>
      <div className="border border-white rounded d-flex">
        <input className="form-control p-1" ref={commentRef} />
        <button
          className="btn btn-sm btn-outline-secondary my-1"
          onClick={commentFn}
        >
          <i class="fa-regular fa-paper-plane"></i>
        </button>

        <button
          className="btn btn-outline-secondary m-1"
          style={{ height: "50%" }}
          onClick={addlikeFn}
        >
          <i className="fa-regular fa-heart"></i>
        </button>
        <button
          className="btn btn-outline-secondary m-1"
          style={{ height: "50%" }}
          onClick={() => {
            setShowComments(!showComments);
          }}
        >
          <i className="fa-solid fa-comment"></i>
        </button>
      </div>
      <div>
        {showComments &&
          allComments &&
          allComments.map((comment) => (
            <div>
              <p>
                <span className="fw-bold">{comment.name}:</span>
                <span> {comment.text}</span>
              </p>
              <p></p>
            </div>
          ))}
      </div>
    </>
  );
};

export default Comments;
