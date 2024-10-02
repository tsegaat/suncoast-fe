import LoginRequest from "../types/services/LoginRequest";
import { getCookie } from "../utils/helper";

export function createEmployee(userData: any) {
    const authToken = getCookie("token");

    return fetch(
        "https://a6kqv0pdwd.execute-api.us-east-1.amazonaws.com/prod/users/users",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify(userData),
        }
    );
}

export function loginUser(userData: LoginRequest) {
    return fetch(
        "https://a6kqv0pdwd.execute-api.us-east-1.amazonaws.com/prod/users/login",
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
        "https://a6kqv0pdwd.execute-api.us-east-1.amazonaws.com/prod/users/getUser",
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
        "https://goadv7ebi4.execute-api.us-east-1.amazonaws.com/prod/companies/",
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
        "https://goadv7ebi4.execute-api.us-east-1.amazonaws.com/prod/companies/",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`,
            },
            body: companyData,
        }
    );
}

export function deleteCompany(companyId: any) {
    const authToken = getCookie("token");

    return fetch(
        `https://goadv7ebi4.execute-api.us-east-1.amazonaws.com/prod/companies/${companyId}`,
        {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`,
            },
        }
    );
}

export function getLocation(locationId: number) {
    const authToken = getCookie("token");

    return fetch(
        `https://goadv7ebi4.execute-api.us-east-1.amazonaws.com/prod/companies/locations/${locationId}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`,
            },
        }
    );
}

export function getUsersByLocation(locationId: number) {
    const authToken = getCookie("token");

    return fetch(
        `https://a6kqv0pdwd.execute-api.us-east-1.amazonaws.com/prod/users/users/location/${locationId}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`,
            },
        }
    );
}

export function createTask(taskData: any) {
    const authToken = getCookie("token");

    return fetch(
        "https://zlh1s6pxw4.execute-api.us-east-1.amazonaws.com/prod/tasks/tasks",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify(taskData),
        }
    );
}

export function getTasksByUserToken() {
    const authToken = getCookie("token");

    return fetch(
        "https://zlh1s6pxw4.execute-api.us-east-1.amazonaws.com/prod/tasks/tasks/user",
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`,
            },
        }
    );
}

export function updateTaskStatus(task_id: number, new_status: string) {
    const authToken = getCookie("token");

    return fetch(
        `https://zlh1s6pxw4.execute-api.us-east-1.amazonaws.com/prod/tasks/tasks/${task_id}/status`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify({ new_status }),
        }
    );
}

export function getCompany(companyId: number) {
    const authToken = getCookie("token");

    return fetch(
        `https://goadv7ebi4.execute-api.us-east-1.amazonaws.com/prod/companies/${companyId}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`,
            },
        }
    );
}
