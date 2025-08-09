import { Button, Form, Card, Alert } from "react-bootstrap";
import { Form as FormRouter, redirect, useNavigation } from "react-router";
import { createUserSession, getUserId, loginUser } from "@/lib/session/session.server";
import { validateEmail } from "@/lib/validation";
import type { AuthLoginRoute } from "@/types/routes-types";

export async function action({ request }: AuthLoginRoute.ActionArgs) {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");

  if (!email || !password) {
    return { error: "Please fill out all fields." };
  }

  if (typeof email !== "string" || typeof password !== "string") {
    return { error: "Invalid form data." };
  }

  const emailError = validateEmail(email);
  if (emailError) {
    return { error: emailError };
  }

  try {
    const user = await loginUser({ email, password });
    return redirect("/dashboard", {
      headers: await createUserSession(user),
    });
  } catch (error: any) {
    return { error: error?.message || "Something went wrong. Please try again." };
  }
}

export async function loader({ request }: AuthLoginRoute.LoaderArgs) {
  const userId = await getUserId(request);
  if (userId) {
    return redirect("/dashboard");
  }
  return {};
}

export default function Component({ actionData }: AuthLoginRoute.ComponentProps) {
  const navigation = useNavigation();
  const isSubmitting = navigation.state !== "idle" && navigation.formAction === "/login";

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", padding: "2rem" }}>
      <Card>
        <Card.Body>
          <h1 className="mb-4">Log In</h1>
          
          {actionData?.error && (
            <Alert variant="danger" className="mb-3">
              {actionData.error}
            </Alert>
          )}

          <FormRouter method="POST" action="/login">
            <Form.Group className="mb-3">
              <Form.Label>Email:</Form.Label>
              <Form.Control type="email" name="email" required placeholder="john@example.com" />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password:</Form.Label>
              <Form.Control type="password" name="password" required placeholder="Enter your password" />
            </Form.Group>

            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? "Logging you in..." : "Log in!"}
            </Button>
          </FormRouter>
        </Card.Body>
      </Card>
    </div>
  );
}
