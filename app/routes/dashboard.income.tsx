import { Outlet, Link, useNavigation } from "react-router";
import type { DashboardIncomeLayoutRoute } from "@/types/routes-types";
import { Button } from "react-bootstrap";
import db from "@/lib/db.server";

export async function loader() {
  const invoices = await db.invoice.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  return { invoices };
}

export default function Component({
  loaderData,
}: DashboardIncomeLayoutRoute.ComponentProps) {
  const { invoices } = loaderData;
  const navigation = useNavigation();

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <section style={{ width: "250px", borderRight: "1px solid #ccc", padding: "20px" }}>
        <div style={{ marginBottom: "20px" }}>
          <Link to="/dashboard/income">
            <Button variant="primary" size="sm" style={{ width: "100%" }}>
              + Add Income
            </Button>
          </Link>
        </div>
        <nav>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {invoices.map((invoice) => (
              <li key={invoice.id} style={{ marginBottom: "5px" }}>
                <Link to={`/dashboard/income/${invoice.id}`}>{invoice.title}</Link>
              </li>
            ))}
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
