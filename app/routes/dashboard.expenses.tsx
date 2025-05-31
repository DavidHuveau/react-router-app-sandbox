import { Outlet } from "react-router";

export default function ExpensesLayout() {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <aside style={{ width: "250px", borderRight: "1px solid #ccc", padding: "20px" }}>
        <nav>
          <ul style={{ listStyle: "none", padding: 0 }}>
            <li style={{ marginBottom: "10px" }}>
              <a href="/dashboard/expenses/1">Food</a>
            </li>
            <li style={{ marginBottom: "10px" }}>
              <a href="/dashboard/expenses/2">Transport</a>
            </li>
            <li style={{ marginBottom: "10px" }}>
              <a href="/dashboard/expenses/3">Entertainment</a>
            </li>
          </ul>
        </nav>
      </aside>
      <main style={{ flex: 1, padding: "20px" }}>
        <Outlet />
      </main>
    </div>
  );
} 