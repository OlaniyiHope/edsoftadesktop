

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


const Dashboard = () => {
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

  useEffect(() => {
    const fetchVisions = async () => {
      try {
        // Get the token from localStorage or a global state
        const token = localStorage.getItem("jwtToken"); // Change this based on your actual method of storing the token

        if (!token) {
          console.error("No authentication token found");
          return;
        }
        console.log("API URL:", `${apiUrl}/api/get-all`);
        console.log("Auth Token:", token);

        // Add token to the headers
        const response = await axios.get(`${apiUrl}/api/get-all`, {
          headers: {
            Authorization: `Bearer ${token}`, // Adding the token to Authorization header
          },
        });
        console.log("Full Response:", response);

        setVisions(response.data); // Assuming the API response contains the visions
      } catch (error) {
        console.error("Error fetching visions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVisions();
  }, []);
function FeatureCard({ title, active }) {
  return (
    <div className={`feature-card ${active ? "active" : ""}`}>
      <div className="icon" />
      <p>{title}</p>
    </div>
  );
}
  // Paginate the cards

  const updateTableData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/get-all`);
      setVisions(response.data); // Update the visions state with the new list
    } catch (error) {
      console.error("Error fetching updated visions:", error);
    }
  };

  const boxColors = [
    "#f4f4f4", // Red
    "#f4f4f4", // Dark Blue
    "#f4f4f4", // Blue
    "#f4f4f4", // Green
    "#f4f4f4", // Yellow
    "#f4f4f4", // Purple
    "#f4f4f4", // Teal
    "#f4f4f4", // Orange
    "#f4f4f4", // Gray
  ];
  const handleClick = (title) => {
    if (title === "Practice for UTME") {
      navigate("/practice-exam"); // Adjust the route as needed
    }else if (title === "Read/Listen to Study Material"){
      navigate("/study-material");
    }
  };
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
  <div className="dashboard">
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
        <button   onClick={() => navigate("/note")}>
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

    {/* BODY — 80% */}
    <main className="bodys">
      {/* HEADER INSIDE BODY */}
      <header className="headers">
        <div>
   <h1>Good evening, {username || "User"}</h1>

          {/* <p className="subtitle">
            Hello there, we have a study plan drafted just for you.
          </p> */}
        </div>

        <button className="logout" onClick={handleLogout}>
        <FaSignOutAlt /> Log out
      </button>
      </header>

           <p className="subtitle">
            Hello there, we have a study plan drafted just for you.
          </p>
          <button className="primary-btn2">Get started</button>

      {/* BODY CONTENT */}
      <div className="body-content">
         
<section className="left-section">
  <div className="box-container">

    {/* OFFLINE LABEL */}
    <div className="grid-label">Offline Features</div>

    {[
  { icon: practiceIcon, title: "Practice for UTME" },
  { icon: studyIcon, title: "Read/Listen to Study Material" },
  { icon: gamesIcon, title: "Play Games" },
  { icon: savedIcon, title: "Saved Question" },

    ].map((item, index) => (
      <div
        key={`offline-${index}`}
        className="custom-box"
        style={{ backgroundColor: boxColors[index % boxColors.length] }}
        onClick={() => handleClick(item.title)}
      >
        <div className="box-icon">
     <img
  src={item.icon}
  alt={item.title}
  className="grid-icon"
   style={{width: "30px", height: "30px"}}
/>

        </div>
        <h6 style={{color: "black"}}>{item.title}</h6>
      </div>
    ))}

    {/* ONLINE LABEL */}
    <div className="grid-label">Online Features</div>

    {[
      // { icon: "fas fa-chalkboard-teacher", title: "Search for Tutors" },
      // { icon: "fas fa-microscope", title: "Join Forum" },
      // { icon: "fas fa-globe", title: "See Learning Recommendation" },

    
  { icon: searchIcon, title: "Search for Tutors" },
  { icon: joinIcon, title: "Join Forum" },
  { icon: forumIcon, title: "See Learning Recommendation" },


    ].map((item, index) => (
      <div
        key={`online-${index}`}
        className="custom-box"
        style={{ backgroundColor: boxColors[(index + 4) % boxColors.length] }}
        onClick={() => handleClick(item.title)}
      >
        <div className="box-icon">
        <img
  src={item.icon}
  alt={item.title}
  className="grid-icon"
  style={{width: "30px", height: "30px"}}
/>

        </div>
        <h6 style={{color: "black"}}>{item.title}</h6>
      </div>
    ))}

  </div>
</section>



        {/* RIGHT — 40% */}
        <aside className="right-section">
          <div className="promo-card">
            <div className="circle">SSCE</div>
            <h4>More from Edu Pro Solution</h4>
            <p>
              Get practicing with our prep app for your WAEC/SSCE exam.
            </p>
            <button className="primary-btn small" style={{backgroundColor: "#0366D6"}}>Download app</button>
          </div>

          <div className="report-card">
            <h4>Latest test report</h4>
            <p>
              You scored a total of <strong>30/100</strong> in Physics,
              Chemistry & Mathematics
            </p>
            <button className="outline-btn">
              View result history
            </button>
          </div>
        </aside>
      </div>
    </main>
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

  </div>
);

};

export default Dashboard;
