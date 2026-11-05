import { useNavigate } from "react-router-dom";
import { Button } from "../src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../src/components/ui/dialog";
import { useState } from "react";
import { LogOut } from "lucide-react";
import { useAppContext } from "@/context/AppContext";


export default function LogoutButton() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { logout } = useAppContext();
  const handleLogout = () => {
    // localStorage.removeItem('token');
    // navigate('/login');
    logout();
    setOpen(false);
    navigate('/login');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
             <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Logout</DialogTitle>
          <DialogDescription>
            Are you sure you want to logout? You will need to login again to access your account.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleLogout}>
            Logout
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}