import { createBrowserRouter, RouterProvider } from "react-router";
import RootLayout from "../layouts/RootLayout";
import Home from "../pages/Home";
import About from "../components/About/About";
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
        Component: Payment,
      },
      {
        path: "login",
        Component: Login,
      },
      {
        path: "register",
        Component: Register,
      },
      {
        path: "add-post",
        Component: AddPost,
      },
      {
        path: "posts/:id",
        Component: PostDetails,
      },
    ],
  },
  {
    path: "/dashboard",
    Component: Dashboard,
    children: [
      {
        index: true,
        Component: MyProfile,
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
        Component: AdminProfile,
      },
      {
        path: "/dashboard/manage-users",
        Component: ManageUser,
      },
      {
        path: "/dashboard/reported-comments",
        Component: ReportedComments,
      },
      {
        path: "/dashboard/announcements",
        Component: MakeAnnouncements,
      },
      {
        path: "/dashboard/comments/:id",
        Component: Comments,
      },
    ],
  },
]);
