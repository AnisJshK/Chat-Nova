import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";

const Layout = () => {
  const location = useLocation();

  const hideNavbarRoutes = ["/sign-in","/sign-up"];

  const hideNavbar = location.pathname==='/'|| hideNavbarRoutes.some((route)=>location.pathname.startsWith(route))

  return (
    <div className="flex h-screen w-screen flex-col md:flex-row bg-slate-950 text-slate-100 overflow-hidden">
      {!hideNavbar && <Navbar />}

      <div className="flex-1 h-full overflow-hidden pb-16 md:pb-0">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;