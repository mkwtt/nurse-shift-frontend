"use client";

import { useAppSelector } from "@/redux/hooks";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";

export default function HeadNurseDashboard() {
  const user = useAppSelector((state) => state.auth.user);
  const router = useRouter();

  useEffect(() => {
    if (!user || user.role !== "head_nurse") {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) return null;

  const navigateToCreateShift = () => {
    router.push("/head-nurse/shifts/create");
  };
  const navigateToAssignShift = () => {
    router.push("/head-nurse/shifts/assign");
  };
  const navigateToLeaveRequest = () => {
    router.push("/head-nurse/leave-requests");
  };

  return (
    <div className="mx-auto mt-10 flex max-w-md flex-col gap-3 rounded border p-6 shadow">
      <h1 className="text-center text-2xl font-bold">
        ยินดีต้อนรับ หัวหน้าพยาบาล
      </h1>
      <h1 className="text-center text-2xl font-bold">{user.name}</h1>
      <p className="mt-2">คุณสามารถ:</p>
      <ul className="ml-6 mt-2 flex list-disc flex-col gap-3">
        <li>
          <button
            onClick={navigateToCreateShift}
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-500 hover:underline"
          >
            สร้างเวร
          </button>
        </li>
        <li>
          <button
            onClick={navigateToAssignShift}
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-500 hover:underline"
          >
            จัดเวรให้พยาบาล
          </button>
        </li>
        <li>
          <button
            onClick={navigateToLeaveRequest}
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-500 hover:underline"
          >
            ดูคำขอลา และอนุมัติ/ปฏิเสธ
          </button>
        </li>
      </ul>
      <LogoutButton />
    </div>
  );
}
