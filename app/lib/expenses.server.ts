import db from "@/lib/db.server";
import zod from "zod";
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

const expenseSchema = zod.object({
  title: zod.string().min(3, "Title must have at least 3 characters"),
  description: zod.string(),
  amount: zod.number().positive("Amount must be positive"),
});

export function parseExpense(formData: FormData) {
  const data = Object.fromEntries(formData);
  const amountNumber = Number.parseFloat(data.amount as string);
  if (Number.isNaN(amountNumber)) {
    throw Error("Invalid amount");
  }

  try {
    const { title, description, amount } = expenseSchema.parse({
      ...data,
      amount: amountNumber
    });
    return { title, description, amount };
  } catch (error) {
    if (error instanceof zod.ZodError) {
      const errorMessages = error.issues.map((issue) => 
        `${issue.path.join(".")}: ${issue.message}`
      ).join(", ");
      
      throw new Error(`Validation failed: ${errorMessages}`);
    }
    throw error;
  }
}
