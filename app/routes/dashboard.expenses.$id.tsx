import type { Transation } from "@/types/transaction";
import type { DashboardExpenseRoute } from "@/types/routes-types";

const DATA: Transation[] = [
  {
    id: 1,
    title: "Food",
    amount: 100,
  },
  {
    id: 2,
    title: "Transport",
    amount: 100,
  },
  {
    id: 3,
    title: "Entertainment",
    amount: 100,
  },
];

export function loader({
  params
}: DashboardExpenseRoute.LoaderArgs) {
  const transaction = DATA.find(transaction => transaction.id === Number(params.id));
  if (!transaction) throw new Response("Not found", { status: 404 });

  return transaction;
}

export default function ExpenseDetail({
  loaderData,
}: DashboardExpenseRoute.ComponentProps) {
  const { id, title, amount } = loaderData
  return (
    <div style={{ width: "100%" }}>
      <h2>Expense Details</h2>
      <p>ID: {id}</p>
      <p>Title: {title}</p>
      <p>Amount: {amount}</p>
    </div>
  );
}
