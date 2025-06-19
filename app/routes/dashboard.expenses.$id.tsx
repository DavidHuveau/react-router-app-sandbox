import type { DashboardExpenseRoute } from "@/types/routes-types";
import db from "@/lib/db.server";

export async function loader({
  params
}: DashboardExpenseRoute.LoaderArgs) {
  const expense = await db.expense.findUnique({ where: { id: params.id } });
  if (!expense) throw new Response("Not found", { status: 404 });

  return expense;
}

export default function ExpenseDetail({
  loaderData,
}: DashboardExpenseRoute.ComponentProps) {
  const { id, title, amount, createdAt } = loaderData
  return (
    <div style={{ width: "100%" }}>
      <h2>Expense Details</h2>
      <p>ID: {id}</p>
      <p>Title: {title}</p>
      <p>Amount: {amount}</p>
      <p>Created At: {createdAt.toLocaleDateString()}</p>
    </div>
  );
}
