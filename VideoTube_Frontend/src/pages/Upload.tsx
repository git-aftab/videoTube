import React, { useRef, useState } from "react";
import { ImUpload3 } from "react-icons/im";

const Upload = () => {
  const [videoFile, setvideoFile] = useState<File | null>(null);
  const [vidoePreviewUrl, setVidoePreviewUrl] = useState<string | null>(null);

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

  const handleChange = (e: React.ChangeEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.target.files?.[0]
    if (!file) {
      console.log("No file uploaded");
      return;
    }

    console.log(file);
    setvideoFile(file);
    setVidoePreviewUrl(URL.createObjectURL(file));
  };

  
  return (
    <>
    {!videoFile? (
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
      <h4 className="text-(--text-muted) text-xl ">Drag and Drop or Click to Upload</h4>
    </div>
    ):(
      <div className="flex flex-1 justify-center items-center ">
        <div className="">
          Uplaod preview.
        </div>
      </div>
    )}


    </>
  );
};

export default Upload;
