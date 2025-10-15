import NavbarLayout from "./NavbarLayout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <NavbarLayout>{children}</NavbarLayout>;
}
