import { useEffect } from "react";
import { useAuth } from "../contexts/auth.context";
import { useParams, Link } from "react-router-dom";
import { useVerifyEmailToken } from "../hooks/useVerifyEmail";

const IsEmailVerifiedConf = () => {
  const { verificationToken } = useParams();
  const {
    mutate: verifyEmailToken,
    isPending,
    error,
  } = useVerifyEmailToken();

  useEffect(() => {
    if (verificationToken) {
      verifyEmailToken();
    }
    verifyEmailToken(verificationToken!);
  }, [verificationToken]);

  const { user, isAuthenticated } = useAuth();

  if (isPending) {
    return (
      <div className="flex flex-1 justify-center items-center sm:text-lg">
        <div className="px-4 py-4 border border-border rounded-xl bg-(--bg-elevated)">
          <p className="text-lg text-(--text-muted)">Verifying email...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 justify-center items-center sm:text-lg">
      {isAuthenticated && user?.isEmailVerified ? (
        <div className="px-4 py-4 border border-border rounded-xl bg-(--bg-elevated)">
          <div className="px-10 py-2.5 rounded-xl border border-accent/30 ">
            {user?.email}
          </div>
          <p className="text-sm text-(--text-muted)">Email is veirifed.</p>
          <Link to={"/"}>
            <button className="text-center cursor-pointer bg-accent w-full py-3 px-3 rounded-xl hover:bg-accent/70 transition-colors duration-200">
              Go To Home
            </button>
          </Link>
        </div>
      ) : (
        <div className="px-4 py-4 border border-border rounded-xl bg-(--bg-elevated)">
          <div className="px-10 py-2.5 rounded-xl border border-accent/30 ">
            {user?.email}
          </div>
          <div className="">
            {error && (
              <p className="text-sm text-(--error)/90 px-3 pb-2">
                {error instanceof Error ? error.message : "An error occurred"}
              </p>
            )}
          </div>
          <p className="text-sm text-(--error)/90 px-3 pb-2">
            Email is not veirifed
          </p>
          <Link to={"/"}>
            <button className="text-center cursor-pointer bg-accent w-full py-3 px-3 rounded-xl hover:bg-accent/70 transition-colors duration-200">
              Go To Home
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default IsEmailVerifiedConf;
