// import { useState, useEffect } from "react";
// import {
//   FaBell,
//   FaCog,
//   FaHome,
//   FaNewspaper,
//   FaStickyNote
// } from "react-icons/fa";
// import AddUser from "./AddUser";
// import "./admin.css";
// import TopicModal from "./TopicModal";
// import { useNavigate } from "react-router-dom";
// import SideNav from "./SideNav";
// import YearModal from "./YearModal";

// const Year = () => {
//   const [activeTab, setActiveTab] = useState("key");
//   const [showModal, setShowModal] = useState(false);
// const navigate = useNavigate();
//   const [selectedSubject, setSelectedSubject] = useState("");
// const [subjectYears, setSubjectYears] = useState({});

  
// const [subjects, setSubjects] = useState([]);
//   const [subjectsState, setSubjectsState] = useState({});


//   useEffect(() => {
//     window.api.getSubjects().then((data) => {
//       console.log("SUBJECTS FROM ELECTRON:", data);
//       setSubjects(data);
//     });
//   }, []);
//   const handleSubjectClick = (subject) => {
//     setSelectedSubject(subject);
//     setShowModal(true);
//   };



// //   const handleSubmitTopics = (subject, topics) => {
// //     setSubjectTopics({ ...subjectTopics, [subject]: topics });
// //     console.log("Selected topics for", subject, topics);
// //   };
//   const toggleSubject = (subject) => {
//   setSubjectsState((prev) => ({
//     ...prev,
//     [subject]: prev[subject]
//       ? { ...prev[subject], enabled: !prev[subject].enabled }
//       : {
//           enabled: true,
//           topicCount: 10,
//           includeTheory: false,
//           selectedTopics: []
//         }
//   }));
// };
// const openTopicModal = async (subject) => {
//   setSelectedSubject(subject);

//   // Fetch years instead of topics
//   if (!subjectYears[subject]) {
//     const years = await window.api.getSubjectYears(subject); // <-- new IPC that returns years
//     console.log(`Years fetched for ${subject}:`, years);
//     setSubjectYears((prev) => ({ ...prev, [subject]: years }));
//   } else {
//     console.log(`Years already loaded for ${subject}:`, subjectYears[subject]);
//   }

//   setShowModal(true);
// };


// //   const handleSubmitTopics = (subject, topics) => {
// //     setSubjectsState((prev) => ({
// //       ...prev,
// //       [subject]: {
// //         ...prev[subject],
// //         selectedTopics: topics
// //       }
// //     }));
// //   };
// const handleSubmitYears = (subject, years) => {
//   setSubjectsState((prev) => ({
//     ...prev,
//     [subject]: {
//       ...prev[subject],
//       selectedYears: years
//     }
//   }));
// };


//   return (
//     <div className="dashboard">
//       {/* SIDEBAR */}
//       <SideNav />
// {/* MAIN */}
// <main className="bodys">
//   <header className="headers">
//     <h1>Practice by Year</h1>
//   </header>

//   <section className="topic-container">

//     {/* ADD SUBJECT BUTTON */}
//     <button className="add-subject-btn">
//       + Add Practice Year
//     </button>
// <div className="subject-list">
//   {subjects.map((subject) => {
//     const state = subjectsState[subject] || {
//       enabled: false,
//       topicCount: 10,
//       includeTheory: false,
//       selectedYears: [] 
//     };

//     return (
//       <div key={subject} className="subject-block">
//         {/* SUBJECT CHECKBOX */}
//         <label className="subject-item">
//           <input
//             type="checkbox"
//             checked={state.enabled}
//             onChange={() => toggleSubject(subject)}
//           />
//           <span style={{color: "black"}}>{subject}</span>
//         </label>

//         {state.enabled && (
//           <div className="subject-options">

//             {/* SELECT TOPICS */}
//             <button
//               className="select-topics-btn"
//               onClick={() => openTopicModal(subject)}
//             >
//               Select Year
//             </button>

//             {/* NUMBER OF QUESTIONS */}
//             <select
//               className="question-count-select"
//               value={state.topicCount}
//               onChange={(e) =>
//                 setSubjectsState((prev) => ({
//                   ...prev,
//                   [subject]: {
//                     ...prev[subject],
//                     topicCount: Number(e.target.value),
//                   },
//                 }))
//               }
//             >
//               {[5, 10, 15, 20, 30].map((num) => (
//                 <option key={num} value={num}>
//                   {num}
//                 </option>
//               ))}
//             </select>

//             {/* INCLUDE THEORY */}
//             <label className="theory-toggle">
//               <input
//                 type="checkbox"
//                 checked={state.includeTheory}
//                 onChange={(e) =>
//                   setSubjectsState((prev) => ({
//                     ...prev,
//                     [subject]: {
//                       ...prev[subject],
//                       includeTheory: e.target.checked,
//                     },
//                   }))
//                 }
//               />
//               <span style={{color: "black"}}>Include Theory</span>
//             </label>

//             {/* SELECTED TOPICS */}
//           {state.selectedYears && state.selectedYears.length > 0 && (
//   <div className="selected-topics">
//     {state.selectedYears.join(", ")}
//   </div>
// )}

//           </div>
//         )}
//       </div>
//     );
//   })}
// </div>


