import LoginRequest from "../types/services/LoginRequest";
import { getCookie } from "../utils/helper";

const companyApiUrl =
    "https://yuv9nhk1j7.execute-api.us-east-1.amazonaws.com/prod";
const userApiUrl =
    "https://6xsnkhkxeg.execute-api.us-east-1.amazonaws.com/prod";
const taskApiUrl =
    "https://3k3yxt8gw9.execute-api.us-east-1.amazonaws.com/prod";

const maintenanceApiUrl =
    "https://p2rgzkr6vg.execute-api.us-east-1.amazonaws.com/prod";

export function createEmployee(userData: any) {
    const authToken = getCookie("token");

    return fetch(userApiUrl + "/users/users", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(userData),
    });
}

export function loginUser(userData: LoginRequest) {
    return fetch(userApiUrl + "/users/login", {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
    });
}

export function getUser(
    userId?: number,
    token?: string,
    fname?: string,
    lname?: string
) {
    const authToken = token || getCookie("token");

    return fetch(userApiUrl + "/users/getUser", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
            user_id: userId,
            fname,
            lname,
            token: authToken,
        }),
    });
}

export function listCompanies() {
    const authToken = getCookie("token");

    return fetch(companyApiUrl + "/companies/", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
        },
    });
}

export function createCompany(companyData: any) {
    const authToken = getCookie("token");

    return fetch(companyApiUrl + "/companies/", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${authToken}`,
        },
        body: companyData,
    });
}

export function deleteCompany(companyId: any) {
    const authToken = getCookie("token");

    return fetch(companyApiUrl + `/companies/${companyId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
        },
    });
}

export function getLocation(locationId: number) {
    const authToken = getCookie("token");

    return fetch(companyApiUrl + `/companies/locations/${locationId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
        },
    });
}

export function getUsersByLocation(locationId: number) {
    const authToken = getCookie("token");

    return fetch(userApiUrl + `/users/users/location/${locationId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
        },
    });
}

export function createTask(taskData: any) {
    const authToken = getCookie("token");

    return fetch(taskApiUrl + "/tasks/tasks", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${authToken}`,
        },
        body: taskData,
    });
}

export function getTasksByUserToken() {
    const authToken = getCookie("token");

    return fetch(taskApiUrl + "/tasks/tasks/user", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
        },
    });
}

export function updateTaskStatus(task_id: number, new_status: string) {
    const authToken = getCookie("token");

    return fetch(taskApiUrl + `/tasks/tasks/${task_id}/status`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ new_status }),
    });
}

export function getCompany(companyId: number) {
    const authToken = getCookie("token");

    return fetch(companyApiUrl + `/companies/${companyId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
        },
    });
}

export function updateCompany(companyId: number, companyUpdateData: FormData) {
    const authToken = getCookie("token");

    return fetch(companyApiUrl + `/companies/${companyId}`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${authToken}`,
        },
        body: companyUpdateData,
    });
}

export function createMaintenanceRequest(maintenanceData: any) {
    const authToken = getCookie("token");

    return fetch(maintenanceApiUrl + "/maintReq/maintenance-requests", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${authToken}`,
        },
        body: maintenanceData,
    });
}

export function getPooledTasksWithLocationId(locationId: number) {
    const authToken = getCookie("token");

    return fetch(taskApiUrl + `/tasks/tasks/pooled/${locationId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
        },
    });
}

export function getUserByName(fname: string, lname: string) {
    const authToken = getCookie("token");

    const search = {
        fname,
        lname,
    };
    return fetch(userApiUrl + `/users/users/search`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(search),
    });
}

export function getTasksByUserIdAndStatus(user_id: number, status: string) {
    const authToken = getCookie("token");

    return fetch(
        taskApiUrl + `/tasks/tasks/by_user/${user_id}/status/${status}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify({
                user_id: user_id,
                status: status,
            }),
        }
    );
}

export function deleteUser(user_id: number) {
    const authToken = getCookie("token");

    return fetch(userApiUrl + `/users/users/${user_id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
            user_id: user_id,
        }),
    });
}

export function deleteTask(task_id: number) {
    const authToken = getCookie("token");

    return fetch(taskApiUrl + `/tasks/tasks/${task_id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${authToken}`,
        },
    });
}

export function resetPasswordRequest(email: string) {
    return fetch(userApiUrl + `/users/password/reset`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
    });
}

export function resetPassword(token: string, new_password: string) {
    return fetch(userApiUrl + `/users/password/reset/confirm`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            token,
            new_password,
        }),
    });
}
