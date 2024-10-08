import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CourseService from "../services/course.service";
import AuthService from "../services/auth.service";

const EnrollComponent = (props) => {
  let { currentUser, setCurrentUser } = props;
  const navigate = useNavigate();
  let [searchInput, setSearchInput] = useState("");
  let [searchResult, setSearchResult] = useState(null);
  let [message, setMessage] = useState("");

  const handleTakeToLogin = () => {
    navigate("/login");
  };
  const handleChangeInput = (e) => {
    setSearchInput(e.target.value);
  };
  const handleSearch = () => {
    CourseService.getCourseByName(searchInput)
      .then((data) => {
        console.log(data.data.foundCourse);
        setSearchResult(data.data.foundCourse);
        if (data.data.foundCourse.length == 0) {
          setMessage("找不到該課程。");
        } else {
          setMessage("");
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          AuthService.logout(); //清空local storage
          window.alert("Token 已過期，重定向到登入頁面");
          setCurrentUser(null);
          navigate("/login");
        }
      });
  };
  const handleEnroll = (e) => {
    CourseService.enroll(e.target.id)
      .then((data) => {
        if (data.data.result == "success") {
          window.alert("已成功註冊課程，將導向個人課程頁面");
          navigate("/course");
        } else {
          setMessage("此課程你已經註冊過了!");
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          AuthService.logout(); //清空local storage
          window.alert("Token 已過期，重定向到登入頁面");
          setCurrentUser(null);
          navigate("/login");
        }
      });
  };

  return (
    <div style={{ padding: "3rem" }}>
      {!currentUser && (
        <div>
          <p>You must login first before searching for courses.</p>
          <button
            className="btn btn-primary btn-lg"
            onClick={handleTakeToLogin}
          >
            Take me to login page.
          </button>
        </div>
      )}
      {currentUser && currentUser.user.role == "instructor" && (
        <div>
          <h1>Only students can enroll in courses.</h1>
        </div>
      )}
      {currentUser && currentUser.user.role == "student" && (
        <div className="search input-group mb-3">
          <input
            onChange={handleChangeInput}
            type="text"
            className="form-control"
            style={{ width: "10%" }}
          />
          <button onClick={handleSearch} className="btn btn-primary">
            Search
          </button>
        </div>
      )}
      {message && <div className="alert alert-danger">{message}</div>}
      {currentUser && searchResult && searchResult.length != 0 && (
        <div>
          <p>我們從 API 返回的數據。</p>
          {searchResult.map((course) => (
            <div key={course._id} className="card" style={{ width: "18rem" }}>
              <div className="card-body">
                <h5 className="card-title">課程名稱：{course.title}</h5>
                <p className="card-text">{course.description}</p>
                <p>價格: {course.price}</p>
                <p>目前的學生人數: {course.students.length}</p>
                <p>講師: {course.instructor.username}</p>
                <a
                  href="#"
                  onClick={handleEnroll}
                  className="card-text btn btn-primary"
                  id={course._id}
                >
                  註冊課程
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EnrollComponent;
