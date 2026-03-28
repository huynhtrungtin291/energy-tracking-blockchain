import NavMoveableBtn from "./components/nav-moveable-btn";
import { UserAuthWrapper } from "./context/UserAuth";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-full flex flex-col">
        <UserAuthWrapper>
          {children}
          <NavMoveableBtn />
        </UserAuthWrapper>
      </body>
    </html>
  );
}
