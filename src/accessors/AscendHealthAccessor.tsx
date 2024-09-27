import LoginRequest from "../types/services/LoginRequest";
import { getCookie } from "../utils/helper";

export function createUser(userData: any) {
    return fetch(
        "https://5wljpndwrk.execute-api.us-east-1.amazonaws.com/prod/users/users",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        }
    );
}

export function loginUser(userData: LoginRequest) {
    return fetch(
        "https://5wljpndwrk.execute-api.us-east-1.amazonaws.com/prod/users/login",
        {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        }
    );
}

export function getUser(
    userId?: number,
    token?: string,
    first_name?: string,
    last_name?: string
) {
    const authToken = token || getCookie("token");

    return fetch(
        "https://5wljpndwrk.execute-api.us-east-1.amazonaws.com/prod/users/getUser",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify({
                user_id: userId,
                first_name: first_name,
                last_name: last_name,
                token: authToken,
            }),
        }
    );
}

export function listCompanies() {
    const authToken = getCookie("token");

    return fetch(
        "https://4juosmt5n0.execute-api.us-east-1.amazonaws.com/prod/companies/",
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`,
            },
        }
    );
}

export function createCompany(companyData: any) {
    const authToken = getCookie("token");

    return fetch(
        "https://4juosmt5n0.execute-api.us-east-1.amazonaws.com/prod/companies/",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify(companyData),
        }
    );
}

export function deleteCompany(companyId: any) {
    const authToken = getCookie("token");

    return fetch(
        `https://4juosmt5n0.execute-api.us-east-1.amazonaws.com/prod/companies/${companyId}`,
        {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`,
            },
        }
    );
}
