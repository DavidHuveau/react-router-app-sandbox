import db from "@/lib/db.server";
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
    },
  });
}
