import { Outlet, Link, useNavigation } from "react-router";

export default function IncomeLayout() {
  const navigation = useNavigation();

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <section style={{ width: "250px", borderRight: "1px solid #ccc", padding: "20px" }}>
        <nav>
          <ul>
            <li>
              <Link to="/dashboard/income/1">Salary October</Link>
            </li>
            <li>
              <Link to="/dashboard/income/2">Salary September</Link>
            </li>
            <li>
              <Link to="/dashboard/income/3">Salary August</Link>
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
