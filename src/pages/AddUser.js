import { useState, useContext } from "react";
import { FaTimes, FaUserCircle } from "react-icons/fa";
import "./admin.css";
import { AuthContext } from "../contexts/AuthContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddUser = ({ refreshProfiles }) => {
  const [showModal, setShowModal] = useState(false);
  const [username, setUsername] = useState("");
 const { user } = useContext(AuthContext); // <-- change from currentUser

// const handleSave = async () => {
//   if (!username.trim()) return;

//  const ownerId = user.id; // instead of currentUser.id

//   const res = await window.electron.ipcRenderer.invoke(
//     "profiles:create",
//     { ownerId, displayName: username }
//   );

//   if (res.status === 201) {
//     toast.success("Profile added");
//     setUsername("");
//     setShowModal(false);
//     refreshProfiles();
//   }
// };

// const handleSave = async () => {
//   if (!username.trim()) return;

//   const ownerId = user.id;

//   let res; // define result variable outside

//   if (window.electron?.ipcRenderer) {
//     // Running inside Electron
//     res = await window.electron.ipcRenderer.invoke(
//       "profiles:create",
//       { ownerId, displayName: username }
//     );
//   } else {
//     // Running in browser (dev server)
//     console.warn("Electron ipcRenderer not available. Mocking response.");
//     res = { status: 201 }; // mock success
//   }

//   if (res.status === 201) {
//     toast.success("Profile added");
//     setUsername("");
//     setShowModal(false);
//     refreshProfiles?.(); // optional chaining in case prop is not passed
//   } else {
//     toast.error(res.message || "Failed to add profile");
//   }
// };
const handleSave = async () => {
  if (!username.trim()) return;
  const ownerId = user.id;

  let res;
  if (window.electron?.ipcRenderer) {
    res = await window.electron.ipcRenderer.invoke("profiles:create", {
      ownerId,
      displayName: username,
    });
  } else {
    res = { status: 201 };
  }

  if (res.status === 201) {
    toast.success("Profile added");
    setUsername("");
    setShowModal(false);
    refreshProfiles?.(); // ✅ Make sure this triggers the parent to reload
  } else {
    toast.error(res.message || "Failed to add profile");
  }
};

  return (
    <>
      {/* ADD USER CARD */}
      <div className="add-user" onClick={() => setShowModal(true)}>
        <span>+</span>
        <div>
          <strong>Add User</strong>
          <small>4 users added</small>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div
            className="modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => setShowModal(false)}
            >
              <FaTimes />
            </button>

            <div className="modal-icon">
              <FaUserCircle />
            </div>

            <h3>Add a User</h3>
            <p className="modal-text">
              Create a temporary profile for an additional user. Guest accounts
              can be edited by the owner’s account only.
            </p>

            <input
              type="text"
              placeholder="Enter user name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <button className="primary-btn" onClick={handleSave}>
              Save
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AddUser;
