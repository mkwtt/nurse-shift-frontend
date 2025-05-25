"use-client";

import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { logout } from "@/redux/slices/authSlice";
import Swal from "sweetalert2";

export default function LogoutButton() {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    Swal.fire({
      icon: "question",
      title: "Logout?",
      showConfirmButton: true,
      confirmButtonText: "Yes",
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(logout());
        Cookies.remove("token");
        Cookies.remove("user");
        router.push("/login");
      }
    });
  };

  return (
    <button
      onClick={handleLogout}
      className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-400 hover:underline"
    >
      Logout
    </button>
  );
}
