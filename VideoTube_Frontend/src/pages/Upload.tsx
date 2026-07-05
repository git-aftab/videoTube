import React, { useRef, useState } from "react";
import { ImUpload3 } from "react-icons/im";
import { SiGoogledisplayandvideo360 } from "react-icons/si";
import { Link, useNavigate } from "react-router-dom";
import { useUploadVideo } from "../hooks/useUploadVideo";
import ErrorState from "../components/ui/ErrorState";

const Upload = () => {
  const navigate = useNavigate();
  const { mutate, isPending, isError, error } = useUploadVideo();

  const [videoFile, setvideoFile] = useState<File | null>(null);
  const [vidoePreviewUrl, setVidoePreviewUrl] = useState<string | null>(null);
  const [title, settitle] = useState<string>("");
  const [description, setDescription] = useState("");
  const [Visibility, setVisibility] = useState(true);
  const [Error, setError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const openFilePicker = () => {
    inputRef.current?.click();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
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

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
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
        <div className="flex flex-1 justify-center items-center flex-col gap-3">
          <form
            onClick={openFilePicker}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className=""
          >
            <div className="bg-accent/20  border-2 border-border hover:border-dashed hover:border-accent hover:bg-(--bg-elevated) rounded-full p-15 transition-colors duration-200 hover:text-accent/70">
              <input
                ref={inputRef}
                onChange={handleChange}
                type="file"
                name="video_upload"
                accept="video/*"
                id=""
                className="hidden "
              />
              <ImUpload3 size={72} className="" />
            </div>
          </form>
          <h4 className="text-(--text-muted) text-xl ">
            Drag and Drop or Click to Upload
          </h4>
        </div>
      ) : (
        <div className="flex flex-1 justify-center items-center px-4 py-8 ">
          <form onSubmit={handleSubmit} className="w-full max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              {vidoePreviewUrl ? (
                <div className="w-full">
                  <video
                    src={vidoePreviewUrl}
                    controls
                    className="aspect-video w-full border rounded-xl border-(--accent-soft) "
                  />
                </div>
              ) : (
                <div className="aspect-video w-full rounded-xl border border-(--accent-soft) flex items-center justify-center">
                  <div className="h-full w-full border rounded-xl border-(--accent-soft)">
                    <SiGoogledisplayandvideo360
                      size={64}
                      className="text-(--text-muted)"
                    />
                  </div>
                </div>
              )}
              {/* From */}
              <div className="flex flex-col gap-6">
                <input
                  value={title}
                  onChange={(e) => {
                    settitle(e.target.value);
                  }}
                  type="text"
                  name="title"
                  id="title"
                  placeholder="Enter The Title"
                  className="border-b-2 border-accent pb-2 bg-transparent outline-none"
                />
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={6}
                  placeholder="Enter Description"
                  className="w-full resize-none border-b-2 border-accent bg-transparent pb-2 outline-none"
                />

                <div className="flex items-center gap-3">
                  <label className="font-medium">Visibility</label>

                  <select
                    value={String(Visibility)}
                    onChange={(e) => {
                      setVisibility(e.target.value === "true");
                    }}
                    className="rounded-lg border border-(--border) bg-(--bg-secondary) outline-none"
                  >
                    <option value="false">Private</option>
                    <option value="true">Public</option>
                  </select>
                </div>

                <div className="flex gap-6 transition-colors duration-200">
                  <button
                    onClick={() => navigate("/")}
                    className="bg-accent px-3 py-2.5 rounded-xl cursor-pointer hover:bg-accent/70"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    type="submit"
                    disabled={isPending}
                    className="bg-accent px-3 py-2.5 rounded-xl cursor-pointer hover:bg-accent/70 transition-colors duration-200"
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
