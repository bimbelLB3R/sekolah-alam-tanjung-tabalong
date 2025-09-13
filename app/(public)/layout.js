import NavbarPublic from "./components/navbar";


export default function PublicLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <NavbarPublic/>
      <main className="flex-1">{children}</main>
    </div>
  )
}
