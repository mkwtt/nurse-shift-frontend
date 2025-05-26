"use client";

import { useForm } from "react-hook-form";
import axios from "axios";
import { useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

type ShiftFormInputs = {
  date: string;
  start_time: string;
  end_time: string;
};

interface Shift {
  shift_assignment_id: number;
  date: string;
  start_time: string;
  end_time: string;
  leave_requested: number;
}

export default function CreateShiftPage() {
  const { register, handleSubmit, reset } = useForm<ShiftFormInputs>();
  const { user, token } = useAppSelector((state) => state.auth);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (!user || user.role !== "head_nurse") {
      router.push("/login");
    } else {
      fetchShifts();
    }
  }, [user, router]);

  const onSubmit = async (data: ShiftFormInputs) => {
    try {
      await axios.post(process.env.NEXT_PUBLIC_API_URL + "/shifts", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await Swal.fire({
        icon: "success",
        title: "Shift Created",
        timer: 2000,
        showConfirmButton: false,
      });
      reset();
      window.location.reload();
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || error.message,
      });
    }
  };

  const fetchShifts = async () => {
    try {
      const res = await axios.get(process.env.NEXT_PUBLIC_API_URL + "/shifts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShifts(res.data);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error Fetching Shifts",
        text: (err as Error).message,
        showConfirmButton: true,
      });
    }
  };

  return (
    <>
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
      <div className="mx-auto flex max-w-3xl flex-col gap-3 p-6">
        <h1 className="mb-4 text-center text-2xl font-bold">ตารางเวร</h1>
        <table className="w-full border border-black">
          <thead>
            <tr className="bg-blue-500">
              <th className="border border-black p-2">วันที่</th>
              <th className="border border-black p-2">เวลา</th>
            </tr>
          </thead>
          <tbody>
            {shifts.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="border border-black p-4 text-center text-gray-500"
                >
                  ยังไม่มีเวรที่สร้าง
                </td>
              </tr>
            ) : (
              shifts.map((s, index) => (
                <tr key={s.shift_assignment_id || index}>
                  <td className="border border-black p-2 text-center">
                    {new Date(s.date).toLocaleDateString("th-TH")}
                  </td>
                  <td className="border border-black p-2 text-center">
                    {s.start_time.slice(0, 5)} - {s.end_time.slice(0, 5)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
