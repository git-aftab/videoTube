import { Activity, RefreshCw } from "lucide-react";
import ErrorState from "../components/ui/ErrorState";
import LoadingState from "../components/ui/LoadingState";
import { useHealthCheck } from "../hooks/useSocialActions";

const Health = () => {
  const { data, isLoading, isError, error, refetch, isFetching } =
    useHealthCheck();

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState message={error.message} />;

  return (
    <div className="vt-page">
      <div className="mx-auto w-full max-w-2xl px-4 py-8">
      <div className="vt-card p-6">
        <div className="flex items-center justify-between gap-4">
          <h1 className="flex items-center gap-3 text-2xl font-bold text-[var(--text-primary)]">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--success)]/10 text-[var(--success)]">
              <Activity size={20} />
            </span>
            Health
          </h1>
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="vt-button-ghost"
          >
            <RefreshCw size={15} />
            Refresh
          </button>
        </div>

        <pre className="mt-6 overflow-auto rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-4 font-mono text-sm text-[var(--text-primary)]">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
      </div>
    </div>
  );
};

export default Health;
