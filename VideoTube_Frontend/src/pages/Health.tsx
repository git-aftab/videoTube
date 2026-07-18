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
    <div className="w-full max-w-2xl mx-auto px-4 py-8">
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6">
        <div className="flex items-center justify-between gap-4">
          <h1 className="flex items-center gap-2 text-2xl font-bold">
            <Activity size={22} className="text-[var(--success)]" />
            Health
          </h1>
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] px-3 py-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] disabled:opacity-50"
          >
            <RefreshCw size={15} />
            Refresh
          </button>
        </div>

        <pre className="mt-6 overflow-auto rounded-xl bg-[var(--bg-elevated)] p-4 text-sm text-[var(--text-primary)]">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default Health;
