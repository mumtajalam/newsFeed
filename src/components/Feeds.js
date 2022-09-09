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
      console.log(response);
      text.current.value = "";
      setTimeout(() => {
        setSuccessPost(false);
      }, 2000);
    }
  };

  const callItemApi = async () => {
    const url = "https://calm-meadow-38443.herokuapp.com/feeditems/allitems";
    try {
      const response = await axios.get(url);
      console.log(response);
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
  }, [successPost]);
  return (
    <div className="d-flex">
      <Left />
      <section className="col-8 m-2" style={{ backgroundColor: "gray" }}>
        <div className="d-flex flex-column rounded text-center">
          <textarea
            className="m-2 border rounded"
            placeholder="what's on your mind..."
            ref={text}
          ></textarea>
          <span className="align-self-end">
            <button className="btn btn-sm btn-info mx-2" onClick={submitPost}>
              Post
            </button>
          </span>
        </div>
        {successPost && (
          <p className="alert alert-success m-2" role="alert">
            successfully posted..
          </p>
        )}

        <div className="d-flex flex-column m-2 border border-dark rounded">
          {postItem &&
            postItem.map((item) => (
              <div
                key={item.feedid}
                className="m-1 p-1 border border-dark rounded"
                style={{ backgroundColor: "white" }}
              >
                <div>
                  <div className="d-flex">
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/21/21294.png"
                      alt="profile"
                      style={{ height: "20px", width: "20px" }}
                    />
                    <p style={{ fontWeight: "bold" }}>{item.name}</p>
                  </div>
                  {item.itemText && <p>{item.itemText}</p>}
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
