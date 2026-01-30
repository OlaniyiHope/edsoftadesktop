

import { useEffect, useState, useRef, useContext } from "react";

import axios from "axios";
import {
  FaBell,
  FaCog,
  FaHome,
  FaNewspaper,
  FaSignOutAlt,
  FaStickyNote,
  FaChevronDown, FaUserCircle, FaUsers 
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import useAuth from "../hooks/useAuth";
import AddUser from "./AddUser";
import "./admin.css";
import { useSidebar } from "./SidebarProvider";
import practiceIcon from "./practiceicon/p1.png";
import studyIcon from "./practiceicon/p2.png";
import gamesIcon from "./practiceicon/p3.png";
import savedIcon from "./practiceicon/p4.png";
import searchIcon from "./practiceicon/p5.png";
import joinIcon from "./practiceicon/p6.png";
import forumIcon from "./practiceicon/p7.png";
import { AuthContext } from "../contexts/AuthContext";


const SideNav = () => {
  // const { user } = useAuth(); // Access the authenticated user
  const { user } = useContext(AuthContext); // ✅ Use this for username/email

  const [points, setPoints] = useState([]);
  const { isSidebarOpen } = useSidebar(); // use context to get sidebar state
  const [showModal, setShowModal] = useState(false);
  const [showModals, setShowModals] = useState(false);
  const apiUrl = process.env.REACT_APP_API_URL;
 const { logout } = useAuth()
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [profiles, setProfiles] = useState([]);
  const dropdownRef = useRef(null);
  
  const [visions, setVisions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Paginate the cards


const [showNewsModal, setShowNewsModal] = useState(false);

  

const [username, setUsername] = useState("");

useEffect(() => {
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    const user = JSON.parse(storedUser);
    setUsername(user.username); // or fullname if you want full name
  }
}, []);
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

useEffect(() => {
    const loadProfiles = async () => {
      if (!user?.id) return;

      const res = await window.electron.ipcRenderer.invoke(
        "profiles:list",
        user.id
      );
      setProfiles(res);
    };

    loadProfiles();
  }, [user]);

  // close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

 return (
  <>
    {/* SIDEBAR — 20% */}
    <aside className="sidebar">
   <div className="profile" onClick={() => setOpen(!open)}>
        <div className="avatar" />
          <div className="dropdown-section">
            <strong>{user?.username}</strong>
            {/* <small>{user?.email}</small> */}
          </div>
        <div className="bell">
          <FaBell />
          <span className="badge">23</span>
        </div>
        <FaChevronDown className={`chevron ${open ? "rotate" : ""}`} />
      </div>

      {/* DROPDOWN */}
      {open && (
        <div className="profile-dropdown">
          {/* OWNER */}
        

          {/* PROFILES */}
          <div className="dropdown-section">
            {profiles.map((p) => (
              <div key={p.id} className="dropdown-item">
                <FaUserCircle />
                <span>{p.display_name}</span>
              </div>
            ))}
          </div>

          {/* MANAGE USERS */}
          <button
            className="manage-users-btn"
            onClick={() => {
              setOpen(false);
              navigate("/manage-user");
            }}
          >
            <FaUsers />
            Manage Users
          </button>
        </div>
      )}
    

      <nav>
        <button className="active"    onClick={() => navigate("/dashboard")}>
          <FaHome /> Home
        </button>
        <button   onClick={() => navigate("/study-material")}>
          <FaStickyNote /> Notes
        </button>
     <button onClick={() => setShowNewsModal(true)}>
  <FaNewspaper /> News
</button>

        <button onClick={() => navigate("/settings")}>
          <FaCog /> Settings
        </button>
      </nav>


<AddUser
  open={showModal}
  onClose={() => setShowModal(false)}
/>

    </aside>

   {showNewsModal && (
  <div
    className="modal-overlay"
    onClick={(e) => {
      if (e.target.classList.contains("modal-overlay")) {
        setShowNewsModal(false);
      }
    }}
  >
    <div className="modal-content">
      <button
        className="modal-close"
        onClick={() => setShowNewsModal(false)}
      >
        ✕
      </button>
      <h3>📰 News</h3>
      <p>Coming soon! Stay tuned for updates.</p>
    </div>
  </div>
)}
  </>
);

};

export default SideNav;
