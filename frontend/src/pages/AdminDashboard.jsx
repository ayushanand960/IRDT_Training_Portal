// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const AdminDashboard = () => {
//   const [users, setUsers] = useState([]);
//   const [token, setToken] = useState(localStorage.getItem("token"));
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const fetchUsers = async () => {
//     try {
//       const res = await axios.get("http://localhost:8000/users/", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setUsers(res.data);
//       setLoading(false);
//     } catch (err) {
//       setError("Failed to fetch users.");
//       setLoading(false);
//     }
//   };

//   const handleToggleCoordinator = async (ehrms_code, isCoordinator) => {
//     try {
//       await axios.patch(
//         `http://localhost:8000/users/${ehrms_code}/role/`,
//         { is_coordinator: !isCoordinator },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       setUsers((prevUsers) =>
//         prevUsers.map((user) =>
//           user.ehrms_code === ehrms_code
//             ? { ...user, role: isCoordinator ? "staff" : "coordinator" }
//             : user
//         )
//       );
//     } catch (err) {
//       console.error("Error updating role:", err);
//       alert("Failed to update user role.");
//     }
//   };

//   if (loading) return <p>Loading users...</p>;
//   if (error) return <p>{error}</p>;

//   return (
//     <div style={styles.container}>
//       <h2>Admin Dashboard</h2>
//       <table style={styles.table}>
//         <thead>
//           <tr>
//             <th>EHRMS Code</th>
//             <th>Email</th>
//             <th>Full Name</th>
//             <th>Role</th>
//             <th>Toggle Coordinator</th>
//           </tr>
//         </thead>
//         <tbody>
//           {users.map((user) => {
//             const isCoordinator = user.role === "coordinator";
//             return (
//               <tr key={user.id}>
//                 <td>{user.ehrms_code}</td>
//                 <td>{user.email}</td>
//                 <td>{user.full_name}</td>
//                 <td>{user.role}</td>
//                 <td>
//                   <button
//                     style={{
//                       ...styles.button,
//                       backgroundColor: isCoordinator ? "#f44336" : "#4CAF50",
//                     }}
//                     onClick={() =>
//                       handleToggleCoordinator(user.ehrms_code, isCoordinator)
//                     }
//                   >
//                     {isCoordinator ? "Remove" : "Make"} Coordinator
//                   </button>
//                 </td>
//               </tr>
//             );
//           })}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// const styles = {
//   container: {
//     padding: "20px",
//     fontFamily: "Arial",
//   },
//   table: {
//     width: "100%",
//     borderCollapse: "collapse",
//     marginTop: "20px",
//   },
//   button: {
//     padding: "8px 12px",
//     border: "none",
//     color: "white",
//     borderRadius: "4px",
//     cursor: "pointer",
//   },
// };

// export default AdminDashboard;




import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance"; // ✅ using centralized axios
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Bounce } from 'react-toastify';


const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get('login/users/');
      setUsers(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch users.");
      if (err.response?.status === 403) {
        alert("Access denied. Logging out.");
        localStorage.clear();
        navigate("/admin-login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleToggleCoordinator = async (ehrms_code, isCoordinator) => {
    try {
        await axiosInstance.post(`/login/update-role/`, {
        ehrms_code,
        is_coordinator: !isCoordinator,
      });

      // update UI without re-fetch
      setUsers((prevUsers) =>
        prevUsers.map((user) =>{

          if (user.ehrms_code !== ehrms_code) return user;

        // Promote to coordinator
          if (!isCoordinator) {
             toast.success(`🎉 ${user.full_name} is now a Coordinator!`, {
            icon: "🧑‍💼",
          });
            return {
              ...user,
              originalRole: user.role, // save current role
              role: "coordinator",
            };
          }

        // Demote from coordinator, restore original role
          toast.info(`⚠️ ${user.full_name} is now a ${user.originalRole || "staff"}.`, {
          icon: "👤",
        });
          return {
            
            ...user,
            role: user.originalRole || "staff",
            originalRole: undefined, // clean up
          };
        })
      );
    } catch (err) {
      console.error("Error updating role:", err);
      alert("Failed to update user role.");
    }
  };

  if (loading) return <p>Loading users...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={styles.container}>
      <h2>Admin Dashboard</h2>
      <table style={styles.table}>
        <thead>
          <tr>
            <th>EHRMS Code</th>
            <th>Email</th>
            <th>Full Name</th>
            <th>Role</th>
            <th>Toggle Coordinator</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            const isCoordinator = user.role === "coordinator";
            return (
              <tr key={user.id}>
                <td>{user.ehrms_code}</td>
                <td>{user.email}</td>
                <td>{user.full_name}</td>
                <td>{user.role}</td>
                <td>
                  <button
                    style={{
                      ...styles.button,
                      backgroundColor: isCoordinator ? "#f44336" : "#4CAF50",
                    }}
                    onClick={() =>
                      handleToggleCoordinator(user.ehrms_code, isCoordinator)
                    }
                  >
                    {isCoordinator ? "Remove" : "Make"} Coordinator
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <ToastContainer
      position="top-center"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      pauseOnHover
      draggable
      theme="colored"
      transition={Bounce}

    />
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
  },
  button: {
    padding: "8px 12px",
    border: "none",
    color: "white",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default AdminDashboard;
