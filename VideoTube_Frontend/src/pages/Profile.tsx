import { useEffect, useRef, useState } from "react";
import { Eye, EyeOff, Pencil, Trash2, UploadCloud } from "lucide-react";
import { MdEdit } from "react-icons/md";
import { useAuth } from "../contexts/auth.context";
import { useUserVideos } from "../hooks/useUserVideos";
import {
  useChangePassword,
  useUpdateAvatar,
  useUpdateCoverImage,
} from "../hooks/useAuthActions";
import {
  useDeleteVideo,
  useTogglePublishVideo,
  useUpdateVideo,
} from "../hooks/useVideoActions";
import LoadingState from "../components/ui/LoadingState";
import ErrorState from "../components/ui/ErrorState";
import img from "../assets/website_profile_img03.png";
import type { Video } from "../types";

const VideoManagerRow = ({ video }: { video: Video }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(video.title);
  const [description, setDescription] = useState(video.description || "");
  const { mutate: updateVideo, isPending: isUpdating } = useUpdateVideo();
  const { mutate: deleteVideo, isPending: isDeleting } = useDeleteVideo();
  const { mutate: togglePublish, isPending: isPublishing } =
    useTogglePublishVideo();

  const saveVideo = () => {
    if (!title.trim()) return;
    updateVideo(
      { videoId: video._id, title, description },
      { onSuccess: () => setIsEditing(false) },
    );
  };

  return (
    <div className="flex flex-col gap-3 border-b border-[var(--border)] px-3 py-4 md:flex-row">
      <img
        src={video.thumbnail || img}
        alt={video.title}
        className="aspect-video w-full rounded-lg object-cover md:w-52"
      />

      <div className="min-w-0 flex-1">
        {isEditing ? (
          <div className="space-y-2">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full resize-none rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
            />
            <div className="flex gap-2">
              <button
                onClick={saveVideo}
                disabled={isUpdating || !title.trim()}
                className="rounded-lg bg-[var(--accent)] px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setTitle(video.title);
                  setDescription(video.description || "");
                  setIsEditing(false);
                }}
                className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs text-[var(--text-muted)]"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <h2 className="text-lg font-semibold">{video.title}</h2>
            <p className="mt-1 line-clamp-2 text-sm text-[var(--text-muted)]">
              {video.description || "No description"}
            </p>
            <p className="mt-2 text-xs text-[var(--text-muted)]">
              {video.views} views · {video.isPublished ? "Published" : "Private"}
            </p>
          </>
        )}
      </div>

      <div className="flex flex-wrap items-start gap-2 md:justify-end">
        <button
          onClick={() => setIsEditing(true)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] px-3 py-2 text-xs text-[var(--text-muted)] hover:text-[var(--accent)]"
        >
          <Pencil size={14} />
          Edit
        </button>
        <button
          onClick={() => togglePublish(video._id)}
          disabled={isPublishing}
          className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] px-3 py-2 text-xs text-[var(--text-muted)] hover:text-[var(--accent)] disabled:opacity-50"
        >
          {video.isPublished ? <EyeOff size={14} /> : <Eye size={14} />}
          {video.isPublished ? "Unpublish" : "Publish"}
        </button>
        <button
          onClick={() => deleteVideo(video._id)}
          disabled={isDeleting}
          className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] px-3 py-2 text-xs text-[var(--text-muted)] hover:text-[var(--error)] disabled:opacity-50"
        >
          <Trash2 size={14} />
          Delete
        </button>
      </div>
    </div>
  );
};

