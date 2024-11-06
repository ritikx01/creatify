import "./App.css";
import NavBar, { Paths } from "@/components/NavBar";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  useNavigate,
} from "react-router-dom";
import HomePage from "@/pages/HomePage";
import CreatePage from "@/pages/CreatePage";
import AuthPage from "./pages/AuthPage";
import { NotificationProvider } from "./components/NotificationProvider";
import Settings from "./pages/Settings";

const paths: Paths[] = [
  { pathName: "Home", relativePath: "/" },
  { pathName: "Create", relativePath: "/create", highlight: true },
  // {pathName: 'Login', relativePath:'/login'}
];

const AuthActions = {
  SignUp: {
    actionName: "Sign Up",
    actionPath: "/api/sign-up",
  },
  Login: {
    actionName: "Login",
    actionPath: "/api/login",
  },
};

const Layout = () => (
  <div className="flex flex-col min-h-screen">
    <NavBar paths={paths} />
    <Outlet />
  </div>
);
const ErrorPage = ({ code = 500, message = "Something went wrong" }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
      <h1 className="text-4xl font-bold text-gray-600">{code}</h1>
      <p className="text-gray-400">{message}</p>
      <button
        onClick={() => navigate("/")}
        className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 transition-colors"
      >
        Go Home
      </button>
    </div>
  );
};

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <HomePage />, errorElement: <ErrorPage /> },
      { path: "/create", element: <CreatePage /> },
      { path: "/sign-up", element: <AuthPage {...AuthActions.SignUp} /> },
      { path: "/login", element: <AuthPage {...AuthActions.Login} /> },
      { path: "*", element: <ErrorPage /> },
      { path: "/welcome", element: <div>Welcome</div> },
      { path: "/settings", element: <Settings /> },
    ],
  },
]);

function App() {
  return (
    <NotificationProvider>
      <RouterProvider router={router} />
    </NotificationProvider>
  );
}
export default App;
