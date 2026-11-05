import { useEffect, useState } from "react";
import { isAxiosError } from "axios";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { deleteMemberFromOrg, getMembersOfOrg } from "../services/org";

type User = {
    _id:string,
    user: {
        name:string,
        email:string,
        _id:string
    },
    role:string,
    status:string
}
export default function OrgUsers() {
    const { toast } = useToast();
    const [users, setUsers] = useState<User[]>([]);
    const [deletingUserId, setDeletingUserId] = useState<string | null>(null);

    useEffect(()=>{
        const fetchUsers = async() => {
            try{
                const data = await getMembersOfOrg();
                // console.log("data,", data.data)
                setUsers(data?.data)
            }catch(error){
               console.error("Error in  fetching Users",error)
            }
        }
        fetchUsers();
    },[])

    const handleDeleteUser = async(member: User) => {
        const userId = member.user._id;
        const confirmed = window.confirm(`Delete ${member.user.name} from this organization?`);

        if (!confirmed) return;

        try {
            setDeletingUserId(userId);
            await deleteMemberFromOrg(userId);
            setUsers((currentUsers) => currentUsers.filter((user) => user.user._id !== userId));
            toast({
                title: "User deleted",
                description: "User successfully removed from organization",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: isAxiosError(error)
                    ? error.response?.data?.message || "Failed to delete user"
                    : "Failed to delete user",
                variant: "destructive",
            });
        } finally {
            setDeletingUserId(null);
        }
    };

    return (
    <div className="p-6">
      <h2>Organization Users</h2>
      {users?.length === 0 ? (
        <p>No users found</p>
      ) : (
        users.map((user) => (
          <div key={user._id} className="p-4 border rounded-lg mb-4 flex items-start justify-between gap-4">
            <div>
              <p className="font-medium">{user.user.name}</p> 
              <p className="text-sm text-gray-600">{user.user.email}</p>
              <p className="text-sm text-gray-500">Role: {user.role}</p>
              {/* <p className="text-xs text-gray-400">Status: {user.status}</p> */}
            </div>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => handleDeleteUser(user)}
              disabled={deletingUserId === user.user._id}
            >
              <Trash2 />
              {deletingUserId === user.user._id ? "Deleting..." : "Delete"}
            </Button>
          </div>
        ))
      )}
    </div>
  );

}
