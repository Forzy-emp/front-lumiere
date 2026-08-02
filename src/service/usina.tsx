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

export const RegisterProducao = async (usinaId: number, producao: number, usoInterno: number) => {
    const { data } = await api.post(`/usina/producao/${usinaId}`, {
        producao,
        usoInterno,
    });

    return data;
};

interface RegisterManutencaoDto {
    dataManutencao: string;
    horasManutencao: string;
    empresaManutencao: boolean;
    nomeEmpresa?: string | null;
}

export const RegisterManutencao = async (
    usinaId: number,
    dto: RegisterManutencaoDto
) => {
    const { data } = await api.post(`/usina/manutencao/${usinaId}`, dto);

    return data;
};

export const ToggleStatusUsina = async (id: number) => {
    const { data } = await api.patch(`/usina/${id}/status`);
    return data;
};

export const UpdateUsina = async (
    usinaId: number,
    payload: {
        name: string;
        cep: string;
        logradouro: string;
        numero: string;
        bairro: string;
        cidade: string;
        estado: string;
        qtd_placas: number;
        exposicao_solar_diaria: number;
        limite_beneficiarios: number;
        data_instalacao: string;
        data_ultima_manutencao: string;
    }
) => {
    const { data } = await api.put(
        `/usina/${usinaId}`,
        payload
    );

    return data;
};