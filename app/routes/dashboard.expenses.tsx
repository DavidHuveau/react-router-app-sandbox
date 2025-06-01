import { Outlet, Link } from "react-router";

export default function ExpensesLayout() {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <section style={{ width: "250px", borderRight: "1px solid #ccc", padding: "20px" }}>
        <nav style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <Link to="/dashboard/expenses/1">Food</Link>
          <Link to="/dashboard/expenses/2">Transport</Link>
          <Link to="/dashboard/expenses/3">Entertainment</Link>
        </nav>
      </section>
      <section style={{ flex: 1, padding: "20px" }}>
        <Outlet />
      </section>
    </div>
  );
}
