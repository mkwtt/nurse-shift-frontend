"use client";

import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import Select from "react-select";

type RegisterForm = {
  name: string;
  email: string;
  password: string;
  role: { value: "nurse" | "head_nurse"; label: string };
};

const roleOptions = [
  { value: "nurse", label: "พยาบาล" },
  { value: "head_nurse", label: "หัวหน้าพยาบาล" },
];

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegisterForm>();
  const router = useRouter();

  const onSubmit = async (data: RegisterForm) => {
    try {
      await axios.post(process.env.NEXT_PUBLIC_API_URL + "/auth/register", {
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role.value,
      });

      Swal.fire({
        icon: "success",
        title: "Registration Successful",
        timer: 2000,
        showConfirmButton: false,
      }).then(() => router.push("/login"));
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: err.response?.data?.message || "An error occourred",
      });
    }
  };

  return (
    <div className="flex h-screen items-center justify-center border border-black bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md space-y-4 rounded-lg bg-white p-6 shadow-md"
      >
        <h2 className="text-center text-2xl font-semibold">ลงทะเบียน</h2>

        <div>
          <label className="mb-1 block font-medium">ชื่อ</label>
          <input
            {...register("name", { required: true })}
            className="w-full rounded border px-3 py-2"
            placeholder="ชื่อ"
          />
          {errors.name && (
            <span className="text-sm text-red-500">กรุณากรอกชื่อ</span>
          )}
        </div>

        <div>
          <label className="mb-1 block font-medium">อีเมล</label>
          <input
            type="email"
            {...register("email", { required: true })}
            className="w-full rounded border px-3 py-2"
            placeholder="อีเมล"
          />
          {errors.email && (
            <span className="text-sm text-red-500">กรุณากรอกอีเมล</span>
          )}
        </div>

        <div>
          <label className="mb-1 block font-medium">รหัสผ่าน</label>
          <input
            type="password"
            {...register("password", { required: true })}
            className="w-full rounded border px-3 py-2"
            placeholder="รหัสผ่าน"
          />
          {errors.password && (
            <span className="text-sm text-red-500">กรุณากรอกรหัสผ่าน</span>
          )}
        </div>

        <div>
          <label className="mb-1 block font-medium">บทบาท</label>
          <Controller
            name="role"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Select
                {...field}
                options={roleOptions}
                placeholder="เลือกบทบาท"
                onChange={(selectedOption) => field.onChange(selectedOption)}
                value={roleOptions.find(
                  (option) => option.value === field.value?.value,
                )}
              />
            )}
          />
          {errors.role && (
            <span className="text-sm text-red-500">กรุณาเลือกบทบาท</span>
          )}
        </div>

        <button
          type="submit"
          className="w-full rounded bg-blue-500 py-2 text-white hover:bg-blue-600"
        >
          ลงทะเบียน
        </button>
      </form>
    </div>
  );
}
