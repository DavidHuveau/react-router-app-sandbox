import { Button, Form, Alert, Spinner, Container, Row, Col } from "react-bootstrap";
import { 
  Form as FormRouter,
  redirect,
  useNavigation,
  useParams,
  isRouteErrorResponse,
  Await,
} from "react-router";
import type { DashboardExpenseRoute } from "@/types/routes-types";
import db from "@/lib/db.server";
import { requireUserId } from "@/lib/session/session.server";
import { Suspense, useEffect } from "react";
import { deleteExpense, parseExpense, updateExpense } from "@/lib/expenses.server";
import type { ExpenseLog } from "@prisma/client";

async function handleUpdate(id: string, formData: FormData, userId: string) {
  const expenseData = parseExpense(formData);
  return await updateExpense({ id, userId, ...expenseData });
}

async function handleDelete(id: string, userId: string) {
    try {
      await deleteExpense(id, userId);
  } catch (err) {
    throw new Response('Not found', { status: 404 });
  }
}

export async function action({ request, params }: DashboardExpenseRoute.ActionArgs) {
  const userId = await requireUserId(request);
  const { id } = params;
  if (!id) throw Error("id parameter must be defined");

  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "delete") {
    await handleDelete(id, userId);
    return redirect("/dashboard/expenses");
  } else if (intent === "update") {
    await handleUpdate(id, formData, userId);
    return { success: true };
  }
}

export async function loader({ request, params }: DashboardExpenseRoute.LoaderArgs) {
  const userId = await requireUserId(request);
  const { id } = params;
  if (!id) throw Error("id route parameter must be defined");

  // Start expense logs query first before we await the expense query
  const logs = db.expenseLog.findMany({
    where: { expenseId: id, userId },
    orderBy: { createdAt: "desc" },
  }).then((expenseLogs) => expenseLogs);
  const expense = await db.expense.findUnique({
    where: { id, userId },
  });
  if (!expense) throw new Response("Not found", { status: 404 });

  return { expense, logs };
}

export default function Component({ loaderData, actionData }: DashboardExpenseRoute.ComponentProps) {
  const { expense, logs } = loaderData;
  const { id, title, description, amount } = expense;
  const navigation = useNavigation();
  const isSubmitting = navigation.state !== "idle" && navigation.formAction === `/dashboard/expenses/${id}`;
  const submittingIntent = navigation.formData?.get("intent");
  const isUpdating = isSubmitting && submittingIntent === "update";
  const isDeleting = isSubmitting && submittingIntent === "delete";

  useEffect(() => {
    document.title = `${title} - BeeRich`;
    document.querySelector('meta[name="description"]')?.setAttribute('content', `Expense: ${description || "No description"}`);
  }, [title, description]);

  return (
    <>
      {actionData?.success && (
        <Alert variant="success" aria-live="polite" className="mb-3">
          Changes saved!
        </Alert>
      )}
      <FormRouter method="POST" action={`/dashboard/expenses/${id}`} key={id}>
        <Form.Group className="mb-3">
          <Form.Label>Title:</Form.Label>
          <Form.Control type="text" name="title" placeholder="Dinner for Two" required defaultValue={title}/>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Description:</Form.Label>
          <Form.Control as="textarea" name="description" defaultValue={description ?? ""} />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Amount (in USD):</Form.Label>
          <Form.Control type="number" name="amount" defaultValue={amount}/>
        </Form.Group>
        <Button type="submit" variant="primary" disabled={isUpdating} name="intent" value="update">
          {isUpdating ? (
            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" >
              <span className="visually-hidden">Updating...</span>
            </Spinner>
           ) : "Update"}
        </Button>
        <Button type="submit" variant="danger" name="intent" value="delete" disabled={isDeleting} className="ms-2"
          onClick={e => {
            if (!window.confirm("Do you really want to delete this expense?")) {
              e.preventDefault();
            }
          }}
        >
          {isDeleting ? (
            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" >
              <span className="visually-hidden">Deleting...</span>
            </Spinner>
           ) : "Delete"}
        </Button>
      </FormRouter>
      <section className="my-5">
        <div className="d-flex flex-column align-items-center justify-content-center">
          <h3>Expense History</h3>
          <Suspense fallback="Loading expense history..." key={id}>
            <Await resolve={logs} errorElement="There was an error loading the expense history. Please try again.">
              {(resolvedExpenseLogs) => <ExpenseLogs expenseLogs={resolvedExpenseLogs} />}
            </Await>
          </Suspense>
        </div>
      </section>
    </>
  );
}

function ExpenseLogs({ expenseLogs }: { expenseLogs: ExpenseLog[] }) {
  return (
    <div className="mt-4">
      <h4>Updates History</h4>
      <div className="overflow-auto">
        {expenseLogs.length === 0 ? (
          <p className="text-muted">No history available</p>
        ) : (
          <div className="list-group">
            {expenseLogs.map((expenseLog) => (
              <div key={expenseLog.id} className="list-group-item">
                <div className="d-flex justify-content-between align-items-start">
                  <div className="flex-grow-1">
                    <h6 className="mb-1 fw-bold">
                      {expenseLog.title} - {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: expenseLog.currencyCode,
                      }).format(expenseLog.amount)}
                    </h6>
                    {expenseLog.description && (
                      <p className="mb-1 fst-italic text-muted">
                        {expenseLog.description}
                      </p>
                    )}
                    <small className="text-muted">
                      {new Date(expenseLog.createdAt).toLocaleDateString("en-US")} at{" "}
                      {new Date(expenseLog.createdAt).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function ErrorBoundary({ error }: DashboardExpenseRoute.ErrorBoundaryProps) {
  const { id } = useParams();
  let heading = "Something went wrong";
  let message = "Apologies, something went wrong on our end, please try again.";
  if (isRouteErrorResponse(error) && error.status === 404) {
    heading = "Expense not found";
    message = `Apologies, the expense with the id ${id} cannot be found.`;
  }
  
  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col lg={8} className="text-center">
          <Alert variant="danger" className="mb-4">
            <h2>{heading}</h2>
            <p className="mb-0">{message}</p>
          </Alert>
          <Button as="a" href="/dashboard/expenses" variant="primary">
            Back to Expenses
          </Button>
        </Col>
      </Row>
    </Container>
  );
}
