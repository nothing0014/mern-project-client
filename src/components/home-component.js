import React from "react";
import { useNavigate } from "react-router-dom";

const HomeComponent = () => {
  const navigate = useNavigate();
  const handleTakeToLogin = () => {
    navigate("/login");
  };
  return (
    <main>
      <div className="container py-4">
        <div className="p-5 mb-4 bg-light rounded-3">
          <div className="container-fluid py-5">
            <h1 className="display-5 fw-bold">選課系統</h1>
            <p className="col-md-8 fs-4">
              本選課系統使用 React.js 作為前端框架，Node.js、MongoDB
              作為後端服務器。學生可以註冊、取消註冊課程。教師則可以新增、修改、刪除課程。
            </p>
          </div>
        </div>

        <div className="row align-items-md-stretch">
          <div className="col-md-6">
            <div className="h-100 p-5 text-white bg-dark rounded-3">
              <h2>作為一個學生</h2>
              <p>學生可以註冊他們喜歡的課程。</p>
              <button
                onClick={handleTakeToLogin}
                className="btn btn-outline-light"
                type="button"
              >
                開始學習
              </button>
            </div>
          </div>
          <div className="col-md-6">
            <div className="h-100 p-5 bg-light border rounded-3">
              <h2>作為一個導師</h2>
              <p>您可以通過註冊成為一名講師，並開始製作課程。</p>
              <button
                onClick={handleTakeToLogin}
                className="btn btn-outline-secondary"
                type="button"
              >
                開始上課
              </button>
            </div>
          </div>
        </div>

        <footer className="pt-3 mt-4 text-muted border-top">
          &copy; 2024 Allen Yen
        </footer>
      </div>
    </main>
  );
};

export default HomeComponent;
