import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  Link,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "react-router";
import { Alert, Container } from "react-bootstrap";

import "bootstrap/dist/css/bootstrap.min.css";
import "./app.css";

import type { Route } from "./+types/root";
import PageTransitionProgressBar from "@/components/PageTransitionProgressBar";
import { getUser } from "./lib/session/session.server";

export const meta: MetaFunction = () => {
  return [
    { title: "BeeRich" },
    {
      name: "description",
      content:
        "Bee in control of your finances with BeeRich",
    },
  ];
};

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body suppressHydrationWarning>
        <PageTransitionProgressBar />
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await getUser(request);
  return { user };
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let heading = "Unexpected Error";
  let message = "We are very sorry. An unexpected error occurred. Please try again or contact us if the problem persists.";
  let stack: string | undefined;
  let errorMessage: string | undefined;

  if (isRouteErrorResponse(error)) {
    switch (error.status) {
      case 401:
        heading = "401 Unauthorized";
        message = "Oops! Looks like you tried to visit a page that you do not have access to.";
        break;
      case 401:
        heading = "Access Denied";
        message = "You don't have permission to access this page.";
        break;
      case 404:
        heading = "404 Not Found";
        message = "Oops! Looks like you tried to visit a page that does not exist.";
        break;
      case 500:
        heading = "Server Error";
        message = "Something went wrong on our end. Please try again later.";
        break;
      default:
        heading = `${error.status} Error`;
        message = error.statusText || message;
        break;
    }
  } 
  else if (error instanceof Error) {
    errorMessage = error.message;
    if (import.meta.env.DEV) {
      stack = error.stack;
    }
  }

  return (
    <Container className="py-5">
      <h1>{heading}</h1>
      <p>{message}</p>
      {errorMessage && (
        <Alert variant="danger" className="mt-3">
          Error message: {errorMessage}
        </Alert>
      )}
      {stack && (
        <pre className="p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
      <Link to="/" className="btn btn-primary">
        Back to homepage
      </Link>
    </Container>
  );
}
