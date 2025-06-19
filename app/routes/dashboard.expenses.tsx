import { Outlet, Link, useNavigation } from "react-router";
import type { DashboardExpenseLayoutRoute } from "@/types/routes-types";
import db from "@/lib/db.server";

export async function loader() {
  const expenses = await db.expense.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  return { expenses };
}

export default function ExpensesLayout({
  loaderData,
}: DashboardExpenseLayoutRoute.ComponentProps) {
  const { expenses } = loaderData;
  const navigation = useNavigation();

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <section style={{ width: "250px", borderRight: "1px solid #ccc", padding: "20px" }}>
        <nav>
          <ul>
            {expenses.map((expense) => (
              <li key={expense.id}>
                <Link to={`/dashboard/expenses/${expense.id}`}>
                  <div style={{ fontSize: "1rem", fontWeight: "bold" }}>{expense.title}</div>
                  <div style={{ fontSize: "0.7rem" }}>
                    <b>
                      {expense.amount} {expense.currencyCode}
                    </b>
                  </div>
                </Link>
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
