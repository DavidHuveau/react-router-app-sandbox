import { Outlet, Link } from "react-router";

export default function DashboardLayout() {
  return (
    <>
      <header>
        <nav>
          <ul style={{ display: "flex", justifyContent: "space-between", padding: "1rem", listStyle: "none", margin: 0 }}>
            <li>
              <Link to="/">BeeRich</Link>
            </li>
            <li>
              <Link to="/404">Log out</Link>
            </li>
          </ul>
          <ul style={{ display: "flex", justifyContent: "center", gap: "2rem", padding: "1rem", listStyle: "none", margin: 0 }}>
            <li>
              <Link to="/dashboard/income">Income</Link>
            </li>
            <li>
              <Link to="/dashboard/expenses">Expenses</Link>
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
