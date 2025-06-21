import { Outlet, Link } from "react-router";
import type { DashboardLayoutRoute } from "@/types/routes-types";
import db from "@/lib/db.server";

export async function loader() {
  const expenseQuery = db.expense.findFirst({
    orderBy: { 
      createdAt: "desc",
    },
  });
  const invoiceQuery = db.invoice.findFirst({
    orderBy: {
      createdAt: "desc",
    },
  });

  const [firstExpense, firstInvoice] = await Promise.all([expenseQuery, invoiceQuery]);
  return { firstExpense, firstInvoice };
}

export default function DashboardLayout({
  loaderData,
}: DashboardLayoutRoute.ComponentProps) {
  const { firstExpense, firstInvoice } = loaderData;

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
              <Link to={firstInvoice ? `/dashboard/income/${firstInvoice.id}` : "/dashboard/income"}>Income</Link>
            </li>
            <li>
              <Link to={firstExpense ? `/dashboard/expenses/${firstExpense.id}` : "/dashboard/expenses"}>Expenses</Link>
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
