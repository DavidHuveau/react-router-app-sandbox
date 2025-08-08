import { Button, Form, Card, Alert } from "react-bootstrap";
import { Form as FormRouter, redirect, useNavigation } from "react-router";
import { registerUser } from "@/lib/session/session.server";
import type { AuthSignupRoute } from "@/types/routes-types";

export async function action({ request }: AuthSignupRoute.ActionArgs) {
  const formData = await request.formData();
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");

  if (!name || !email || !password) {
    return { error: "Please fill out all fields." };
  }

  if (typeof name !== "string" || typeof email !== "string" || typeof password !== "string") {
    return { error: "Invalid form data." };
  }

  if (name.trim().length < 2) {
    return { error: "Name must be at least 2 characters long." };
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters long." };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { error: "Please enter a valid email address." };
  }

  try {
    const user = await registerUser({ name, email, password });
    
    return redirect("/dashboard");
  } catch (error: any) {
    return { error: error?.message || "Something went wrong. Please try again." };
  }
}

export async function loader({ request }: AuthSignupRoute.LoaderArgs) {
  // return redirect("/dashboard");
  return {};
}

export default function Component({ actionData }: AuthSignupRoute.ComponentProps) {
  const navigation = useNavigation();
  const isSubmitting = navigation.state !== "idle" && navigation.formAction === "/signup";

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", padding: "2rem" }}>
      <Card>
        <Card.Body>
          <h1 className="mb-4">Sign Up</h1>
          
          {actionData?.error && (
            <Alert variant="danger" className="mb-3">
              {actionData.error}
            </Alert>
          )}

          <FormRouter method="POST" action="/signup">
            <Form.Group className="mb-3">
              <Form.Label>Name:</Form.Label>
              <Form.Control type="text" name="name" required placeholder="John Doe"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email:</Form.Label>
              <Form.Control type="email" name="email" required placeholder="john@example.com"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password:</Form.Label>
              <Form.Control type="password" name="password" required placeholder="Enter your password"/>
            </Form.Group>

            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? "Signing you up..." : "Sign up!"}
            </Button>
          </FormRouter>
        </Card.Body>
      </Card>
    </div>
  );
}
