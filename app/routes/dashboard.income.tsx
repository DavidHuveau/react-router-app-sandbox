import { Outlet, Link, useNavigation, useSubmit, Form as FormRouter, useSearchParams } from "react-router";
import type { DashboardIncomeLayoutRoute } from "@/types/routes-types";
import { Button, Form } from "react-bootstrap";
import db from "@/lib/db.server";

export async function loader({ request }: DashboardIncomeLayoutRoute.LoaderArgs) {
  const url = new URL(request.url);
  const searchString = url.searchParams.get("q") || "";
  const invoices = await db.invoice.findMany({
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
  return { invoices };
}

export default function Component({
  loaderData,
}: DashboardIncomeLayoutRoute.ComponentProps) {
  const { invoices } = loaderData;
  const navigation = useNavigation();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q") || "";
  const submit = useSubmit();

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <section style={{ width: "250px", borderRight: "1px solid #ccc", padding: "20px" }}>
        <FormRouter method="GET">
          <Form.Group className="mb-3">
            <Form.Label>Search by title</Form.Label>
            <Form.Control type="search" name="q" placeholder="Monthly Salary" defaultValue={searchQuery} onChange={(e) => submit(e.currentTarget.form)}/>
          </Form.Group>
        </FormRouter>
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
