import db from "@/lib/db.server";
import zod from "zod";
import type { Invoice } from "@prisma/client";

type InvoiceCreateData = Pick<Invoice, "userId" | "title" | "description" | "amount">;

export function createInvoice({ title, description, amount, userId }: InvoiceCreateData) {
  return db.invoice.create({
    data: { 
      title,
      description,
      amount,
      currencyCode: "USD",
      userId,
      logs: {
        create: {
          title,
          description,
          amount,
          currencyCode: "USD",
          userId,
        },
      },
    },
  });
}

export function deleteInvoice(id: string, userId: string) {
  return db.invoice.delete({ 
    where: { id, userId } 
  });
}

type InvoiceUpdateData = Pick<Invoice, "id" | "userId" | "title" | "description" | "amount">;

export function updateInvoice({ id, title, description, amount, userId }: InvoiceUpdateData) {
  return db.invoice.update({
    where: { id, userId },
    data: { 
      title,
      description,
      amount,
      logs: {
        create: {
          title,
          description,
          amount,
          currencyCode: "USD",
          userId,
        },
      },
    },
  });
}

const invoiceSchema = zod.object({
  title: zod.string().min(3, "Title must have at least 3 characters"),
  description: zod.string(),
  amount: zod.number().positive("Amount must be positive"),
});

export function parseInvoice(formData: FormData) {
  const data = Object.fromEntries(formData);
  const amountNumber = Number.parseFloat(data.amount as string);
  if (Number.isNaN(amountNumber)) {
    throw Error("Invalid amount");
  }

  try {
    const { title, description, amount } = invoiceSchema.parse({
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
