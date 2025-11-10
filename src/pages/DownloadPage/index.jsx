import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import styles from "./index.module.scss";
import { fetchFileInfo } from "../../redux/reducers/fileSlice";
import { ClipLoader } from "react-spinners";
import { formatFileSize } from "../../util/fileSize";

export default function DownloadPage() {
  const dispatch = useDispatch();
  const { id } = useParams();

  const fileOperation = useSelector((state) => state.files.fileOperation);

  useEffect(() => {
    if (id) {
      dispatch(fetchFileInfo(id));
    }
  }, [dispatch, id]);


  const handleDownload = () => {
    const fileUrl = `${window.location.origin}/download/${id}`;
    if (fileUrl) window.open(fileUrl, "_blank");
  };

  return (
    <div className={styles.downloadPage}>
      <h2>Download File</h2>

      <div className={styles.fileInfo}>
        {fileOperation.status === "loading" && (
          <div className={styles.loader}>
            <ClipLoader color="#007bff" size={60} />
          </div>
        )}

        {fileOperation.error && (
          <p className={styles.error}>
            Error: {fileOperation.error.message || "Failed to load file info"}
          </p>
        )}

        {fileOperation.status === "idle" && fileOperation.file && (
          <div className={styles.fileCard}>
            <div className={styles.details}>
              <h3 className={styles.fileName}>
                File Name : {fileOperation.file.actualName || "Untitled File"}
              </h3>
              <p className={styles.fileMeta}>
                <span>
                  Uploaded By : {fileOperation.file.user.name || "Unknown User"}
                </span>
              </p>
              <p className={styles.fileMeta}>
                <span>
                  Upload Date :{" "}
                  {fileOperation.file.createdAt
                    ? new Date(fileOperation.file.createdAt).toLocaleString(
                        undefined,
                        {
                          dateStyle: "medium",
                          timeStyle: "short",
                        }
                      )
                    : "Unknown Date"}
                </span>
              </p>

              <p className={styles.fileMeta}>
                <span>
                  Size :{" "}
                  {fileOperation.file.size
                    ? formatFileSize(fileOperation.file.size)
                    : "Unknown Size"}
                </span>
              </p>
            </div>
            <a href={`${import.meta.env.VITE_API_URL}/files/${fileOperation.file.id}/download`}>
            <button className={styles.downloadBtn}>
              Download
            </button>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
