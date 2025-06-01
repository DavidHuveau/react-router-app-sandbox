import { Outlet, Link, useNavigation } from "react-router";

export default function ExpensesLayout() {
  const navigation = useNavigation();

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <section style={{ width: "250px", borderRight: "1px solid #ccc", padding: "20px" }}>
        <nav>
          <ul>
            <li>
              <Link to="/dashboard/expenses/1">Food</Link>
            </li>
            <li>
              <Link to="/dashboard/expenses/2">Transport</Link>
            </li>
            <li>
              <Link to="/dashboard/expenses/3">Entertainment</Link>
            </li>
          </ul>
        </nav>
      </section>
      <section 
        style={{ flex: 1, padding: "20px" }}
        className={`${navigation.state === "loading" ? "loading-pulse" : ""}`}
      >
        <Outlet />
      </section>
    </div>
  );
}
