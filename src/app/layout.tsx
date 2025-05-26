import "./globals.css";
import StoreProvider from "@/components/StoreProvider";

export const metadata = {
  title: "ระบบจัดเวรพยาบาล",
  description: "ระบบสำหรับจัดตารางเวรพยาบาลและจัดการคำขอลา",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
