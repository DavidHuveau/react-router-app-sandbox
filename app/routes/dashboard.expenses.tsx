import { Outlet, Link, useNavigation, useSearchParams, Form as FormRouter } from "react-router";
import { Button, Form } from "react-bootstrap";
import type { DashboardExpenseLayoutRoute } from "@/types/routes-types";
import db from "@/lib/db.server";

export async function loader({ request }: DashboardExpenseLayoutRoute.LoaderArgs) {
  const url = new URL(request.url);
  const searchString = url.searchParams.get("q") || "";
  const expenses = await db.expense.findMany({
    orderBy: {
      createdAt: "desc",
    },
    where: {
      userId: "886ce72c-361f-4beb-9ccb-80df6b73a32c",
      title: {
        contains: searchString,
      },
    },
  });
  return { expenses };
}

export default function Component({ loaderData }: DashboardExpenseLayoutRoute.ComponentProps) {
  const { expenses } = loaderData;
  const navigation = useNavigation();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q") || "";

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <section style={{ width: "250px", borderRight: "1px solid #ccc", padding: "20px" }}>
        <h2>Your expenses</h2>
        <FormRouter method="GET">
          <Form.Group className="mb-3">
            <Form.Label>Search by title</Form.Label>
            <Form.Control type="search" name="q" placeholder="Monthly Salary" defaultValue={searchQuery} />
          </Form.Group>
        </FormRouter>
        <div style={{ marginBottom: "20px" }}>
          <Link to="/dashboard/expenses">
            <Button variant="primary" size="sm" style={{ width: "100%" }}>
              + Add Expense
            </Button>
          </Link>
        </div>
        <nav>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {expenses.map((expense) => (
              <li key={expense.id} style={{ marginBottom: "5px" }}>
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
