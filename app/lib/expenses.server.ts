import db from "@/lib/db.server";
import type { Expense } from "@prisma/client";

type ExpenseCreateData = Pick<Expense, "userId" | "title" | "description" | "amount">;

export function createExpense({ title, description, amount, userId }: ExpenseCreateData) {
  return db.expense.create({
    data: { 
      title,
      description,
      amount,
      currencyCode: "USD",
      userId,
    },
  });
}

export function deleteExpense(id: string, userId: string) {
  return db.expense.delete({ 
    where: { id, userId } 
  });
}

type ExpenseUpdateData = Pick<Expense, "id" | "userId" | "title" | "description" | "amount">;

export function updateExpense({ id, title, description, amount, userId }: ExpenseUpdateData) {
  return db.expense.update({
    where: { id, userId },
    data: { 
      title,
      description,
      amount,
    },
  });
}

