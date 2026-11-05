import { useEffect, useState } from "react";
// import axios from "axios";
import { useForm } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getUsers } from "@/services/user";
import { addMemberToOrg } from "@/services/org";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useParams } from "react-router-dom";


type User = {
  _id: string;
  name: string;
  email: string;
};

type FormData = {
  userId: string;
  role: string;
};

export default function AddMemberForm() {
  const { orgId } = useParams<{ orgId: string }>();
  const { toast } = useToast();

  if (!orgId) return <p>Invalid org</p>;

  const form = useForm<FormData>({
    defaultValues: {
      userId: "",
      role: "member",
    },
  });

  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [userSelected, setUserSelected] = useState(false);
  const [selectedUserName, setSelectedUserName] = useState("");

  // 🔍 Debounced search
  useEffect(() => {
    const delay = setTimeout(async () => {
      if (!search.trim() || userSelected) {
        setUsers([]);
        return;
      }

      try {
        setLoading(true);
        const res = await getUsers(search);
        // console.log("Search results:", res);
        setUsers(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(delay);
  }, [search, userSelected]);

  // 🚀 Submit
  const onSubmit = async (data: FormData) => {
    try {
      console.log("Submitting data:", { ...data, orgId });

      // await axios.post(`/organizations/${orgId}/members`, data);
      let payload = { ...data, orgId }
      console.log("Payload for API:", payload);
      await addMemberToOrg(payload);


      toast({
        title: "Member added",
        description: "User successfully added to organization",
      });

      form.reset();
      setSearch("");
      setUsers([]);
      setUserSelected(false);
      setSelectedUserName("");
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  const selectedUserId = form.watch("userId");

  return (
    <div className="max-w-md space-y-4">
      <h2 className="text-lg font-semibold">Add Member</h2>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

        {/* 🔍 User Search */}
        <div>
          <label className="text-sm font-medium">User</label>

          <Input
            placeholder="Search users..."
            value={userSelected ? selectedUserName : search}
            onChange={(e) => {
              setSearch(e.target.value);
              setUserSelected(false);
              setSelectedUserName("");
            }}
          />

          {/* Selected user info */}
          {/* {userSelected && (
            <div className="mt-2 p-2 bg-muted/50 rounded-md text-sm">
              <p className="font-medium text-foreground">Selected User</p>
              <p className="text-muted-foreground">{selectedUserName}</p>
            </div>
          )} */}

          {/* Dropdown list */}
          <div className="border rounded-md mt-2 max-h-40 overflow-y-auto">
            {loading && (
              <p className="p-2 text-sm text-muted-foreground">
                Searching...
              </p>
            )}

            {!loading && users?.length === 0 && search && !selectedUserId && (
              <p className="p-2 text-sm text-muted-foreground">
                No users found
              </p>
            )}

            {!loading &&
              users.map((user) => (
                <div
                  key={user._id}
                  className="p-2 hover:bg-muted cursor-pointer text-sm"
                  onClick={() => {
                    form.setValue("userId", user._id);
                    setSearch(user.name);
                    setSelectedUserName(`${user.name} (${user.email})`);
                    setUsers([]);
                    setUserSelected(true);
                  }}
                >
                  <p className="font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              ))}
            {userSelected && (
              <div className="p-2 text-sm text-muted-foreground flex items-center justify-between">
                <span>Selected: {selectedUserName}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    form.setValue("userId", "");
                    setSearch("");
                    setSelectedUserName("");
                    setUserSelected(false);
                  }}
                  className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Clear
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 🎭 Role Select */}
        <div>
          <label className="text-sm font-medium">Role</label>

          <Select
            defaultValue="member"
            onValueChange={(value: string) => form.setValue("role", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>

            <SelectContent className="backdrop-blur-sm bg-popover/80 border">
              <SelectContent>
                <SelectItem value="admin" className="cursor-pointer">Admin</SelectItem>
                <SelectItem value="member" className="cursor-pointer">Member</SelectItem>
                <SelectItem value="viewer" className="cursor-pointer">Viewer</SelectItem>
              </SelectContent>
            </SelectContent>
          </Select>
        </div>

        {/* 🚀 Submit */}
        <Button type="submit" disabled={!selectedUserId} className="pt-6">
          Add Member
        </Button>
      </form>
    </div>
  );
}