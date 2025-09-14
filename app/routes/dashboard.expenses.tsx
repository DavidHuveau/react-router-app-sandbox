import { Prisma } from "@prisma/client";
import { Outlet, Link, useNavigation, useSearchParams, Form as FormRouter } from "react-router";
import { Button, Form } from "react-bootstrap";
import type { DashboardExpenseLayoutRoute } from "@/types/routes-types";
import db from "@/lib/db.server";
import { requireUserId } from "@/lib/session/session.server";

const PAGE_SIZE = 10;

export async function loader({ request }: DashboardExpenseLayoutRoute.LoaderArgs) {
  const userId = await requireUserId(request);
  const url = new URL(request.url);
  const searchString = url.searchParams.get("q") || "";
  const pageNumber = Number(url.searchParams.get("page")) || 1;
  const where: Prisma.ExpenseWhereInput = {
    userId,
    title: {
      contains: searchString ? searchString : '',
    },
  };
  const [count, expenses] = await db.$transaction([
    db.expense.count({ where }),
    db.expense.findMany({
      orderBy: {
        createdAt: "desc",
      },
      skip: (pageNumber - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      where
    })
  ]);
  return { count, expenses };
}

export default function Component({ loaderData }: DashboardExpenseLayoutRoute.ComponentProps) {
  const { count, expenses } = loaderData;
  const navigation = useNavigation();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q") || "";
  const pageNumber = Number(searchParams.get("page")) || 1;

  const isOnFirstPage = pageNumber === 1;
  const showPagination = count > PAGE_SIZE || !isOnFirstPage;
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <section style={{ width: "250px", borderRight: "1px solid #ccc", padding: "20px" }}>
        <h2>Your expenses</h2>
        <FormRouter method="GET">
          <Form.Group className="mb-3">
            <Form.Label>Search by title</Form.Label>
            <Form.Control type="hidden" name="page" value={1} />
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
          {showPagination && (
            <FormRouter method="GET" action={location.pathname} className="d-flex justify-content-between pb-5">
              <input type="hidden" name="q" value={searchQuery} />
              <Button type="submit" name="page" value={pageNumber - 1} disabled={pageNumber === 1}>
                Previous
              </Button>
              <Button type="submit" name="page" value={pageNumber + 1} disabled={count <= pageNumber * PAGE_SIZE}>
                Next
              </Button>
            </FormRouter>
          )}
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
