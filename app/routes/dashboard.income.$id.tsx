import type { Transation } from "@/types/transaction";
import type { DashboardIncomeRoute } from "@/types/routes-types";

const DATA: Transation[] = [
  {
    id: 1,
    title: "Salary October",
    amount: 2500,
  },
  {
    id: 2,
    title: "Salary September",
    amount: 2500,
  },
  {
    id: 3,
    title: "Salary August",
    amount: 2500,
  },
];

export function loader({
  params
}: DashboardIncomeRoute.LoaderArgs) {
  const transaction = DATA.find(transaction => transaction.id === Number(params.id));
  if (!transaction) throw new Response("Not found", { status: 404 });

  return transaction;
}

export default function ExpenseDetail({
  loaderData,
}: DashboardIncomeRoute.ComponentProps) {
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
