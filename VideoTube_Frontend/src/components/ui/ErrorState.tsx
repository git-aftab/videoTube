import { MdOutlineErrorOutline } from "react-icons/md";
import { RiSignalWifiErrorFill } from "react-icons/ri";

interface Props {
  message?: string;
}

const ErrorState = ({ message = "Something Went Wrong" }: Props) => {
  const network = message === "Network Error";

  return (
    <div className="flex-1 w-full flex items-center justify-center">
      <div className="flex items-center gap-3 text-(--error)">
        {network ? (
          <RiSignalWifiErrorFill size={32} />
        ) : (
          <MdOutlineErrorOutline size={32} />
        )}

        <h2 className="text-2xl font-semibold">{message}</h2>
      </div>
    </div>
  );
};

export default ErrorState;
