import Footer from "./components/footer";
import NavbarWrapper from "./components/navbarWrapper";


export default function PublicLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 to-emerald-100">
      <NavbarWrapper/>
      <main className="flex-1">{children}</main>
      <Footer/>
    </div>
  )
}
