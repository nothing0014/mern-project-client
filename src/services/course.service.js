import axios from "axios";

const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://mern-project-server-gjrd.onrender.com/api/courses"
    : "http://localhost:8080/api/courses";

axios.interceptors.request.use(
  function (config) {
    // 在發送請求之前增加headers
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
      console.log(token);
    } else {
      token = "";
    }
    config.headers["Authorization"] = token;
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// 在回傳response之前查看response
axios.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (error.response && error.response.status === 401) {
      console.log("Token 已過期，重定向到登入頁面");
    }
    return Promise.reject(error);
  }
);

class courseService {
  post(title, description, price) {
    return axios.post(API_URL, { title, description, price });
  }
  //使用學生id，找到學生註冊的課程
  getEnrolledCourse(_id) {
    return axios.get(API_URL + "/student/" + _id);
  }

  //使用instructor id，來找到講師擁有的課程
  get(_id) {
    return axios.get(API_URL + "/instructor/" + _id);
  }

  getCourseByName(name) {
    return axios.get(API_URL + "/findbyname/" + name);
  }

  getCourseByID(_id) {
    return axios.get(API_URL + _id);
  }

  enroll(_id) {
    return axios.post(API_URL + "/enroll/" + _id, {});
  }

  //根據course ID 刪除課程
  deleteCourseByID(_id) {
    return axios.delete(API_URL + "/" + _id);
  }

  //根據course ID 修改課程
  patchCourseByID(_id, title, description, price) {
    return axios.patch(API_URL + "/" + _id, { title, description, price });
  }

  //根據課程ID 讓學生取消註冊
  dropOutCourseByID(_id) {
    return axios.patch(API_URL + "/dropOut/" + _id, {});
  }
}

export default new courseService();
