import type { DashboardIncomeRoute } from "@/types/routes-types";
import db from "@/lib/db.server";

export async function loader({
  params
}: DashboardIncomeRoute.LoaderArgs) {
  const invoice = await db.invoice.findUnique({ where: { id: params.id } });
  if (!invoice) throw new Response("Not found", { status: 404 });

  return invoice;
}

export default function IncomeDetail({
  loaderData,
}: DashboardIncomeRoute.ComponentProps) {
  const { id, title, amount, createdAt } = loaderData
  return (
    <div style={{ width: "100%" }}>
      <h2>Income Details</h2>
      <p>ID: {id}</p>
      <p>Title: {title}</p>
      <p>Amount: {amount}</p>
      <p>Created At: {createdAt.toLocaleDateString()}</p>
    </div>
  );
}
