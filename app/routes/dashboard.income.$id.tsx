import { Button, Form, Alert, Spinner } from "react-bootstrap";
import { Form as FormRouter, redirect, useNavigation } from "react-router";
import type { DashboardIncomeRoute } from "@/types/routes-types";
import db from "@/lib/db.server";

async function updateIncome(id: string, formData: FormData) {
  const title = formData.get("title");
  const description = formData.get("description");
  const amount = formData.get("amount");

  if (typeof title !== "string" || typeof description !== "string" || typeof amount !== "string") {
    throw Error("something went wrong");
  }
  const amountNumber = Number.parseFloat(amount);
  if (Number.isNaN(amountNumber)) {
    throw Error("something went wrong");
  }

  return db.invoice.update({
    where: { id },
    data: { 
      title,
      description,
      amount: amountNumber,
    },
  });
}

async function deleteIncome(id: string) {
    try {
    await db.invoice.delete({ where: { id } });
  } catch (err) {
    throw new Response('Not found', { status: 404 });
  }
}

export async function action({
  request,
  params,
}: DashboardIncomeRoute.ActionArgs) {
  const { id } = params;
  if (!id) throw Error("id parameter must be defined");

  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "delete") {
    await deleteIncome(id);
    return redirect("/dashboard/income");
  } else if (intent === "update") {
    await updateIncome(id, formData);
    return { success: true };
  }
}

export async function loader({
  params,
}: DashboardIncomeRoute.LoaderArgs) {
  const invoice = await db.invoice.findUnique({ where: { id: params.id } });
  if (!invoice) throw new Response("Not found", { status: 404 });

  return invoice;
}

export default function IncomeDetail({
  loaderData,
  actionData,
}: DashboardIncomeRoute.ComponentProps) {
  const { id, title, description, amount } = loaderData;
  const navigation = useNavigation();
  const isSubmitting = navigation.state !== "idle" && navigation.formAction === `/dashboard/income/${id}`;
  const submittingIntent = navigation.formData?.get("intent");
  const isUpdating = isSubmitting && submittingIntent === "update";
  const isDeleting = isSubmitting && submittingIntent === "delete";

  return (
    <>
      {actionData?.success && (
        <Alert variant="success" aria-live="polite" className="mb-3">
          Changes saved!
        </Alert>
      )}
      <FormRouter method="POST" action={`/dashboard/income/${id}`} key={id}>
        <Form.Group className="mb-3">
          <Form.Label>Title:</Form.Label>
          <Form.Control type="text" name="title" placeholder="Freelance Project" required defaultValue={title}/>
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
            if (!window.confirm("Do you really want to delete this income?")) {
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
    </>
  );
}
