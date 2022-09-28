import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import Comments from "./Comments";
import Right from "./comman/Right";
import Left from "./comman/Left";

import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Feeds = () => {
  const [postItem, setPostItem] = useState([]);
  const [successPost, setSuccessPost] = useState(false);
  const [toggleEdit, setToggleEdit] = useState(true);
  const [editPost, setEditPost] = useState({});
  const navigate = useNavigate();
  const loginData = useSelector((state) => state.login.loginDataRedux);
  console.log("loginData.....", loginData);
  const text = useRef();

  const submitPost = async () => {
    if (text.current.value !== "") {
      const url = "https://calm-meadow-38443.herokuapp.com/feeditems/additems";
      const tempObj = {};
      tempObj.feedid = "c" + parseInt(Math.random() * 10000000000000);
      tempObj.userid = loginData.userid;
      tempObj.name = loginData.name;
      tempObj.itemText = text.current.value;
      const response = await axios.post(url, tempObj);
      if (response.status === 201) {
        setSuccessPost(true);
      }
      //console.log(response);
      text.current.value = "";
      setTimeout(() => {
        setSuccessPost(false);
      }, 2000);
    }
  };

  const editFn = (feedid) => {
    //console.log("getting feed id....", feedid);
    let newEditText = postItem.find((item) => {
      return item.feedid === feedid;
    });
    console.log(newEditText);
    setToggleEdit(false);
    setEditPost(newEditText);
    text.current.value = newEditText.itemText;
  };

  const savePost = async () => {
    const newUrl = `https://calm-meadow-38443.herokuapp.com/feeditems/edititem/${editPost.feedid}`;
    console.log(newUrl);
    const tempObj = {};
    tempObj.feedid = editPost.feedid;
    tempObj.userid = editPost.userid;
    tempObj.name = editPost.name;
    tempObj.itemText = text.current.value;
    const response = await axios.put(newUrl, tempObj);
    if (response.status === 201) {
      console.log(editPost);
      setToggleEdit(true);
      text.current.value = "";
    }
  };
  const callItemApi = async () => {
    const url = "https://calm-meadow-38443.herokuapp.com/feeditems/allitems";
    try {
      const response = await axios.get(url);
      //console.log(response);
      setPostItem(response.data.reverse());
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (!loginData) {
      navigate("/login");
    }
  });

  useEffect(() => {
    callItemApi();
  }, [successPost, toggleEdit]);
  return (
    <div className="d-flex">
      <Left />
      <section className="col-8 m-2" style={{ backgroundColor: "gray" }}>
        <div className="d-flex">
          <img
            src="https://i.pinimg.com/736x/25/78/61/25786134576ce0344893b33a051160b1.jpg"
            className="profile_pic"
            alt="profile"
          />
          <p className="profile_name">{loginData && loginData.name}</p>
        </div>
        <div className="d-flex flex-column rounded text-center">
          <textarea
            className="m-2 border rounded p-2"
            placeholder="what's on your mind..."
            ref={text}
          ></textarea>
          <span className="align-self-end">
            {toggleEdit ? (
              <button className="btn btn-sm btn-info mx-2" onClick={submitPost}>
                Post
              </button>
            ) : (
              <button className="btn btn-sm btn-info mx-2" onClick={savePost}>
                save
              </button>
            )}
          </span>
        </div>
        {successPost && (
          <p className="alert alert-success m-2" role="alert">
            successfully posted..
          </p>
        )}

        <div
          className="d-flex flex-column m-2 border border-dark rounded"
          style={{ backgroundColor: "white" }}
        >
          {postItem &&
            postItem.map((item) => (
              <div
                key={item.feedid}
                className="m-1 p-1 border border-dark rounded"
                style={{ backgroundColor: "white" }}
              >
                <div className="m-1">
                  <div className="d-flex justify-content-between">
                    <span className="d-flex">
                      <img
                        src="https://cdn-icons-png.flaticon.com/512/21/21294.png"
                        alt="profile"
                        style={{ height: "20px", width: "20px" }}
                      />
                      <p style={{ fontWeight: "bold" }}>{item.name}</p>
                    </span>
                    {loginData.userid === item.userid && (
                      <div>
                        <i
                          className="fa-solid fa-pen-to-square option_icon"
                          onClick={() => {
                            editFn(item.feedid);
                          }}
                        ></i>
                        <i className="fa-solid fa-trash option_icon"></i>
                      </div>
                    )}
                  </div>
                  {item.itemText && (
                    <p className="ps-3 post-text">{item.itemText}</p>
                  )}
                  {item.itemImage && <img src={item.itemImage} alt="post" />}
                </div>
                <Comments id={item.feedid} />
              </div>
            ))}
        </div>
      </section>
      <Right />
    </div>
  );
};

export default Feeds;
