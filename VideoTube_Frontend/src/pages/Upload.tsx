import React, { useRef, useState } from "react";
import { ImUpload3 } from "react-icons/im";
import { SiGoogledisplayandvideo360 } from "react-icons/si";
import { useNavigate } from "react-router-dom";
import { useUploadVideo } from "../hooks/useUploadVideo";
import ErrorState from "../components/ui/ErrorState";

const Upload = () => {
  const navigate = useNavigate();
  const { mutate, isPending, isError } = useUploadVideo();

  const [videoFile, setvideoFile] = useState<File | null>(null);
  const [vidoePreviewUrl, setVidoePreviewUrl] = useState<string | null>(null);
  const [thumbnail, setThumbnail] = useState<File|null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)
  const [title, settitle] = useState<string>("");
  const [description, setDescription] = useState("");
  const [Visibility, setVisibility] = useState(true);
  const [Error, setError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const openFilePicker = () => {
    inputRef.current?.click();
  };
  const thumbnailInpRef = useRef<HTMLInputElement>(null)

  const handleDrop = (e: React.DragEvent<HTMLFormElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) {
      console.log("NO File Uploaded");

      return;
    }

    console.log(file);
    setvideoFile(file);
    setVidoePreviewUrl(URL.createObjectURL(file));
  };

  const handleDragOver = (e: React.DragEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const file = e.target.files?.[0];
    if (!file) {
      console.log("No file uploaded");
      return;
    }

    console.log(file);
    setvideoFile(file);
    setVidoePreviewUrl(URL.createObjectURL(file));
  };

  const handleThumbnailChange = (e:React.ChangeEvent<HTMLInputElement>) =>{
    e.preventDefault()
    const file = e.target.files?.[0];
    if(!file){
      return
    }
    setThumbnail(file)
    setThumbnailPreview(URL.createObjectURL(file))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoFile) {
      setError("Please select a Video");
      return;
    }

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    const data = new FormData();
    data.append("title", title);
    if (thumbnail) {
      data.append("thumbnail", thumbnail);
    }
    data.append("description", description);
    data.append("videoFile", videoFile);
    data.append("isPublished", Visibility ? "true" : "false");

    mutate(data, {
      onSuccess: () => navigate("/dashboard"),
      onError: (err: any) => setError(err.response?.data?.message),
    });
  };

  if (isError) {
    return <ErrorState message={Error || undefined} />;
  }

  return (
    <>
      {!videoFile ? (
        <div className="vt-page flex flex-1 items-center justify-center px-4">
          <form
            onClick={openFilePicker}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="w-full max-w-xl"
          >
            <div className="group flex min-h-80 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--border)] bg-[var(--bg-secondary)] p-8 text-center transition-colors duration-200 hover:border-[var(--accent)] hover:bg-[var(--bg-elevated)]">
              <input
                ref={inputRef}
                onChange={handleChange}
                type="file"
                name="video_upload"
                accept="video/*"
                id=""
                className="hidden "
              />
              <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)] transition-colors group-hover:bg-[var(--accent)] group-hover:text-white">
                <ImUpload3 size={42} />
              </div>
              <h1 className="text-xl font-bold text-[var(--text-primary)]">
                Upload a video
              </h1>
              <p className="mt-2 max-w-sm text-sm text-[var(--text-muted)]">
                Drag and drop a video file here, or click to choose one.
              </p>
            </div>
          </form>
        </div>
      ) : (
        <div className="vt-page flex flex-1 justify-center px-4 py-8">
          <form onSubmit={handleSubmit} className="w-full max-w-6xl">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              {vidoePreviewUrl ? (
                <div className="vt-card overflow-hidden p-2">
                  <video
                    src={vidoePreviewUrl}
                    controls
                    className="aspect-video w-full rounded-xl bg-black"
                  />
                </div>
              ) : (
                <div className="vt-card flex aspect-video w-full items-center justify-center">
                  <div className="flex h-full w-full items-center justify-center rounded-xl border border-[var(--border)]">
                    <SiGoogledisplayandvideo360
                      size={64}
                      className="text-[var(--text-muted)]"
                    />
                  </div>
                </div>
              )}
              {/* From */}
              <div className="vt-card flex flex-col gap-5 p-5">
                <div>
                  <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-[var(--text-muted)]">
                    Title
                  </label>
                  <input
                    value={title}
                    onChange={(e) => {
                      settitle(e.target.value);
                    }}
                    type="text"
                    name="title"
                    id="title"
                    placeholder="Enter the title"
                    className="vt-input"
                  />
                </div>
                <input
                  ref={thumbnailInpRef}
                  type="file"
                  accept="image"
                  onChange={handleThumbnailChange}
                  className="hidden"
                />
                <div>
                  <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-[var(--text-muted)]">
                    Thumbnail
                  </label>
                  <div
                    onClick={()=> thumbnailInpRef.current?.click()}
                    className="flex aspect-video w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-dashed border-[var(--border)] bg-[var(--bg-elevated)] transition-colors hover:border-[var(--accent)]"
                  >
                    {thumbnailPreview ? (
                      <img
                        src={thumbnailPreview}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-sm text-[var(--text-muted)]">
                        Select thumbnail
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-[var(--text-muted)]">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={6}
                    placeholder="Enter description"
                    className="vt-input resize-none"
                  />
                </div>

                <div className="flex items-center justify-between gap-3 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-3">
                  <label className="text-sm font-semibold text-[var(--text-primary)]">Visibility</label>

                  <select
                    value={String(Visibility)}
                    onChange={(e) => {
                      setVisibility(e.target.value === "true");
                    }}
                    className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)]"
                  >
                    <option value="false">Private</option>
                    <option value="true">Public</option>
                  </select>
                </div>

                <div className="flex flex-col gap-3 pt-1 transition-colors duration-200 sm:flex-row">
                  <button
                    onClick={() => navigate("/")}
                    className="vt-button-ghost sm:flex-1"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    type="submit"
                    disabled={isPending}
                    className="vt-button-primary sm:flex-1"
                  >
                    {!isPending ? "Upload" : "Uploading"}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default Upload;
