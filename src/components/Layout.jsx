import Nav from "./Navbar";
import Footer from "./Footer";
function Layout({ children }) {
  return (
    <div>
      {/* Navbar  */}
      <Nav />

      {/* main Content  */}
      <div className="content min-h-screen">{children}</div>

      {/* Footer  */}
      <Footer />
    </div>
  );
}

export default Layout;
