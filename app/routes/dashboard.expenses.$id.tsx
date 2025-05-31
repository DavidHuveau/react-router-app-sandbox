import type { Route } from "../+types/root";

interface Expense {
  id: number;
  title: string;
  amount: number;
}

const DATA: Expense[] = [
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
}: Route.LoaderArgs) {
  const { id } = params;
  const expense = DATA.find(expense => expense.id === Number(id));
  if (!expense) throw new Response("Not found", { status: 404 });

  return expense;
}

export default function ExpenseDetail({
  loaderData,
}: {
  loaderData: Expense;
}) {
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