const Profile = () => {
  const { user, updateUser } = useAuth();
  const coverRef = useRef<HTMLInputElement | null>(null);
  const avatarRef = useRef<HTMLInputElement | null>(null);
  const [bannerImg, setBannerImg] = useState<string | null>(
    user?.coverImage ?? null,
  );
  const [profileImg, setProfileImg] = useState<string | null>(
    user?.avatar ?? null,
  );
  const [sortBy, setSortBy] = useState("latest");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const { data = [], isError, isLoading, error } = useUserVideos(user?._id ?? "");
  const { mutate: updateAvatar, isPending: isAvatarUpdating } = useUpdateAvatar();
  const { mutate: updateCover, isPending: isCoverUpdating } =
    useUpdateCoverImage();
  const { mutate: changePassword, isPending: isChangingPassword } =
    useChangePassword();

  useEffect(() => {
    if (!user) return;
    setBannerImg(user.coverImage ?? null);
    setProfileImg(user.avatar ?? null);
  }, [user]);

  const handleImageUpdate = (file: File | undefined, type: "avatar" | "cover") => {
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setErrorMessage("");

    if (type === "avatar") {
      setProfileImg(preview);
      updateAvatar(file, {
        onSuccess: (updatedUser) => updateUser(updatedUser),
        onError: (err: any) => {
          setProfileImg(user?.avatar ?? null);
          setErrorMessage(err.response?.data?.message || "Avatar update failed.");
        },
      });
      return;
    }

    setBannerImg(preview);
    updateCover(file, {
      onSuccess: (updatedUser) => updateUser(updatedUser),
      onError: (err: any) => {
        setBannerImg(user?.coverImage ?? null);
        setErrorMessage(err.response?.data?.message || "Cover update failed.");
      },
    });
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setErrorMessage("");

    if (newPassword.length < 6) {
      setErrorMessage("New password must be at least 6 characters.");
      return;
    }

    changePassword(
      { oldPassword, newPassword },
      {
        onSuccess: (res) => {
          setMessage(res.message || "Password changed successfully.");
          setOldPassword("");
          setNewPassword("");
        },
        onError: (err: any) =>
          setErrorMessage(
            err.response?.data?.message || "Password change failed.",
          ),
      },
    );
  };

  const sortedVideos = [...data].sort((a, b) =>
    sortBy === "latest"
      ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState message={error.message} />;

  return (
    <div className="flex w-full flex-col">
      <div className="relative h-32 w-full bg-[var(--bg-elevated)] sm:h-44 md:h-56">
        <input
          type="file"
          ref={coverRef}
          accept="image/*"
          onChange={(e) => handleImageUpdate(e.target.files?.[0], "cover")}
          className="hidden"
        />
        {bannerImg && (
          <img
            src={bannerImg}
            alt="Banner"
            className="h-full w-full object-cover"
          />
        )}
        <button
          onClick={() => coverRef.current?.click()}
          disabled={isCoverUpdating}
          className="absolute right-3 top-3 rounded-full bg-[var(--accent-soft)] p-3 text-xl text-white hover:bg-[var(--accent)] disabled:opacity-50"
        >
          <MdEdit />
        </button>
      </div>

      <div className="flex flex-col gap-5 border-b border-[var(--border)] bg-[var(--bg-elevated)]/50 px-4 py-5 md:flex-row md:items-end">
        <div className="relative h-28 w-28 shrink-0">
          <input
            type="file"
            ref={avatarRef}
            accept="image/*"
            onChange={(e) => handleImageUpdate(e.target.files?.[0], "avatar")}
            className="hidden"
          />
          <img
            src={profileImg || ""}
            alt={user?.username || "Profile"}
            className="h-28 w-28 rounded-full border-4 border-[var(--bg-primary)] object-cover"
          />
          <button
            onClick={() => avatarRef.current?.click()}
            disabled={isAvatarUpdating}
            className="absolute bottom-1 right-1 rounded-full bg-[var(--accent)] p-2 text-white disabled:opacity-50"
          >
            <UploadCloud size={16} />
          </button>
        </div>

        <div className="flex-1">
          <h1 className="text-2xl font-bold">{user?.fullName}</h1>
          <p className="text-sm text-[var(--text-muted)]">@{user?.username}</p>
          {message && (
            <p className="mt-3 text-sm text-[var(--success)]">{message}</p>
          )}
          {errorMessage && (
            <p className="mt-3 text-sm text-[var(--error)]">{errorMessage}</p>
          )}
        </div>
      </div>

      <section className="border-b border-[var(--border)] px-4 py-5">
        <h2 className="mb-3 text-lg font-semibold">Account</h2>
        <form
          onSubmit={handlePasswordChange}
          className="grid gap-3 md:grid-cols-[1fr_1fr_auto]"
        >
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            placeholder="Current password"
            className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-3 text-sm outline-none focus:border-[var(--accent)]"
          />
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New password"
            className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-3 text-sm outline-none focus:border-[var(--accent)]"
          />
          <button
            disabled={isChangingPassword || !oldPassword || !newPassword}
            className="rounded-xl bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"
          >
            Change
          </button>
        </form>
      </section>

      <section className="px-4 py-5">
        <div className="mb-3 flex items-center gap-4">
          <h2 className="rounded border border-[var(--accent)]/30 px-3 py-2">
            Videos
          </h2>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2 text-sm"
          >
            <option value="latest" className="bg-[var(--bg-primary)]">
              Latest
            </option>
            <option value="oldest" className="bg-[var(--bg-primary)]">
              Oldest
            </option>
          </select>
        </div>

        <div className="overflow-hidden rounded-2xl border border-[var(--border)]">
          {sortedVideos.length ? (
            sortedVideos.map((video) => (
              <VideoManagerRow key={video._id} video={video} />
            ))
          ) : (
            <p className="px-4 py-10 text-center text-sm text-[var(--text-muted)]">
              No videos uploaded yet.
            </p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Profile;
