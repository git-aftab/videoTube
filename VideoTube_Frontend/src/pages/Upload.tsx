import React, { useRef } from "react";
import { ImUpload3 } from "react-icons/im";

const Upload = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const openFilePicker = () => {
    inputRef.current?.click();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];

    console.log(file);
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  return (
    <div className="flex flex-1 justify-center items-center">
      <form action="" method="post">
        <div className="">
          <input
            ref={inputRef}
            type="file"
            name="video_upload"
            id=""
            className="hidden "
          />
          <ImUpload3 size={72} />
        </div>
      </form>
    </div>
  );
};

export default Upload;
