import type { RegisterOrderRequest } from "../schemas/order.schema";
import type { OrderDetailResponseDto } from "../schemas/order-detail-response.schema";
import { OrderType } from "../../domain/entities/order";

export function toCreateOrderRequestDto(data: RegisterOrderRequest) {
  const basePayload = {
    client_name: data.clientName,
    reserved_at: data.reservedAt ? data.reservedAt : null,
    type: data.orderType,
    order: data.order.map((item) => ({
      id: item.id,
      quantity: item.quantity,
    })),
  };

  if (data.orderType === "DELIVERY") {
    return {
      ...basePayload,
      client_phone: data.clientPhone,
      address: data.address,
      reference_note: data.referenceNote,
    };
  }

  return basePayload;
}

export function toOrderDetailEntity(dto: OrderDetailResponseDto) {
  return {
    id: dto.id,
    orderNumber: dto.order_number,
    clientName: dto.client_name,
    orderType: dto.type as OrderType,
    reservedAt: dto.reserved_at,
    status: dto.status,
    items: dto.items,
    clientPhone: dto.client_phone,
    address: dto.address,
    referenceNote: dto.reference_note,
  };
}
