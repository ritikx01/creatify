import AuthForm from "@/components/AuthForm";

interface AuthActions {
  actionName: string;
  actionPath: string;
  googleOAuthAPI?: string;
}

const backend = import.meta.env.VITE_BACKEND_BASE_URL;

function AuthPage({
  actionName,
  actionPath,
  googleOAuthAPI = `${backend}/api/auth/google`,
}: AuthActions) {
  return (
    <div className="grow flex items-center w-screen justify-center">
      <AuthForm
        actionName={actionName}
        actionPath={actionPath}
        googleOAuthAPI={googleOAuthAPI}
      />
    </div>
  );
}

export default AuthPage;
