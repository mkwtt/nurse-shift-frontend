"use client";

import { useForm } from "react-hook-form";
import axios from "axios";
import { useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Swal from "sweetalert2";

type ShiftFormInputs = {
  date: string;
  start_time: string;
  end_time: string;
};

export default function CreateShiftPage() {
  const { register, handleSubmit, reset } = useForm<ShiftFormInputs>();
  const { user, token } = useAppSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (!user || user.role !== "head_nurse") {
      router.push("/login");
    }
  }, [user, router]);

  const onSubmit = async (data: ShiftFormInputs) => {
    try {
      await axios.post(process.env.NEXT_PUBLIC_API_URL + "/shifts", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      Swal.fire({
        icon: "success",
        title: "Shift Created",
        timer: 2000,
        showConfirmButton: false,
      });
      reset();
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || error.message,
      });
    }
  };

  return (
    <div className="mx-auto mt-10 max-w-md rounded border p-6 shadow">
      <h1 className="mb-4 text-center text-2xl font-bold">สร้างเวร</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col space-y-4"
      >
        <div>
          <label className="block">วันที่:</label>
          <input
            type="date"
            {...register("date")}
            className="w-full rounded border p-2"
            required
          />
        </div>
        <div>
          <label className="block">เวลาเริ่ม:</label>
          <input
            type="time"
            {...register("start_time")}
            className="w-full rounded border p-2"
            required
          />
        </div>
        <div>
          <label className="block">เวลาสิ้นสุด:</label>
          <input
            type="time"
            {...register("end_time")}
            className="w-full rounded border p-2"
            required
          />
        </div>
        <button
          type="submit"
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-500"
        >
          สร้างเวร
        </button>
      </form>
    </div>
  );
}
