"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import Select from "react-select";

type User = {
  user_id: number;
  name: string;
};

type Shift = {
  shift_id: number;
  date: string;
  start_time: string;
  end_time: string;
};

export default function AssignShiftPage() {
  const { token, user } = useAppSelector((state) => state.auth);
  const [nurses, setNurses] = useState<User[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!user || user.role !== "head_nurse") {
      router.push("/login");
    }
  }, [user, router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [nurseRes, shiftRes] = await Promise.all([
          axios.get(process.env.NEXT_PUBLIC_API_URL + "/users/nurses", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(process.env.NEXT_PUBLIC_API_URL + "/shifts", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setNurses(nurseRes.data);
        setShifts(shiftRes.data);
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Error Fetching Data",
          text: (err as Error).message,
          showConfirmButton: true,
        });
      }
    };

    fetchData();
  }, [token]);

  const handleAssign = async () => {
    try {
      if (!selectedUser || !selectedShift) return;

      await axios.post(
        process.env.NEXT_PUBLIC_API_URL + "/shifts-assignments",
        {
          user_id: selectedUser.user_id,
          shift_id: selectedShift.shift_id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      Swal.fire({
        icon: "success",
        title: "Shift Assigned",
        timer: 2000,
        showConfirmButton: false,
      });
      setSelectedUser(null);
      setSelectedShift(null);
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Error Assigning Shift",
        text: err.response?.data?.error || err.message,
        showConfirmButton: true,
      });
    }
  };

  return (
    <div className="mx-auto mt-10 flex max-w-md flex-col rounded border p-6 shadow">
      <h1 className="mb-4 text-center text-2xl font-bold">จัดเวรให้พยาบาล</h1>

      <div className="mb-4">
        <label className="block">เลือกพยาบาล:</label>
        <Select
          options={nurses.map((n) => ({
            value: n,
            label: n.name,
          }))}
          value={
            selectedUser
              ? { value: selectedUser, label: selectedUser.name }
              : null
          }
          onChange={(option) => setSelectedUser(option?.value || null)}
          placeholder="เลือกพยาบาล"
        />
      </div>

      <div className="mb-4">
        <label className="block">เลือกเวร:</label>
        <Select
          options={shifts.map((s) => ({
            value: s,
            label: `${new Date(s.date).toLocaleDateString("th-TH")} | ${s.start_time.slice(0, 5)} - ${s.end_time.slice(0, 5)}`,
          }))}
          value={
            selectedShift
              ? {
                  value: selectedShift,
                  label: `${new Date(selectedShift.date).toLocaleDateString("th-TH")} | ${selectedShift.start_time.slice(0, 5)} - ${selectedShift.end_time.slice(0, 5)}`,
                }
              : null
          }
          onChange={(option) => setSelectedShift(option?.value || null)}
          placeholder="เลือกเวร"
        />
      </div>

      <button
        className="mt-2 rounded bg-blue-600 px-4 py-2 text-white hover:cursor-pointer hover:bg-blue-400"
        onClick={handleAssign}
        disabled={!selectedUser || !selectedShift}
      >
        จัดเวร
      </button>
    </div>
  );
}
