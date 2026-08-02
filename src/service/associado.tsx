import api from "./api";

export const RegisterAssociado = async (
    usinaId: number,
    email: string,
    credito: number
) => {
    const { data } = await api.post("/associado", {
        usinaId,
        email,
        credito,
    });

    return data;
};

export const UpdateAssociado = async (
    associadoId: number,
    credito: number
) => {
    const { data } = await api.put(`/associado/${associadoId}`, {
        credito,
    });

    return data;
};