import React, { useEffect, useRef, useState } from "react";
import NavTop from "../../layout/components/NavTop/NavTop";
import "./styles.css";
import { deleteUser, getUser } from "../../services/userService";
import { toastError, toastSuccess } from "../../constant/toast";
import threeDot from "../../assets/three-dot.png";
import { signup } from "../../services/authenService";
import { useCookies } from "react-cookie";

function Users() {
  const [cookies] = useCookies(["userinfo"]);
  const [userData, setUserData] = useState([]);
  const [showPopup, setShowPopup] = useState(0);
  const popupRef = useRef(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [popupAdd, setPopupAdd] = useState(false);

  const getDataUser = async () => {
    try {
      const res = await getUser();
      if (!res?.error) {
        setUserData(
          res?.users.filter((item) => item.role !== cookies?.userInfo.role)
        );
        toastSuccess("Get Complete!");
      } else {
        toastError("Get Incomplete!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDataUser();
  }, []);

  const handleClick = (id) => {
    id === showPopup ? setShowPopup(0) : setShowPopup(id);
  };

  const handleDelete = async (id) => {
    try {
      const res = await deleteUser(id);
      if (!res?.error) {
        window.location.reload();
        toastSuccess("Delete Complete!");
      } else {
        toastError("Delete Incomplete!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleAdd = async (username, password) => {
    let tmp = `{ "username": "${username}", "password": "${password}" }`;
    let params = JSON.parse(tmp);
    if (username && password) {
      const response = await signup(params);
      if (response?.token) {
        setPopupAdd(false);
        toastSuccess("Add success");
        window.location.reload();
      } else toastError(response?.error);
    } else {
      toastError("Error");
    }
  };

  useEffect(() => {
    const handleOutsideClick = (e) => {
      console.log(e);
      const clickedIcon = e.target.closest(".tdIcon");
      if (!clickedIcon) {
        setShowPopup(0);
      }
    };

    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);
  const heightWindow = window.innerHeight;
  return (
    <div className="all" style={{ height: heightWindow }}>
      <NavTop />
      <div className="table-user">
        <div className="button-add" onClick={() => setPopupAdd(true)}>
          + Thêm
        </div>
        <table className="table">
          <thead className="header">
            <tr className="header">
              <th style={{ maxWidth: "100px" }}>Tên tài khoản</th>
              <th>Số điện thoại</th>
              <th>Địa chỉ</th>
              <th style={{ width: "120px", textAlign: "center" }}>Hành động</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {userData.map((userItem, index) => (
              <tr
                key={userItem.id}
                className="border-b-stone-800 border-b-[1px]">
                <td>{userItem.username}</td>
                <td>{userItem.phoneNumber ?? "Không có dữ liệu"}</td>
                <td style={{ maxWidth: "300px" }}>
                  {userItem.address ?? "Không có dữ liệu"}
                </td>
                <td
                  className="tdIcon"
                  ref={popupRef}
                  onClick={() => handleClick(userItem._id)}>
                  <img src={threeDot} alt="Description" className="icon-dot" />
                  {userItem._id === showPopup && (
                    <div className="popup" key={index}>
                      <ul>
                        <li>Chỉnh sửa</li>
                        <li onClick={() => handleDelete(userItem._id)}>Xóa</li>
                      </ul>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {popupAdd && (
          <div className="pop-up-add">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAdd(username, password);
              }}
              className="add-form">
              <div className="closeAdd" onClick={() => setPopupAdd(false)}>
                <p style={{ fontSize: 20 }}>X</p>
              </div>
              <h2 className="title">Thêm tài khoản cho người dùng</h2>
              <div className="input-field">
                <i className="fas fa-user"></i>
                <input
                  type="text"
                  placeholder="Username"
                  onChange={(e) => setUsername(e.target.value)}
                  value={username}
                />
              </div>
              <div className="input-field">
                <i className="fas fa-lock"></i>
                <input
                  type="password"
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                />
              </div>
              <input type="submit" className="btn" value="Thêm" />
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default Users;
