import { createBrowserRouter, RouterProvider } from "react-router";
import RootLayout from "../layouts/RootLayout";
import Home from "../pages/Home";
import Login from "../components/Auth/Login";
import Register from "../components/Auth/Register";
import Dashboard from "../pages/Dashboard";
import AddPost from "../components/Add Post/AddPost";
import PostDetails from "../components/Home/Posts/PostDetails";
import MyProfile from "../components/dashboard/MyProfile";
import MyPosts from "../components/dashboard/MyPosts";
import Payment from "../components/payment/Payment";
import Comments from "../components/dashboard/Comments";
import AdminProfile from "../components/dashboard/AdminProfile";
import ManageUser from "../components/dashboard/ManageUser";
import ReportedComments from "../components/dashboard/ReportedComments";
import MakeAnnouncements from "../components/dashboard/MakeAnnouncements";
import PrivateRouter from "../private/PrivateRouter";
import Forbidden from "../components/404 page/Forbidden";
import AdminRoute from "../private/AdminRoute";
import NotFound from "../components/404 page/NotFound";
import Announcements from "../pages/Announcements";
import AllPost from "../pages/AllPost";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "/member",
        element: (
          <PrivateRouter>
            <Payment></Payment>
          </PrivateRouter>
        ),
      },
      {
        path: "login",
        Component: Login,
      },
      {
        path: "announcements",
        Component: Announcements,
      },
      {
        path: "all-post",
        Component: AllPost,
      },
      {
        path: "forbidden",
        Component: Forbidden,
      },
      {
        path: "register",
        Component: Register,
      },
      {
        path: "posts/:id",
        element: (
          <PrivateRouter>
            <PostDetails></PostDetails>
          </PrivateRouter>
        ),
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRouter>
        <Dashboard></Dashboard>
      </PrivateRouter>
    ),
    children: [
      {
        index: true,
        Component: MyProfile,
      },
      {
        path: "/dashboard/comments/:id",
        Component: Comments,
      },
      {
        path: "/dashboard/add-post",
        Component: AddPost,
      },
      {
        path: "/dashboard/my-posts",
        Component: MyPosts,
      },
      {
        path: "/dashboard/admin-profile",
        element: (
          <AdminRoute>
            <AdminProfile></AdminProfile>
          </AdminRoute>
        ),
      },
      {
        path: "/dashboard/manage-users",
        element: (
          <AdminRoute>
            <ManageUser></ManageUser>
          </AdminRoute>
        ),
      },
      {
        path: "/dashboard/reported-comments",
        element: (
          <AdminRoute>
            <ReportedComments></ReportedComments>
          </AdminRoute>
        ),
      },
      {
        path: "/dashboard/announcements",
        element: (
          <AdminRoute>
            <MakeAnnouncements></MakeAnnouncements>
          </AdminRoute>
        ),
      },
    ],
  },
  {
    path: "*",
    Component: NotFound,
  },
]);