// <button
//   className="start-test-btn"
//   onClick={() => {
//     const enabledSubjects = Object.fromEntries(
//       Object.entries(subjectsState).filter(
//         ([_, value]) => value.enabled
//       )
//     );

//     localStorage.setItem(
//       "examConfig",
//       JSON.stringify({ subjects: enabledSubjects })
//     );

//     navigate("/start-test");
//   }}
// >
//   Start Test
// </button>


//   </section>
// </main>
// <YearModal
//   open={showModal}
//   onClose={() => setShowModal(false)}
//   subject={selectedSubject}
//   years={subjectYears[selectedSubject] || []} // ✅ use years
//   onSubmit={handleSubmitYears}               // ✅ use handleSubmitYears
// />

//     </div>
//   );
// };

// export default Year;
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SideNav from "./SideNav";
import YearModal from "./YearModal";
import "./admin.css";

const Year = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedYear, setSelectedYear] = useState("");
  const [yearData, setYearData] = useState({}); // stores available items per year

  const [years, setYears] = useState([]); // main list of years
  const [yearsState, setYearsState] = useState({}); // stores enabled & selected info

  // Load years from backend/Electron API
  useEffect(() => {
    window.api.getYears().then((data) => {
      console.log("Years FROM ELECTRON:", data);
      setYears(data); // e.g., ["1999", "2000", "2001"]
    });
  }, []);

  // Toggle a year on/off
  const toggleYear = (year) => {
    setYearsState((prev) => ({
      ...prev,
      [year]: prev[year]
        ? { ...prev[year], enabled: !prev[year].enabled }
        : {
            enabled: true,
            questionCount: 10,
            includeTheory: false,
            selectedItems: [],
          },
    }));
  };

  // Open modal to select items inside a year
  const openYearModal = async (year) => {
    setSelectedYear(year);

    // Fetch items for that year if not already loaded
    if (!yearData[year]) {
      const items = await window.api.getYearItems(year); // call your IPC to fetch items
      console.log(`Items fetched for ${year}:`, items);
      setYearData((prev) => ({ ...prev, [year]: items }));
    } else {
      console.log(`Items already loaded for ${year}:`, yearData[year]);
    }

    setShowModal(true);
  };

  // Submit selected items from modal
  const handleSubmitItems = (year, items) => {
    setYearsState((prev) => ({
      ...prev,
      [year]: {
        ...prev[year],
        selectedItems: items,
      },
    }));
  };

  return (
    <div className="dashboard">
      <SideNav />

      <main className="bodys">
        <header className="headers">
          <h1>Practice by Year</h1>
        </header>

        <section className="topic-container">
          <button className="add-subject-btn">+ Add Practice Year</button>

          <div className="subject-list">
            {years.map((year) => {
              const state = yearsState[year] || {
                enabled: false,
                questionCount: 10,
                includeTheory: false,
                selectedItems: [],
              };

              return (
                <div key={year} className="subject-block">
                  {/* YEAR CHECKBOX */}
                  <label className="subject-item">
                    <input
                      type="checkbox"
                      checked={state.enabled}
                      onChange={() => toggleYear(year)}
                    />
                    <span style={{ color: "black" }}>{year}</span>
                  </label>

                  {state.enabled && (
                    <div className="subject-options">
                      {/* SELECT ITEMS */}
                      <button
                        className="select-topics-btn"
                        onClick={() => openYearModal(year)}
                      >
                        Select Items
                      </button>

                      {/* NUMBER OF QUESTIONS */}
                      <select
                        className="question-count-select"
                        value={state.questionCount}
                        onChange={(e) =>
                          setYearsState((prev) => ({
                            ...prev,
                            [year]: {
                              ...prev[year],
                              questionCount: Number(e.target.value),
                            },
                          }))
                        }
                      >
                        {[5, 10, 15, 20, 30].map((num) => (
                          <option key={num} value={num}>
                            {num}
                          </option>
                        ))}
                      </select>

                      {/* INCLUDE THEORY */}
                      <label className="theory-toggle">
                        <input
                          type="checkbox"
                          checked={state.includeTheory}
                          onChange={(e) =>
                            setYearsState((prev) => ({
                              ...prev,
                              [year]: {
                                ...prev[year],
                                includeTheory: e.target.checked,
                              },
                            }))
                          }
                        />
                        <span style={{ color: "black" }}>Include Theory</span>
                      </label>

                      {/* SELECTED ITEMS */}
                      {state.selectedItems.length > 0 && (
                        <div className="selected-topics">
                          {state.selectedItems.join(", ")}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <button
            className="start-test-btn"
            onClick={() => {
              const enabledYears = Object.fromEntries(
                Object.entries(yearsState).filter(([_, value]) => value.enabled)
              );

              localStorage.setItem(
                "examConfig",
                JSON.stringify({ years: enabledYears })
              );

              navigate("/start-test");
            }}
          >
            Start Test
          </button>
        </section>
      </main>

      <YearModal
        open={showModal}
        onClose={() => setShowModal(false)}
        year={selectedYear}
        items={yearData[selectedYear] || []}
        onSubmit={handleSubmitItems}
      />
    </div>
  );
};

export default Year;
