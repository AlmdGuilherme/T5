import type { ClienteData } from "../types/ClienteTypes";

const API_URL = 'http://localhost:3000';

export const ClientesApi = {
    getClientes: async (): Promise<ClienteData[] | null> => {
        try {
            const response = await fetch(`${API_URL}/clientes`);
            if (!response.ok) {
                console.error(`HTTP Error! Status: ${response.status} - ${response.statusText}`);
                return null;
            }
            const data: ClienteData[] = await response.json();
            return data;
        } catch (error) {
            console.error(`Erro ao buscar clientes: ${error}`);
            return null;
        }
    },
    getClienteById: async (id: number): Promise<ClienteData | null> => {
        try {
            const response = await fetch(`${API_URL}/clientes/${id}`);
            if (!response.ok) {
                console.error(`HTTP Error! Status: ${response.status} - ${response.statusText}`);
                return null;
            }
            const data: ClienteData = await response.json();
            return data;
        } catch (error) {
            console.error(`Erro ao puxar dados do cliente de ID: ${id}: ${error}`);
            return null;
        }
    },
    cadastrarClientes: async (cliente: ClienteData): Promise<boolean> => {
        try {
            const response = await fetch(`${API_URL}/cadastrar-clientes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(cliente)
            });
            if (!response.ok) {
                console.error(`HTTP Error! Status: ${response.status} - ${response.statusText}`);
                const errorBody = await response.text();
                console.error('Detalhes do erro:', errorBody);
                return false;
            }
            return true;
        } catch (error) {
            console.error(`Erro ao cadastrar cliente: ${error}`);
            return false;
        }
    },
    atualizarClientes: async (id: number, cliente: ClienteData): Promise<boolean> => {
        try {
            const response = await fetch(`${API_URL}/atualizar-clientes/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(cliente),
            });

            if (!response.ok) {
                console.error(`HTTP Error! Status: ${response.status} - ${response.statusText}`);
                const errorBody = await response.text();
                console.error('Detalhes do erro:', errorBody);
                return false;
            }
            return true;
        } catch (error) {
            console.error(`Erro ao atualizar cliente de ID ${id}:`, error);
            return false;
        }
    },
    deletarClientes: async (id: number): Promise<boolean> => {
        try {
            const response = await fetch(`${API_URL}/deletar-clientes/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                console.error(`HTTP Error! Status: ${response.status} - ${response.statusText}`);
                const errorBody = await response.text();
                console.error('Detalhes do erro:', errorBody);
                return false;
            }
            return true;
        } catch (error) {
            console.error(`Erro ao deletar cliente de ID ${id}:`, error);
            return false;
        }
    }
};