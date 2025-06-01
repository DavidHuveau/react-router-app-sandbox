import { Outlet, Link } from "react-router";

export default function AuthLayout() {
  return (
    <>
      <header>
        <nav style={{ padding: "1rem" }}>
          <ul style={{ display: "flex", listStyle: "none", margin: 0, padding: 0 }}>
            <li>
              <Link to="/">BeeRich</Link>
            </li>
            <li style={{ marginLeft: "auto", marginRight: "1rem" }}>
              <Link to="/login">Log in</Link>
            </li>
            <li>
              <Link to="/signup">Sign up</Link>
            </li>
          </ul>
        </nav>
      </header>
      <main style={{ padding: "1rem" }}>
        <Outlet />
      </main>
    </>
  );
}
