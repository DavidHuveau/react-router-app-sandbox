import { Button, Form, Card } from "react-bootstrap";
import { Form as FormRouter, redirect, useSubmit, useNavigation } from "react-router";
import type { DashboardIncomeIndexRoute } from "@/types/routes-types";
import db from "@/lib/db.server";

export async function action({ request }: DashboardIncomeIndexRoute.ActionArgs) {
  const formData = await request.formData();
  const title = formData.get("title");
  const description = formData.get("description");
  const amount = formData.get("amount");

  if (typeof title !== "string" || typeof description !== "string" || typeof amount !== "string") {
    throw Error('something went wrong');
  }
  const amountNumber = Number.parseFloat(amount);
  if (Number.isNaN(amountNumber)) {
    throw Error('something went wrong');
  }
  
  const invoice = await db.invoice.create({
    data: { 
      title,
      description,
      amount: amountNumber,
      currencyCode: "USD",
    },
  });

  return redirect(`/dashboard/income/${invoice.id}`);
}

export default function IncomeIndex() {
  const submit = useSubmit();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting" && navigation.formAction === "/dashboard/income/?index";

  const handleQuickAdd = (title: string, amount: number) => {
    submit(
      { title, description: "Quick add", amount: amount.toString() },
      { method: "POST", action: "/dashboard/income/?index" }
    );
  };

  const renderQuickActionButton = (title: string, amount: number) => (
    <Button 
      onClick={() => handleQuickAdd(title, amount)}
      disabled={isSubmitting}
      variant={"outline-secondary"}
      className="me-2"
    >
      {isSubmitting ? "Adding..." : `${title} ($${amount})`}
    </Button>
  );

  return (
    <>
      <Card className="mb-4">
        <Card.Header>
          <h4 className="mb-0">Quick Actions</h4>
        </Card.Header>
        <Card.Body>
          {renderQuickActionButton("Salary", 2500)}
          {renderQuickActionButton("Freelance", 500)}
          {renderQuickActionButton("Bonus", 1000)}
        </Card.Body>
      </Card>

      <FormRouter method="POST" action="/dashboard/income/?index">
        <Form.Group className="mb-3">
          <Form.Label>Title:</Form.Label>
          <Form.Control type="text" name="title" placeholder="Monthly Salary" required />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Description:</Form.Label>
          <Form.Control as="textarea" name="description" />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Amount (in USD):</Form.Label>
          <Form.Control type="number" name="amount" defaultValue={0} />
        </Form.Group>
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create"}
        </Button>
      </FormRouter>
    </>
  );
}
