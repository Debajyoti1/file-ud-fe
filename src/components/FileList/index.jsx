import React, { useEffect, useState, useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchFiles } from "../../redux/reducers/fileSlice";
import { toast } from "react-toastify";
import styles from "./index.module.scss";
import { ClipLoader } from "react-spinners";
import FileRow from "../FileRow";

export default function FileList() {
  const dispatch = useDispatch();
  const { files, status, hasMore } = useSelector((state) => state.files);

  const [page, setPage] = useState(1);
  const [initialLoading, setInitialLoading] = useState(true);
  const observer = useRef();

  useEffect(() => {
    const fetch = async () => {
      try {
        await dispatch(fetchFiles({ page, limit: 5 })).unwrap();
      } catch {
        toast.error("Failed to fetch files");
      } finally {
        setInitialLoading(false);
      }
    };
    fetch();
  }, [dispatch, page]);

  const loaderRef = useCallback(
    (node) => {
      if (status === "loading") return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [hasMore, status]
  );

  if (initialLoading) {
    return (
      <div className={styles.loader}>
        <ClipLoader color="#007bff" size={60} />
      </div>
    );
  }

  if (!files.length) {
    return <p className={styles.noFiles}>No files uploaded yet.</p>;
  }

  return (
    <div className={styles.fileList}>
      <h3>Your Files</h3>
      <ul>
        {files.map((file) => (
          <FileRow key={file.id} file={file} />
        ))}
      </ul>

      <div ref={loaderRef} className={styles.loaderBottom}>
        {status === "loading" && <ClipLoader color="#007bff" size={35} />}
        {!hasMore && <p className={styles.endText}>No more files</p>}
      </div>
    </div>
  );
}
