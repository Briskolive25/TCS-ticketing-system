// import { Navigate } from "react-router-dom";

// const PrivateRoute = ({ children, allowedRoles }) => {
//   const role = localStorage.getItem("userRole");

//   // not logged in
//   if (!role) {
//     return <Navigate to="/login" replace />;
//   }

//   // role not allowed
//   if (allowedRoles && !allowedRoles.includes(role)) {
//     return <Navigate to="/login" replace />;
//   }

//   return children;
// };

// export default PrivateRoute;
