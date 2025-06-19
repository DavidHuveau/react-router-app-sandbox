import { Outlet, Link, useNavigation } from "react-router";
import type { DashboardIncomeLayoutRoute } from "@/types/routes-types";
import db from "@/lib/db.server";

export async function loader() {
  const invoices = await db.invoice.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  return { invoices };
}

export default function IncomeLayout({
  loaderData,
}: DashboardIncomeLayoutRoute.ComponentProps) {
  const { invoices } = loaderData;
  const navigation = useNavigation();

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <section style={{ width: "250px", borderRight: "1px solid #ccc", padding: "20px" }}>
        <nav>
          <ul>
          {invoices.map((invoice) => (
              <li key={invoice.id}>
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
