import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CourseService from "../services/course.service";
import AuthService from "../services/auth.service";

const PatchCourseComponent = (props) => {
  let { currentUser, setCurrentUser, patchCourseData, setPatchCourseData } =
    props;
  let [title, setTitle] = useState(patchCourseData.title);
  let [description, setDescription] = useState(patchCourseData.description);
  let [price, setPrice] = useState(patchCourseData.price);
  let [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleTakeToLogin = () => {
    navigate("/login");
  };
  const handleChangeTitle = (e) => {
    setTitle(e.target.value);
  };
  const handleChangeDesciption = (e) => {
    setDescription(e.target.value);
  };
  const handleChangePrice = (e) => {
    setPrice(e.target.value);
  };
  const patchCourse = () => {
    CourseService.patchCourseByID(
      patchCourseData._id,
      title,
      description,
      price
    )
      .then(() => {
        window.alert("課程已更新成功");
        navigate("/course");
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          AuthService.logout(); //清空local storage
          window.alert("Token 已過期，重定向到登入頁面");
          setCurrentUser(null);
          navigate("/login");
        } else {
          console.log(error.response);
          setMessage(error.response.data);
        }
      });
  };

  return (
    <div style={{ padding: "3rem" }}>
      {!currentUser && (
        <div>
          <p>在更新課程之前，您必須先登錄。</p>
          <button
            className="btn btn-primary btn-lg"
            onClick={handleTakeToLogin}
          >
            帶我進入登錄頁面。
          </button>
        </div>
      )}
      {currentUser && currentUser.user.role !== "instructor" && (
        <div>
          <p>只有講師才可以更新課程。</p>
        </div>
      )}
      {currentUser && currentUser.user.role == "instructor" && (
        <div className="form-group">
          <div>
            <h1>正在修改: {patchCourseData.title} 的課程資料</h1>
          </div>
          <label for="exampleforTitle">課程標題：</label>
          <input
            name="title"
            type="text"
            className="form-control"
            id="exampleforTitle"
            placeholder={patchCourseData.title}
            onChange={handleChangeTitle}
          />
          <br />
          <label for="exampleforContent">內容：</label>
          <textarea
            className="form-control"
            id="exampleforContent"
            aria-describedby="emailHelp"
            name="content"
            placeholder={patchCourseData.description}
            onChange={handleChangeDesciption}
          />
          <br />
          <label for="exampleforPrice">價格：</label>
          <input
            name="price"
            type="number"
            className="form-control"
            id="exampleforPrice"
            placeholder={patchCourseData.price}
            onChange={handleChangePrice}
          />
          <br />
          <button className="btn btn-primary" onClick={patchCourse}>
            交出表單
          </button>
          <br />
          <br />
          {message && (
            <div className="alert alert-warning" role="alert">
              {message}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PatchCourseComponent;
