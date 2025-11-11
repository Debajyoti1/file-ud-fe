import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "../../redux/reducers/authSlice";
import { ClipLoader } from "react-spinners";
import FullScreenLoader from "../FullScreenLoader";

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
      <FullScreenLoader />
    );
  }

  return children;
}
