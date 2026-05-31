import { clientsApi } from "../api/clients-api";

export const clientsRepository = {
  getClients() {
    return clientsApi.getClients();
  },

  getClientById(id: number) {
    return clientsApi.getClientById(id);
  },
};
