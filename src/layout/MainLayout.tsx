import { SidebarProvider } from "@/components/ui/sidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Bell, Search } from "lucide-react";
import LogoutButton from "../../utilities/Logout";
import {
  acceptInvite,
  declineInvite,
  getInvites,
  type OrganizationInvite,
} from "@/services/org";

type InviteResponse = {
  success: boolean;
  count: number;
  data: OrganizationInvite[];
};

export default function MainLayout({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  const {
    data: invitesResponse,
    isLoading: invitesLoading,
    isError: invitesError,
  } = useQuery<InviteResponse>({
    queryKey: ["membershipInvites"],
    queryFn: getInvites,
  });

  const acceptInviteMutation = useMutation({
    mutationFn: acceptInvite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["membershipInvites"] });
      queryClient.invalidateQueries({ queryKey: ["orgs"] });
    },
  });

  const declineInviteMutation = useMutation({
    mutationFn: declineInvite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["membershipInvites"] });
    },
  });

  const invites = invitesResponse?.data ?? [];
  const inviteCount = invites.length;
  const isInviteUpdating =
    acceptInviteMutation.isPending || declineInviteMutation.isPending;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">

        {/* Sidebar */}
        <aside className="w-64 bg-slate-900 border-r border-slate-700 p-6 space-y-6">

          <h2 className="text-xl font-bold text-white">Task Manager</h2>

          <nav className="space-y-2">

            <Link to="/dashboard">
              <Button variant="ghost" className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800">
                Dashboard
              </Button>
            </Link>

            <Link to="/organizations">
              <Button variant="ghost" className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800">
                My Organizations
              </Button>
            </Link>

            <Link to="/tasks">
              <Button variant="ghost" className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800">
                Tasks
              </Button>
            </Link>

            <Link to="/projects">
              <Button variant="ghost" className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800">
                Projects
              </Button>
            </Link>

            <Link to="/settings">
              <Button variant="ghost" className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800">
                Settings
              </Button>
            </Link>

          </nav>

        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">

          {/* Header */}
          <header className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 flex items-center justify-between transition-colors duration-200">

            <div className="flex items-center space-x-4">
              <SidebarTrigger />
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64 transition-colors duration-200"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative"
                    aria-label="Notifications"
                  >
                    <Bell className="h-5 w-5 text-slate-600 dark:text-slate-300" />
                    {inviteCount > 0 && (
                      <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold leading-none text-white">
                        {inviteCount > 9 ? "9+" : inviteCount}
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  align="end"
                  sideOffset={10}
                  className="w-96 overflow-hidden rounded-xl border border-slate-700 bg-slate-950 p-0 text-slate-100 shadow-2xl shadow-black/40"
                >
                  <div className="border-b border-slate-800 bg-slate-900 px-4 py-3">
                    <h3 className="text-sm font-semibold text-slate-50">
                      Pending invites
                    </h3>
                    <p className="text-xs text-slate-400">
                      {inviteCount} waiting
                    </p>
                  </div>

                  <div className="max-h-96 overflow-y-auto">
                    {invitesLoading && (
                      <p className="px-4 py-6 text-sm text-slate-400">
                        Loading invites...
                      </p>
                    )}

                    {invitesError && (
                      <p className="px-4 py-6 text-sm text-red-600">
                        Failed to load invites
                      </p>
                    )}

                    {!invitesLoading && !invitesError && inviteCount === 0 && (
                      <p className="px-4 py-6 text-sm text-slate-400">
                        No pending invites
                      </p>
                    )}

                    {!invitesLoading &&
                      !invitesError &&
                      invites.map((invite) => (
                        <div
                          key={invite._id}
                          className="border-b border-slate-800 bg-slate-950 px-4 py-3 last:border-b-0"
                        >
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-slate-50">
                              {invite.organization.name}
                            </p>
                            <p className="text-xs text-slate-400">
                              Invited by{" "}
                              {invite.invitedBy?.name ||
                                invite.invitedBy?.email ||
                                "Unknown user"}
                            </p>
                            <p className="text-xs capitalize text-slate-400">
                              Role: {invite.role}
                            </p>
                          </div>

                          <div className="mt-3 flex items-center gap-2">
                            <Button
                              size="sm"
                              disabled={isInviteUpdating}
                              onClick={() =>
                                acceptInviteMutation.mutate(invite._id)
                              }
                            >
                              Accept
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={isInviteUpdating}
                              onClick={() =>
                                declineInviteMutation.mutate(invite._id)
                              }
                            >
                              Decline
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                </PopoverContent>
              </Popover>
              <LogoutButton />
            </div>

          </header>

          {/* Page Content */}
          <main className="flex-1 p-6 bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
            {children}
          </main>

        </div>

      </div>
    </SidebarProvider>
  );
}
