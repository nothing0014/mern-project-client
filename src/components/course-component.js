import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CourseService from "../services/course.service";
import AuthService from "../services/auth.service";

const CourseComponent = ({
  currentUser,
  setCurrentUser,
  patchCourseData,
  setPatchCourseData,
}) => {
  const navigate = useNavigate();
  const handleTakeToLogin = () => {
    navigate("/login");
  };
  const [courseData, setCourseData] = useState(null);

  const handleDelete = (_id) => {
    console.log("執行handleDelete，id為" + _id);
    CourseService.deleteCourseByID(_id)
      .then(() => {
        window.alert("課程已被刪除");
        CourseService.get(currentUser.user._id)
          .then((data) => {
            setCourseData(data.data.foundCourses);
          })
          .catch((error) => {
            if (error.response && error.response.status === 401) {
              AuthService.logout(); //清空local storage
              window.alert("Token 已過期，重定向到登入頁面");
              setCurrentUser(null);
              navigate("/login");
            }
          });
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

  const handleDropOut = (_id) => {
    console.log("執行handleDropOut，id為" + _id);
    CourseService.dropOutCourseByID(_id)
      .then(() => {
        window.alert("課程已取消註冊");
        CourseService.get(currentUser.user._id)
          .then((data) => {
            setCourseData(data.data.foundCourses);
          })
          .catch((error) => {
            if (error.response && error.response.status === 401) {
              AuthService.logout(); //清空local storage
              window.alert("Token 已過期，重定向到登入頁面");
              setCurrentUser(null);
              navigate("/login");
            }
          });
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

  useEffect(() => {
    let _id;
    if (currentUser) {
      _id = currentUser.user._id;
      if (currentUser.user.role == "instructor") {
        CourseService.get(_id)
          .then((data) => {
            setCourseData(data.data.foundCourses);
          })
          .catch((error) => {
            if (error.response && error.response.status === 401) {
              AuthService.logout(); //清空local storage
              window.alert("Token 已過期，重定向到登入頁面");
              setCurrentUser(null);
              navigate("/login");
            }
          });
      } else if (currentUser.user.role == "student") {
        CourseService.getEnrolledCourse(_id)
          .then((data) => {
            setCourseData(data.data.foundCourses);
          })
          .catch((error) => {
            if (error.response && error.response.status === 401) {
              AuthService.logout(); //清空local storage
              window.alert("Token 已過期，重定向到登入頁面");
              setCurrentUser(null);
              navigate("/login");
            }
          });
      }
    }
  }, []);
  return (
    <div style={{ padding: "3rem " }}>
      {!currentUser && (
        <div>
          <p>您必須先登入才能看到課程</p>
          <button
            onClick={handleTakeToLogin}
            className="btn btn-primary btn-lg"
          >
            回到登入頁面
          </button>
        </div>
      )}
      {currentUser && currentUser.user.role == "instructor" && (
        <div>
          <h1>歡迎來到講師的課程頁面。</h1>
        </div>
      )}
      {currentUser && currentUser.user.role == "student" && (
        <div>
          <h1>歡迎來到學生的課程頁面。</h1>
        </div>
      )}
      {currentUser && courseData && courseData.length != 0 && (
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {courseData.map((course) => {
            return (
              <div className="card" style={{ width: "18rem", margin: "1rem" }}>
                <div className="card-body">
                  <h5 className="card-title">課程名稱:{course.title}</h5>
                  <p style={{ margin: "0.5rem 0rem" }} className="card-text">
                    {course.description}
                  </p>
                  <p style={{ margin: "0.5rem 0rem" }}>
                    學生人數: {course.students.length}
                  </p>
                  <p style={{ margin: "0.5rem 0rem" }}>
                    課程價格: {course.price}
                  </p>
                  {currentUser.user.role == "student" && (
                    <button
                      onClick={() => handleDropOut(course._id)}
                      className="btn btn-danger"
                      style={{ margin: "0.5rem 0.5rem" }}
                    >
                      <span>取消註冊</span>
                    </button>
                  )}
                  {currentUser.user.role == "instructor" && (
                    <div style={{ display: "flex", flexWrap: "wrap" }}>
                      <button
                        className="btn btn-primary"
                        onClick={() => {
                          setPatchCourseData(course);
                          navigate("/patchCourse");
                        }}
                        style={{ margin: "0.5rem 0.5rem" }}
                      >
                        <span>修改課程</span>
                      </button>
                      <button
                        onClick={() => handleDelete(course._id)}
                        className="btn btn-danger"
                        style={{ margin: "0.5rem 0.5rem" }}
                      >
                        <span>刪除課程</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CourseComponent;
