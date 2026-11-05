import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { format } from "date-fns";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { getMembersOfOrg } from "@/services/org";
import {
  createTask,
  getTasksOfOrg,
  updateTask,
  type Task,
  type UpdateTaskPayload,
} from "@/services/tasks";

type OrgMember = {
  _id: string;
  user: {
    name: string;
    email: string;
    _id: string;
  };
};

type TaskForm = {
  name: string;
  description: string;
  assignedTo: string;
  priority: string;
  dueDate: string;
};

type TasksResponse = {
  success: boolean;
  data: Task[];
};

export default function Tasks() {
  const queryClient = useQueryClient();
  const orgId = localStorage.getItem("orgId");
  const [usersOrg, setUsers] = useState<OrgMember[]>([]);
  const [date, setDate] = useState<Date | undefined>();
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<UpdateTaskPayload>({});

  const { register, handleSubmit, setValue, control, reset } =
    useForm<TaskForm>({
      defaultValues: {
        name: "",
        description: "",
        assignedTo: "",
        priority: "",
        dueDate: "",
      },
    });

  const {
    data: tasksResponse,
    isLoading: tasksLoading,
    isError: tasksError,
  } = useQuery<TasksResponse>({
    queryKey: ["tasks", orgId],
    queryFn: () => getTasksOfOrg(orgId as string),
    enabled: Boolean(orgId),
  });

  const tasks = tasksResponse?.data ?? [];

  const onSubmit = async (data: TaskForm) => {
    try {
      await createTask(data);
      reset();
      setDate(undefined);
      queryClient.invalidateQueries({ queryKey: ["tasks", orgId] });
    } catch (err) {
      console.error(err);
      alert("Failed to create task");
    }
  };

  const startEdit = (task: Task) => {
    setEditingTaskId(task._id);
    setEditForm({
      name: task.name,
      description: task.description ?? "",
      assignedTo: task.assignedTo?._id ?? "",
      status: task.status,
      priority: task.priority,
    });
  };

  const cancelEdit = () => {
    setEditingTaskId(null);
    setEditForm({});
  };

  const saveTask = async (taskId: string) => {
    if (!orgId) return;

    try {
      await updateTask(orgId, taskId, editForm);
      cancelEdit();
      queryClient.invalidateQueries({ queryKey: ["tasks", orgId] });
    } catch (err) {
      console.error(err);
      alert("Failed to update task");
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getMembersOfOrg();
        setUsers(data?.data ?? []);
      } catch (error) {
        console.error("Error in fetching users", error);
      }
    };

    if (orgId) {
      fetchUsers();
    }
  }, [orgId]);

  const priorities = [
    { label: "Low", value: "low" },
    { label: "Medium", value: "medium" },
    { label: "High", value: "high" },
  ];
  const statuses = [
    { label: "Todo", value: "todo" },
    { label: "In Progress", value: "in_progress" },
    { label: "Done", value: "done" },
  ];

  return (
    <div className="space-y-8">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 rounded-lg border border-slate-700 bg-slate-900 p-4"
      >
        <div>
          <h2 className="text-xl font-semibold text-slate-100">Create Task</h2>
          <p className="text-sm text-slate-400">
            Assign a task inside the selected organization.
          </p>
        </div>

        <Input
          placeholder="Task Name"
          {...register("name", { required: "Task name is required" })}
          className="border-slate-700 bg-slate-950 text-slate-100"
        />

        <textarea
          placeholder="Description"
          {...register("description")}
          className="min-h-24 w-full rounded-md border border-slate-700 bg-slate-950 p-2 text-sm text-slate-100 outline-none focus:ring-2 focus:ring-slate-500"
        />

        <Controller
          control={control}
          name="assignedTo"
          rules={{ required: "User is required" }}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="border-slate-700 bg-slate-950 text-slate-100">
                <SelectValue placeholder="Assign to user" />
              </SelectTrigger>

              <SelectContent className="border-slate-700 bg-slate-950 text-slate-100 shadow-2xl">
                {usersOrg.map((u) => (
                  <SelectItem key={u.user._id} value={u.user._id}>
                    {u.user.name} ({u.user.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />

        <Controller
          control={control}
          name="priority"
          rules={{ required: "Priority is required" }}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="border-slate-700 bg-slate-950 text-slate-100">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>

              <SelectContent className="border-slate-700 bg-slate-950 text-slate-100 shadow-2xl">
                {priorities.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />

        <input type="hidden" {...register("dueDate", { required: true })} />

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start">
              {date ? format(date, "PPP") : "Pick a due date"}
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-auto border-slate-700 bg-slate-950 p-0">
            <Calendar
              mode="single"
              className="bg-slate-950 text-slate-100"
              selected={date}
              onSelect={(selectedDate) => {
                setDate(selectedDate);

                if (selectedDate) {
                  setValue("dueDate", selectedDate.toISOString());
                }
              }}
              disabled={(calendarDate) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return calendarDate < today;
              }}
              autoFocus
            />
          </PopoverContent>
        </Popover>

        <Button className="w-full" type="submit" disabled={!orgId}>
          Create Task
        </Button>
      </form>

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-100">Tasks</h2>
          <p className="text-sm text-slate-400">
            Tasks for the selected organization.
          </p>
        </div>

        {!orgId && (
          <div className="rounded-lg border border-slate-700 bg-slate-900 p-4 text-sm text-slate-300">
            Select an organization first to view tasks.
          </div>
        )}

        {orgId && tasksLoading && (
          <div className="rounded-lg border border-slate-700 bg-slate-900 p-4 text-sm text-slate-300">
            Loading tasks...
          </div>
        )}

        {orgId && tasksError && (
          <div className="rounded-lg border border-red-900 bg-red-950/40 p-4 text-sm text-red-200">
            Failed to load tasks.
          </div>
        )}

        {orgId && !tasksLoading && !tasksError && tasks.length === 0 && (
          <div className="rounded-lg border border-slate-700 bg-slate-900 p-4 text-sm text-slate-300">
            No tasks found.
          </div>
        )}

        {orgId && !tasksLoading && !tasksError && tasks.length > 0 && (
          <div className="space-y-3">
            {tasks.map((task) => (
              <article
                key={task._id}
                className="rounded-lg border border-slate-700 bg-slate-900 p-4 text-slate-100 shadow-sm"
              >
                {editingTaskId === task._id ? (
                  <div className="space-y-3">
                    <Input
                      value={editForm.name ?? ""}
                      onChange={(event) =>
                        setEditForm((current) => ({
                          ...current,
                          name: event.target.value,
                        }))
                      }
                      className="border-slate-700 bg-slate-950 text-slate-100"
                    />

                    <textarea
                      value={editForm.description ?? ""}
                      onChange={(event) =>
                        setEditForm((current) => ({
                          ...current,
                          description: event.target.value,
                        }))
                      }
                      className="min-h-20 w-full rounded-md border border-slate-700 bg-slate-950 p-2 text-sm text-slate-100 outline-none focus:ring-2 focus:ring-slate-500"
                    />

                    <div className="grid gap-3 md:grid-cols-3">
                      <Select
                        value={editForm.assignedTo ?? ""}
                        onValueChange={(value) =>
                          setEditForm((current) => ({
                            ...current,
                            assignedTo: value,
                          }))
                        }
                      >
                        <SelectTrigger className="border-slate-700 bg-slate-950 text-slate-100">
                          <SelectValue placeholder="Assign to user" />
                        </SelectTrigger>
                        <SelectContent className="border-slate-700 bg-slate-950 text-slate-100 shadow-2xl">
                          {usersOrg.map((u) => (
                            <SelectItem key={u.user._id} value={u.user._id}>
                              {u.user.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select
                        value={editForm.status ?? ""}
                        onValueChange={(value) =>
                          setEditForm((current) => ({
                            ...current,
                            status: value,
                          }))
                        }
                      >
                        <SelectTrigger className="border-slate-700 bg-slate-950 text-slate-100">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent className="border-slate-700 bg-slate-950 text-slate-100 shadow-2xl">
                          {statuses.map((status) => (
                            <SelectItem key={status.value} value={status.value}>
                              {status.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select
                        value={editForm.priority ?? ""}
                        onValueChange={(value) =>
                          setEditForm((current) => ({
                            ...current,
                            priority: value,
                          }))
                        }
                      >
                        <SelectTrigger className="border-slate-700 bg-slate-950 text-slate-100">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent className="border-slate-700 bg-slate-950 text-slate-100 shadow-2xl">
                          {priorities.map((priority) => (
                            <SelectItem
                              key={priority.value}
                              value={priority.value}
                            >
                              {priority.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button variant="outline" type="button" onClick={cancelEdit}>
                        Cancel
                      </Button>
                      <Button type="button" onClick={() => saveTask(task._id)}>
                        Save
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-semibold">{task.name}</h3>
                        {task.description && (
                          <p className="mt-1 text-sm text-slate-400">
                            {task.description}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-medium capitalize text-slate-200">
                          {task.status.replace("_", " ")}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          type="button"
                          onClick={() => startEdit(task)}
                        >
                          Edit
                        </Button>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-2 text-sm text-slate-400 md:grid-cols-3">
                      <p>
                        Assigned:{" "}
                        <span className="text-slate-200">
                          {task.assignedTo?.name || "Unassigned"}
                        </span>
                      </p>
                      <p className="capitalize">
                        Priority:{" "}
                        <span className="text-slate-200">{task.priority}</span>
                      </p>
                      <p>
                        Due:{" "}
                        <span className="text-slate-200">
                          {task.dueDate
                            ? format(new Date(task.dueDate), "PPP")
                            : "No due date"}
                        </span>
                      </p>
                    </div>
                  </>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
