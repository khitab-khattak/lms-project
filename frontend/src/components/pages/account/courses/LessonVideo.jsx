import React, { useState } from "react";
import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import { apiUrl, token } from "../../../common/Config";
import toast from "react-hot-toast";

registerPlugin(FilePondPluginFileValidateType);

const LessonVideo = ({ lessons, setLessons }) => {
  const [files, setFiles] = useState([]);

  return (
    <div className="card shadow-lg border-0 mt-3">
      <div className="card-body p-4">
        <h4 className="h5 mb-3">Lesson Video</h4>

        <FilePond
          files={files}
          onupdatefiles={setFiles}
          allowMultiple={false}
          maxFiles={1}
          acceptedFileTypes={["video/mp4"]}
          credits={false}
          name="video"
          server={{
            process: {
              url: `${apiUrl}/lesson/video/${lessons.id}`,
              method: "POST", 
              headers: {
                Authorization: `Bearer ${token}`,
              },
              onload: (res) => {
                const response = JSON.parse(res);
                toast.success(response.message);

                // update lesson state
                setLessons(response.data);
                console.log(response.data)
                setFiles([]);
              },
              onerror: () => {
                toast.error("Video upload failed");
              },
            },
          }}
          labelIdle='Drag & Drop your video or <span class="filepond--label-action">Browse</span>'
        />

        {/* ✅ VIDEO PREVIEW */}
        {lessons.video && (
          <video
            src={`${apiUrl.replace("/api", "")}/uploads/lesson/videos/${lessons.video}`}
            controls
            className="w-100 mt-3 rounded"
          />
        )}
      </div>
    </div>
  );
};

export default LessonVideo;
