import React, { memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteFile,
  updateFilePublicStatus,
} from "../../redux/reducers/fileSlice";
import { toast } from "react-toastify";
import styles from "./index.module.scss";

const FileRow = memo(function FileRow({ file }) {
  const dispatch = useDispatch();
  const { fileOperation } = useSelector((state) => state.files);

  const handleAction = async (e) => {
    const button = e.target.closest("[data-action]");
    if (!button) return;

    const action = button.dataset.action;

    switch (action) {
      case "copy":
        navigator.clipboard.writeText(
          `${window.location.origin}/download/${file.id}`
        );
        toast.success("Link copied!");
        break;

      case "download":
        window.open(`/download/${file.id}`, "_blank");
        break;

      case "delete":
        if (!window.confirm("Are you sure you want to delete this file?"))
          return;
        try {
          await dispatch(deleteFile(file.id)).unwrap();
          toast.success("File deleted");
        } catch (err) {
          toast.error("Failed to delete file");
        }
        break;

      case "toggle":
        try {
          await dispatch(
            updateFilePublicStatus({ id: file.id, isPublic: !file.public })
          ).unwrap();
        } catch (error) {
          toast.error("Failed to update public status");
        }
        break;

      default:
        break;
    }
  };

  return (
    <li className={styles.fileRow} onClick={handleAction}>
      <div className={styles.fileInfo}>
        <span className={styles.fileActualName}>{file.actualName}</span>
        <span className={styles.fileDate}>
          {new Date(file.createdAt).toLocaleString(undefined, {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </span>
      </div>

      <div className={styles.fileActions}>
        <button
          data-action="copy"
          disabled={fileOperation.status === "loading"}
        >
          Copy Link
        </button>
        <button
          data-action="download"
          disabled={fileOperation.status === "loading"}
        >
          Download
        </button>
        <button
          data-action="delete"
          disabled={fileOperation.status === "loading"}
        >
          Delete
        </button>
        <button
          data-action="toggle"
          title="Public Access"
          disabled={fileOperation.status === "loading"}
          className={file.public ? styles.toggleOn : styles.toggleOff}
        >
          Public
        </button>
      </div>
    </li>
  );
});

export default FileRow;
