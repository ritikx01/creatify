import AuthForm from "@/components/AuthForm";

interface AuthActions {
  actionName: string;
  actionPath: string;
  googleOAuthAPI?: string;
}

function AuthPage({
  actionName,
  actionPath,
  googleOAuthAPI = "/api/auth/google",
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
