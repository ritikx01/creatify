import { useEffect, useState } from "react";
import { useNotification } from "@/components/NotificationProvider";

interface UserData {
  email: string;
  passwordSet: boolean;
  verified: boolean;
}

interface InputFieldValues {
  name: string;
  type: string;
  id: string;
  value?: string;
  mutable?: boolean;
}

function InputField({
  name,
  id,
  type,
  value,
  mutable = true,
}: InputFieldValues) {
  return (
    <div className="flex gap-6 items-center mb-2">
      <label htmlFor={id} className="opacity-80 font-semibold w-3/12">
        {`${name}:`}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        defaultValue={!mutable ? value : undefined}
        disabled={!mutable}
        className={
          mutable
            ? "rounded border-gray-400 border-[1px] bg-transparent p-1 focus:outline focus:border-transparent outline-[#0071e3] w-full"
            : "rounded bg-transparent p-1 focus:outline focus:border-transparent outline-[#0071e3] opacity-80 w-full"
        }
      />
    </div>
  );
}

function Settings() {
  const backend = import.meta.env.VITE_BACKEND_BASE_URL;
  const { showNotification } = useNotification();
  const [userData, setUserData] = useState<UserData | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${backend}/api/account-info`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const values = await response.json();
      setUserData(values);
    };
    fetchData();
  }, []);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const email = form.email.value;
    const password = form.password.value;
    const repassword = form["re-password"].value;
    if (password !== repassword) {
      showNotification("Both passwords do not match", "error");
      return;
    }
    const formData = {
      email: email,
      password: password,
    };
    const response = await fetch(`${backend}/api/account`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    const data = await response.json();
    if (!response.ok) {
      showNotification(data.msg || "Something went wrong", "error");
      return;
    }
    showNotification(data.msg || "", "success");
  };
  return (
    <div className="grow flex items-center w-screen justify-center">
      <div className="flex flex-col border-gray-600 border-[1px] rounded-md p-4 h-max w-1/3 justify-center">
        <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
          <InputField
            name="Email"
            type="text"
            id="email"
            value={userData?.email}
            mutable={false}
          />
          <InputField
            name={!userData?.passwordSet ? "Set Password" : "Password"}
            type="password"
            id="password"
          />
          {userData?.passwordSet ? (
            <InputField name="Re-Password" type="password" id="re-password" />
          ) : (
            ""
          )}
          <button
            type="submit"
            className="dark:bg-primaryDark bg-primaryLight dark:hover:bg-primaryDarkHover hover:bg-primaryLightHover rounded-md px-3 py-1"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default Settings;
