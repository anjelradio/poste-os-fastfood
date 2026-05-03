"use server";

import { revalidatePath } from "next/cache";
import { ordersRepository } from "../../data/repositories/orders.repository";

export async function createOrderAction(data: unknown) {
  const response = await ordersRepository.createOrder(data);

  if (response.ok) {
    revalidatePath("/");
  }

  return response;
}

export async function getOrderByIdAction(id: number) {
  return ordersRepository.getOrderById(id);
}

export async function updateOrderAction(id: number, data: unknown) {
  const response = await ordersRepository.updateOrder(id, data);

  if (response.ok) {
    revalidatePath("/caja/ordenes");
  }

  return response;
}
