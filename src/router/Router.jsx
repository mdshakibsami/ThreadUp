import { createBrowserRouter, RouterProvider } from "react-router";
import RootLayout from "../layouts/RootLayout";
import Home from "../pages/Home";
import About from "../components/About/About";

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
        path: "about",
        Component: About,
      },
    ],
  },
]);
