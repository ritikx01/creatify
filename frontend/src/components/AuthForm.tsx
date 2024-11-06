import googleLogo from "@/assets/google-icon-logo.svg";
import { FormEvent } from "react";
import { Link } from "react-router-dom";
import { useNotification } from "./NotificationProvider";

export interface Action {
  actionName: string;
  actionPath: string;
  googleOAuthAPI?: string;
}

interface InputFieldValues {
  name: string;
  type: string;
  id: string;
}

function OAuthGoogle({ googleOAuthAPI }: { googleOAuthAPI?: string }) {
  return (
    <a
      href={googleOAuthAPI}
      className={`flex p-3 gap-8 rounded-sm items-center w-full bg-white text-black font-bold justify-center hover:bg-gray-100 [box-shadow:0_-1px_0_rgba(0,0,0,0.04),0_1px_1px_rgba(0,0,0,0.25)] ${!googleOAuthAPI ? "cursor-not-allowed opacity-50" : ""}`}
    >
      <img src={googleLogo} alt="Google Logo" className="h-6 w-6" />
      <button
        disabled={!googleOAuthAPI}
        className={`${!googleOAuthAPI ? "cursor-not-allowed opacity-50" : ""}`}
      >
        Continue with Google
      </button>
    </a>
  );
}

function Separator() {
  return (
    <div className="flex py-8 dark:text-gray-400 font-semibold gap-6 justify-center items-center">
      <span className="bg-gray-600 h-0.5 grow"></span>
      <span>OR</span>
      <span className="bg-gray-600 h-0.5 grow"></span>
    </div>
  );
}

function InputField({ name, id, type }: InputFieldValues) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="opacity-80">
        {name}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        className="mb-2 rounded border-gray-400 border-[1px] bg-transparent p-1 focus:outline focus:border-transparent outline-[#0071e3]"
      />
    </div>
  );
}

function AuthForm({ actionName, actionPath, googleOAuthAPI }: Action) {
  const { showNotification } = useNotification();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch(actionPath, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `email=${formData.get("email")}&password=${formData.get("password")}`,
        // If you're sending JSON instead of FormData:
        // headers: {
        //   'Content-Type': 'application/json'
        // },
        // body: JSON.stringify({
        //   email: formData.get('email'),
        //   password: formData.get('password')
        // })
      });

      const data = await response.json();
      if (response.ok) {
        window.location.href = "/create";
      } else {
        showNotification(data.msg || "Login failed", "error");
      }
    } catch (err) {
      console.log("Form submission error:", err);
      showNotification("An error occurred. Please try again.", "error");
    }
  };
  return (
    <div className="flex flex-col border-gray-600 border-[1px] rounded-md p-4 h-max w-1/3 justify-center">
      <form
        className="flex flex-col font-semibold gap-2"
        action={actionPath}
        method="POST"
        onSubmit={handleSubmit}
      >
        <InputField name="Email" type="text" id="email" />
        <InputField name="Password" type="password" id="password" />
        <button
          type="submit"
          className="dark:bg-primaryDark bg-primaryLight dark:hover:bg-primaryDarkHover hover:bg-primaryLightHover rounded-md px-3 py-1"
        >
          {actionName}
        </button>
      </form>
      <div className="flex justify-end py-2 gap-3">
        {actionName === "Sign Up"
          ? "Already a user?"
          : actionName === "Login"
            ? "New here?"
            : ""}
        <Link
          to={
            actionName === "Sign Up"
              ? "/login"
              : actionName === "Login"
                ? "/sign-up"
                : ""
          }
          className="font-semibold"
        >
          {actionName === "Sign Up"
            ? "Log In →"
            : actionName === "Login"
              ? "Create an account →"
              : ""}
        </Link>
      </div>
      <Separator />
      <OAuthGoogle googleOAuthAPI={googleOAuthAPI} />
    </div>
  );
}

export default AuthForm;
