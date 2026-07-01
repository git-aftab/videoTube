import { MdOutlineErrorOutline } from "react-icons/md";
import { RiSignalWifiErrorFill } from "react-icons/ri";

interface ErrorStateProps {
  message?: string;
}

const ErrorState = ({ message }: ErrorStateProps) => {
  return (
    <div>
      {message === "Network Error" ? (
        <div className="flex gap-2 justify-center items-center text-(--error)">
          <RiSignalWifiErrorFill size={24} />
          <h2 className="text-2xl font-bold ">{message}</h2>
        </div>
      ) : (
        <div className="flex justify-center items-center gap-2 text-(--error) ">
          <MdOutlineErrorOutline />
          <h2 className="text-2xl font-bold">{message}</h2>
        </div>
      )}
    </div>
  );
};

export default ErrorState;
