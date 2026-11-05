import API from "./api";

type CreateTask = {
    name: string,
    description: string,
    assignedTo:string,
    priority:string,
    dueDate:string
}

export const createTask = async(data:CreateTask) => {
    const res = await API.post('tasks/createTask',data);
    return res.data
}

export type UpdateTaskPayload = {
    name?: string;
    description?: string;
    assignedTo?: string;
    status?: string;
    priority?: string;
}

export type Task = {
    _id:string;
    name:string;
    description?:string;
    status:string;
    priority:string;
    dueDate?:string;
    assignedTo?:{
        _id:string;
        name:string;
        email:string;
    };
    organization?:{
        _id:string;
        name:string;
    };
    createdAt:string;
}

export const getTasksOfOrg = async(orgId:string) => {
    const res = await API.get(`tasks/${orgId}/tasks`);
    return res.data;
}

export const updateTask = async(orgId:string, taskId:string, data:UpdateTaskPayload) => {
    const res = await API.patch(`tasks/${orgId}/tasks/${taskId}`, data);
    return res.data;
}
