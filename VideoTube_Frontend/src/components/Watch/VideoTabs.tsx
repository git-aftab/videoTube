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
    <div className="my-5 px-4 border border-[var(--border)] py-3 rounded-2xl text-sm sm:text-base flex gap-4 justify-start items-center">
      {tabs.map(({ id, label, icon }) => (
        <button
          key={id}
          onClick={() => {
            if (id === "ai" && !isAiAvailable) return;
            onTabChange(id);
          }}
          disabled={id === "ai" && !isAiAvailable}
          className={`px-3 py-2 rounded-xl transition-colors duration-200 cursor-pointer flex items-center gap-2 font-medium disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-[var(--bg-elevated)] disabled:hover:text-[var(--text-muted)] ${
            activeTab === id
              ? "bg-[var(--accent)] text-white"
              : "bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:bg-[var(--accent)] hover:text-white"
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
