type MessageResponse = { message: string };

export function toMessageEntity(data: MessageResponse): MessageResponse {
  return {
    message: data.message,
  };
}
