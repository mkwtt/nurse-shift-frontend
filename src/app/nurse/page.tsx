"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import LogoutButton from "@/components/LogoutButton";

interface Shift {
  shift_assignment_id: number;
  date: string;
  start_time: string;
  end_time: string;
  leave_requested: number;
}

interface LeaveRequest {
  leave_request_id: number;
  reason: string;
  status: "pending" | "approved" | "rejected";
  approved_by?: number;
}

export default function NursePage() {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const { token, user } = useAppSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (!user || user.role !== "nurse") {
      router.push("/login");
    } else {
      fetchShifts();
    }
  }, [user]);

  const fetchShifts = async () => {
    try {
      const res = await axios.get(
        process.env.NEXT_PUBLIC_API_URL + "/my-schedule",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
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

  const handleLeaveRequest = async (assignmentId: number) => {
    const { value: reason } = await Swal.fire({
      icon: "info",
      title: "กรุณาระบุเหตุผลการลา",
      input: "text",
      inputLabel: "เหตุผลการลา",
      showCancelButton: true,
    });

    if (!reason)
      return Swal.fire({
        icon: "warning",
        title: "กรุณาระบุเหตุผล",
        showConfirmButton: true,
      });

    try {
      await axios.post(
        process.env.NEXT_PUBLIC_API_URL + "/leaves/leave-requests",
        { shift_assignment_id: assignmentId, reason: reason },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      await Swal.fire({
        icon: "success",
        title: "Leave Request Submitted",
        timer: 2000,
        showConfirmButton: false,
      });
      window.location.reload();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error Submitting Leave Request",
        text: (err as Error).message,
        showConfirmButton: true,
      });
    }
  };

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get(
          process.env.NEXT_PUBLIC_API_URL + "/leaves/my-leave-requests",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setRequests(res.data);
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Error Fetching Requests",
          text: (err as Error).message,
          showConfirmButton: true,
        });
      }
    };

    fetchRequests();
  }, [token]);

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-3 p-6">
      <div className="text-end">
        <LogoutButton />
      </div>
      <h1 className="text-center text-2xl font-bold">ยินดีต้อนรับ พยาบาล</h1>
      <h1 className="text-center text-2xl font-bold">{user?.name}</h1>
      <h1 className="mb-4 text-center text-2xl font-bold">ตารางเวรของฉัน</h1>
      <table className="w-full border border-black">
        <thead>
          <tr className="bg-blue-500">
            <th className="border border-black p-2">วันที่</th>
            <th className="border border-black p-2">เวลา</th>
            <th className="border border-black p-2">ดำเนินการ</th>
          </tr>
        </thead>
        <tbody>
          {shifts.length === 0 ? (
            <tr>
              <td
                colSpan={3}
                className="border border-black p-4 text-center text-gray-500"
              >
                ยังไม่มีเวรที่ได้รับมอบหมาย
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
                <td className="border border-black p-2 text-center">
                  <button
                    onClick={() => handleLeaveRequest(s.shift_assignment_id)}
                    disabled={s.leave_requested === 1}
                    className={`rounded px-3 py-1 text-white ${s.leave_requested === 1 ? "cursor-not-allowed bg-gray-400" : "bg-red-500 hover:bg-red-600"}`}
                  >
                    {s.leave_requested === 1 ? "ลาแล้ว" : "ขอลา"}
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <h1 className="mb-4 text-center text-2xl font-bold">คำขอลาของฉัน</h1>
      <table className="w-full border border-black">
        <thead>
          <tr className="bg-blue-500">
            <th className="border border-black p-2">เวร</th>
            <th className="border border-black p-2">เหตุผล</th>
            <th className="border border-black p-2">สถานะ</th>
            <th className="border border-black p-2">ผู้อนุมัติ</th>
          </tr>
        </thead>
        <tbody>
          {requests.length === 0 ? (
            <tr>
              <td
                colSpan={4}
                className="border border-black p-4 text-center text-gray-500"
              >
                ยังไม่มีเวรที่ลา
              </td>
            </tr>
          ) : (
            requests.map((req: any, index) => (
              <tr key={req.leave_request_id || index}>
                <td className="border border-black p-2 text-center">{`${new Date(req.date).toLocaleDateString("th-TH")} | ${req.start_time.slice(0, 5)} - ${req.end_time.slice(0, 5)}`}</td>
                <td className="border border-black p-2">{req.reason}</td>
                <td
                  className={`border border-black p-2 text-center font-bold ${
                    req.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : req.status === "approved"
                        ? "bg-green-100 text-green-700"
                        : req.status === "rejected"
                          ? "bg-red-100 text-red-700"
                          : ""
                  }`}
                >
                  {req.status}
                </td>
                <td className="border border-black p-2 text-center">
                  {req.approved_by || "-"}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
