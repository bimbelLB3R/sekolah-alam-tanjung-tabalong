import Footer from "./components/footer";
import NavbarWrapper from "./components/navbarWrapper";


export default function PublicLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <NavbarWrapper/>
      <main className="flex-1">{children}</main>
      <Footer/>
    </div>
  )
}
