import api from "./api";

export const VerifyLogin = async (email: string, senha: string) => {
    const { data } = await api.post("/auth/login", {
        email,
        senhaHash: senha,
    });

    return data;
};

export const CreateUser = async (data: unknown) => {
    const response = await api.post("/auth/register", data);

    return response.data;
}

export const GetProfile = async () => {
    const { data } = await api.get("/auth/profile");
    return data;
};