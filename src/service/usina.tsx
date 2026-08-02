import api from './api'

export const CadUsina = async (data: unknown) => {
    const response = await api.post("/usina/create", data);

    return response.data;
}

export const GetMyUsinas = async () => {
    const response = await api.get("/usina/my");
    return response.data;
};

export const GetUsinas = async () => {
    const response = await api.get("/usina/all");
    return response.data;
};

export const GetUsinaId = async (id: number) => {
    const response = await api.get(`/usina/${id}`);
    return response.data;
}

export const RegisterProducao = async (data: unknown, id: number) => {
    const response = await api.post(`/usina/producao/${id}`, data);

    return response.data
}