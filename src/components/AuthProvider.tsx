"use client";

import { useEffect, useState } from "react";
import { useDispatch, UseDispatch } from "react-redux";
import { setCredentials } from "@/redux/slices/authSlice";
import Cookies from "js-cookie";
import Swal from "sweetalert2";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const token = Cookies.get("token");
    const user = Cookies.get("user");

    if (token && user) {
      try {
        const parseUser = JSON.parse(user);
        dispatch(setCredentials({ token, user: parseUser }));
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to parse user cookie: " + error,
          showConfirmButton: true,
        });
      }
    }

    setLoaded(true);
  }, [dispatch]);

  if (!loaded) return null;

  return <>{children}</>;
}
