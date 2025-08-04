import { Outlet, Link } from "react-router";
import type { DashboardLayoutRoute } from "@/types/routes-types";
import db from "@/lib/db.server";
import { Container } from "react-bootstrap";

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

type LayoutProps = {
  children: React.ReactNode;
  firstExpense: any | null;
  firstInvoice: any | null;
};

function Layout({
  firstExpense, 
  firstInvoice,
  children
}: LayoutProps) {
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
          <ul style={{ display: "flex", justifyContent: "center", gap: "2rem", padding: "1rem", listStyle: "none", margin: "1rem 0 0 0" }}>
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
        {children}
      </main>
    </>
  );
}

export default function Component({
  loaderData,
}: DashboardLayoutRoute.ComponentProps) {
  const { firstExpense, firstInvoice } = loaderData;

  return (
    <Layout firstExpense={firstExpense} firstInvoice={firstInvoice}>
      <Outlet />
    </Layout>
  );
}

export function ErrorBoundary() {
  return (
    <Layout firstExpense={null} firstInvoice={null}>
      <Container className="py-5">
        <div className="d-flex flex-column gap-4">
          <h1>Unexpected Error</h1>
          <p>We are very sorry. An unexpected error occurred. Please try again or contact us if the problem persists.</p>
        </div>
        <Link to="/" className="btn btn-primary">
          Back to homepage
        </Link>
      </Container>
    </Layout>
  );
}
