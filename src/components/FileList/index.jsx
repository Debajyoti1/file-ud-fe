import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchFiles } from "../../redux/reducers/fileSlice";
import { toast } from "react-toastify";
import styles from "./index.module.scss";

export default function FileList() {
  const dispatch = useDispatch();
  const { files, status } = useSelector((state) => state.files);
  const [initialLoading, setInitialLoading] = useState(true);
  const [toggleStates, setToggleStates] = useState({}); // track public access locally

  useEffect(() => {
    const fetch = async () => {
      const result = await dispatch(fetchFiles()).unwrap();
      // initialize toggle states from file data
      const initialToggles = {};
      result.forEach((f) => {
        initialToggles[f.id] = f.isPublic || false;
      });
      setToggleStates(initialToggles);
      setInitialLoading(false);
    };
    fetch();
  }, [dispatch]);

  if (status === "loading" || initialLoading) {
    return <p>Loading files...</p>;
  }

  if (!files.length) {
    return <p>No files uploaded yet.</p>;
  }

  const handleAction = async (e) => {
    // Traverse up to the button if click inside it
    const button = e.target.closest("[data-action]");
    if (!button) return;

    const action = button.dataset.action;
    const fileId = button.dataset.id;

    switch (action) {
      case "copy":
        navigator.clipboard.writeText(`${window.location.origin}/download/${fileId}`);
        toast.success("Link copied!");
        break;

      case "download":
        window.open(`/download/${fileId}`, "_blank");
        break;

      case "delete":
        toast.info(`Delete action for file ${fileId} triggered`);
        break;

      case "toggle":
        // Toggle public access
        const newState = !toggleStates[fileId];
        setToggleStates((prev) => ({ ...prev, [fileId]: newState }));
        // Call backend API to update public access
        try {
          await fetch(`/api/files/${fileId}/public`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isPublic: newState }),
          });
          toast.success(`Public access ${newState ? "enabled" : "disabled"}!`);
        } catch (err) {
          toast.error("Failed to update public access");
          // revert toggle
          setToggleStates((prev) => ({ ...prev, [fileId]: !newState }));
        }
        break;

      default:
        break;
    }
  };

  return (
    <div className={styles.fileList}>
      <h3>Your Files</h3>
      <ul onClick={handleAction}>
        {files.map((file) => (
          <li key={file.id} className={styles.fileRow}>
            <div className={styles.fileInfo}>
              <span className={styles.fileActualName}>{file.actualName}</span>
              <span className={styles.fileDate}>
                {new Date(file.createdAt).toLocaleString()}
              </span>
            </div>
            <div className={styles.fileActions}>
              <button data-action="copy" data-id={file.id}>
                Copy Link
              </button>
              <button data-action="download" data-id={file.id}>
                Download
              </button>
              <button data-action="delete" data-id={file.id}>
                Delete
              </button>
              <button
                data-action="toggle"
                data-id={file.id}
                className={toggleStates[file.id] ? styles.toggleOn : styles.toggleOff}
              >
                {toggleStates[file.id] ? "Public Enabled" : "Public Disabled"}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
