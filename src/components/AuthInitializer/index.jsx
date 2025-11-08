import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "../../redux/reducers/authSlice";
import { ClipLoader } from "react-spinners";

export default function AuthInitializer({ children }) {
  const dispatch = useDispatch();
  const { status } = useSelector((state) => state.auth);
  const [initialLoading, setInitialLoading] = useState(true);
  useEffect(() => {
    const init = async () => {
      await dispatch(fetchUser());
      setInitialLoading(false);
    };
    init();
  }, [dispatch]);

  if (initialLoading || status === "loading") {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <ClipLoader color="#007bff" size={60} />
      </div>
    );
  }

  return children;
}
