// import axios from "axios";
import API from "./api";

type CreatePayload = {
    name:string;
    description:string
}
export const createOrganization = async(data:CreatePayload) => {
    const res = await API.post('orgs/createOrg',data);
    return res.data;
}

type AddMemberPayload = {
    userId:string;
    role:string;
}
export const addMemberToOrg = async(data:AddMemberPayload) => {
    const res = await API.post("membership/members", data);
    return res.data;
}

export const getMembersOfOrg = async() => {
    const res = await API.get("membership/members");
    return res.data;
}

export const deleteMemberFromOrg = async(userId:string) => {
    const res = await API.delete(`membership/members/${userId}`);
    return res.data;
}

export type OrganizationInvite = {
    _id:string;
    role:string;
    status:string;
    organization:{
        _id:string;
        name:string;
        slug:string;
        description?:string;
    };
    invitedBy?:{
        _id:string;
        name:string;
        email:string;
    };
}

export const getInvites = async() => {
    const res = await API.get("membership/invites");
    return res.data;
}

export const acceptInvite = async(inviteId:string) => {
    const res = await API.patch(`membership/invites/${inviteId}/accept`);
    return res.data;
}

export const declineInvite = async(inviteId:string) => {
    const res = await API.patch(`membership/invites/${inviteId}/decline`);
    return res.data;
}
