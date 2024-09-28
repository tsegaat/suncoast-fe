import LoginRequest from "../types/services/LoginRequest";
import { getCookie } from "../utils/helper";

export function createUser(userData: any) {
    const authToken = getCookie("token");

    return fetch(
        "https://oy6esz8ug1.execute-api.us-east-1.amazonaws.com/prod/users/users",
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
        "https://oy6esz8ug1.execute-api.us-east-1.amazonaws.com/prod/users/login",
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
        "https://oy6esz8ug1.execute-api.us-east-1.amazonaws.com/prod/users/getUser",
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
        "https://30r6apjcce.execute-api.us-east-1.amazonaws.com/prod/companies/",
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
        "https://30r6apjcce.execute-api.us-east-1.amazonaws.com/prod/companies/",
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
        `https://30r6apjcce.execute-api.us-east-1.amazonaws.com/prod/companies/${companyId}`,
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
        `https://30r6apjcce.execute-api.us-east-1.amazonaws.com/prod/companies/locations/${locationId}`,
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
        `https://oy6esz8ug1.execute-api.us-east-1.amazonaws.com/prod/users/users/location/${locationId}`,
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
        "https://99so0tk1jh.execute-api.us-east-1.amazonaws.com/prod/tasks/tasks",
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
        "https://99so0tk1jh.execute-api.us-east-1.amazonaws.com/prod/tasks/tasks/user",
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
        `https://99so0tk1jh.execute-api.us-east-1.amazonaws.com/prod/tasks/tasks/${task_id}/status`,
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
        `https://30r6apjcce.execute-api.us-east-1.amazonaws.com/prod/companies/${companyId}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`,
            },
        }
    );
}
