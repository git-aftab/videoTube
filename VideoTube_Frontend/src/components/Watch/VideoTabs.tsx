import React from 'react'
import { RiRobot3Fill } from "react-icons/ri";

type Tab = 'description' | 'comment' | 'ai'
interface VideoTabsProps{
  activeTab: Tab | null
  onTabChange: (tab: Tab) =>  void
  isAiAvailable?: boolean
}

const VideoTabs = ({ activeTab, onTabChange, isAiAvailable = true }: VideoTabsProps) => {
  const tabs: { id: Tab; label: string; icon?: React.ReactNode }[] = [
    { id: "description", label: "Description" },
    { id: "comment", label: "Comment" },
    { id: "ai", label: "Ask", icon: <RiRobot3Fill /> },
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-2 text-sm">
      {tabs.map(({ id, label, icon }) => (
        <button
          key={id}
          onClick={() => {
            if (id === "ai" && !isAiAvailable) return;
            onTabChange(id);
          }}
          disabled={id === "ai" && !isAiAvailable}
          className={`flex shrink-0 cursor-pointer items-center gap-2 rounded-xl px-4 py-2.5 font-semibold transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-[var(--bg-elevated)] disabled:hover:text-[var(--text-muted)] ${
            activeTab === id
              ? "bg-[var(--accent)] text-white"
              : "text-[var(--text-muted)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]"
          }`}
          title={
            id === "ai" && !isAiAvailable
              ? "Ask AI is available when the transcript has more than 10 words."
              : undefined
          }
        >
          {label}
          {icon}
        </button>
      ))}
    </div>
  );
};

export default VideoTabs
