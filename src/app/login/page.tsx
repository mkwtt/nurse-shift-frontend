"use client";

import API from "@/lib/api";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/redux/slices/authSlice";
import Swal from "sweetalert2";

export default function LoginPage() {
  const { register, handleSubmit } = useForm();
  const dispatch = useDispatch();
  const router = useRouter();

  const onSubmit = async (data: any) => {
    try {
      const res = await API.post("/auth/login", data);
      const { token, user } = res.data;

      // Set redux + cookies
      Cookies.set("token", token, { expires: 1 });
      Cookies.set("user", JSON.stringify(user), { expires: 1 });
      dispatch(setCredentials({ user: user, token: token }));

      await Swal.fire({
        icon: "success",
        title: "Login Completed",
        timer: 2000,
        showConfirmButton: false,
      });

      if (user.role === "head_nurse") {
        router.push("/head-nurse");
      } else {
        router.push("/nurse");
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto mt-20 max-w-md rounded border border-black bg-white p-6 shadow"
    >
      <h1 className="mb-4 text-center text-2xl font-bold">Login</h1>
      <input
        {...register("email")}
        type="email"
        placeholder="Email"
        className="mb-3 w-full rounded border px-3 py-2"
        required
      />
      <input
        {...register("password")}
        type="password"
        placeholder="Password"
        className="mb-3 w-full rounded border px-3 py-2"
        required
      />
      <button
        type="submit"
        className="w-full rounded bg-blue-600 py-2 text-white hover:bg-blue-300"
      >
        Login
      </button>
    </form>
  );
}
