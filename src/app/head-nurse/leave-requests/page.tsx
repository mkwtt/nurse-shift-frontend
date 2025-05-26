"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function LeaveRequestsPage() {
  interface LeaveRequest {
    leave_request_id: number;
    reason: string;
    status: "pending" | "approved" | "rejected";
    approved_by?: number;
  }

  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const { user, token } = useAppSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (!user || user.role !== "head_nurse") {
      router.push("/login");
    }
  }, [user, token]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get(
          process.env.NEXT_PUBLIC_API_URL + "/leaves/leave-requests",
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

  const handleUpdate = async (id: number, status: "approved" | "rejected") => {
    try {
      const res = await axios.patch(
        process.env.NEXT_PUBLIC_API_URL +
          `/leaves/leave-requests/${id}/approve`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      await Swal.fire({
        icon: "success",
        title: "Request Updated",
        timer: 2000,
        showConfirmButton: false,
      });
      window.location.reload();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error Updating Request",
        text: (err as Error).message,
        showConfirmButton: true,
      });
    }
  };

  return (
    <div className="mx-auto max-w-3xl p-4">
      <h1 className="mb-4 text-center text-2xl font-bold">คำขอลา</h1>
      <table className="w-full border border-black">
        <thead>
          <tr className="bg-blue-500">
            <th className="border border-black p-2">ชื่อ</th>
            <th className="border border-black p-2">เวร</th>
            <th className="border border-black p-2">เหตุผล</th>
            <th className="border border-black p-2">สถานะ</th>
            <th className="border border-black p-2">ผู้อนุมัติ</th>
            <th className="border border-black p-2">จัดการ</th>
          </tr>
        </thead>
        <tbody>
          {requests.length === 0 ? (
            <tr>
              <td
                colSpan={6}
                className="border border-black p-4 text-center text-gray-500"
              >
                ยังไม่มีผู้ขอลา
              </td>
            </tr>
          ) : (
            requests.map((req: any, index) => (
              <tr key={req.leave_request_id || index}>
                <td className="border border-black p-2 text-center">
                  {req.requester_name}
                </td>
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
                <td className="space-x-2 border border-black p-2 text-center">
                  {req.status === "pending" && (
                    <>
                      <button
                        onClick={() =>
                          handleUpdate(req.leave_request_id, "approved")
                        }
                        className="rounded bg-green-500 px-2 py-1 text-white hover:bg-green-400"
                      >
                        อนุมัติ
                      </button>
                      <button
                        onClick={() =>
                          handleUpdate(req.leave_request_id, "rejected")
                        }
                        className="rounded bg-red-500 px-2 py-1 text-white hover:bg-red-400"
                      >
                        ปฏิเสธ
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
