import { MdOutlineErrorOutline } from "react-icons/md";
import { RiSignalWifiErrorFill } from "react-icons/ri";

interface Props {
  message?: string;
}

const ErrorState = ({ message = "Something Went Wrong" }: Props) => {
  const network = message === "Network Error";

  return (
    <div className="vt-page flex flex-1 items-center justify-center px-4">
      <div className="vt-card flex max-w-md flex-col items-center gap-4 px-8 py-10 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--error)]/30 bg-[var(--error)]/10 text-[var(--error)]">
        {network ? (
          <RiSignalWifiErrorFill size={32} />
        ) : (
          <MdOutlineErrorOutline size={32} />
        )}
        </div>

        <h2 className="text-lg font-semibold text-[var(--text-primary)]">
          {message}
        </h2>
      </div>
    </div>
  );
};

export default ErrorState;
