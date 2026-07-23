import { createBrowserRouter } from "react-router-dom";
import HomePage from "../features/home/HomePage";

export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <HomePage />,
    },
  ],
  {
    basename: import.meta.env.BASE_URL,
  },
);
