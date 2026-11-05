import { useState } from "react";
import API from "../services/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import CreateOrg from "./CreateOrg";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
// import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const OrganizationsPage = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { data: orgs, isLoading, error } = useQuery({
    queryKey: ["orgs"],
    queryFn: async () => {
      const res = await API.get("/membership/getUserOrgs");
      return res.data.data;
    },
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading orgs</p>;

  const handleCreateSuccess = () => {
    setOpen(false);
    queryClient.refetchQueries({ queryKey: ["orgs"] });
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">My Organizations</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Create Organization</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Organization</DialogTitle>
            </DialogHeader>
            <CreateOrg onSuccess={handleCreateSuccess} />
          </DialogContent>
        </Dialog>
      </div>

      {orgs?.map((org: any) => (
        <div key={org.id} className="p-4 border rounded-lg mb-4">
          <h3 className="text-lg font-semibold">{org.name}</h3>
          <p className="text-gray-600">Role: {org.role}</p>
          


          <button
            onClick={() => {
              localStorage.setItem("orgId", org.id);
              navigate(`/assign-user/${org.id}`);
            }}
          >
            Assign User to Org
          </button>
          <button
            onClick={() => {
              localStorage.setItem("orgId", org.id);
              navigate(`/getOrgMembers`);
            }}
            className="ml-2"
          >
            View Members
          </button>
          <Button
            onClick={() => {
              localStorage.setItem("orgId", org.id);
              navigate(`/tasks`);
            }}
            className="ml-2"
          >
            View Tasks
          </Button>
        </div>
      ))}
    </div>
  );
};

export default OrganizationsPage;