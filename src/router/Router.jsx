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
        path: "/dashboard/my-profile",
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
    ],
  },
]);
