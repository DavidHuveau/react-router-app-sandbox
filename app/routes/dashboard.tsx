import { Outlet, Link } from "react-router";

export default function DashboardLayout() {
  return (
    <>
      <header>
        <nav>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem' }}>
            <Link to="/">BeeRich</Link>
            <Link to="/404">Log out</Link>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', padding: '1rem' }}>
            <Link to="/dashboard/income">Income</Link>
            <Link to="/dashboard/expenses">Expenses</Link>
          </div>
        </nav>
      </header>

      <main style={{ padding: '1rem' }}>
        <Outlet />
      </main>
    </>
  );
}
