import React ,{useState} from "react";
import { useAuth } from "../contexts/auth.context";
import { Link, useNavigate, useParams } from "react-router-dom";
import {useVerifyEmail} from "../hooks/useVerifyEmail"

const EmailVerification = () => {
  const { verificationToken } = useParams();
  const { user } = useAuth();

  const [mailSent, setMailSent] = useState(false);

  const {data, isLoading, isError} = useVerifyEmail(verificationToken);
  

  console.log(user);
  return (
    <div className="flex flex-1 justify-center items-center sm:text-lg">
      {user.loginType === "GOOGLE" ? (
        <div className="px-4 py-4 border border-border rounded-xl bg-(--bg-elevated)">
          <div className="px-3 py-2.5 rounded-xl border border-accent/30">
            {user?.email}
          </div>
          <p className="text-sm text-(--text-muted)">
            Email is veirifed using GOOGLE
          </p>
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
            {user?.isEmailVerified ? (
              <div className="">
                <p className="text-sm text-(--text-muted)">
                  Email is veirifed.
                </p>
                <Link to={"/"}>
                  <button className="text-center cursor-pointer bg-accent w-full py-3 px-3 rounded-xl hover:bg-accent/70 transition-colors duration-200">
                    Go To Home
                  </button>
                </Link>
              </div>
            ) : (
              <div className="">
                <p className="text-sm text-(--error)/90 px-3 pb-2">
                  Email is not veirifed
                </p>

                <button className="text-center cursor-pointer bg-accent w-full py-3 px-3 rounded-xl hover:bg-accent/70 transition-colors duration-200">
                  Verify Email
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailVerification;
