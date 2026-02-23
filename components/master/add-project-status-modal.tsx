"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createProjectStatus,
  updateProjectStatus,
} from "@/services/masterService";
import { toast } from "react-toastify";

interface ProjectStatusData {
  _id?: string;
  statusName: string;
  status: string;
}

export default function AddProjectStatusModal({
  trigger,
  initialData = null,
  open,
  onOpenChange,
}: {
  trigger?: React.ReactNode;
  initialData?: ProjectStatusData | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const queryClient = useQueryClient();
  const [internalOpen, setInternalOpen] = React.useState(false);
  const [statusName, setStatusName] = React.useState(
    initialData?.statusName || "",
  );
  const [selectedStatus, setSelectedStatus] = React.useState(
    initialData?.status || "active",
  );

  const isEditMode = !!initialData?._id;
  const isOpen = open !== undefined ? open : internalOpen;
  const setIsOpen = onOpenChange || setInternalOpen;

  React.useEffect(() => {
    if (initialData) {
      setStatusName(initialData.statusName);
      setSelectedStatus(initialData.status);
    } else {
      setStatusName("");
      setSelectedStatus("active");
    }
  }, [initialData, isOpen]);

  const createMutation = useMutation({
    mutationFn: createProjectStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projectStatuses"] });
      toast.success("Project Status created successfully");
      setIsOpen(false);
      setStatusName("");
      setSelectedStatus("active");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create Project Status");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<ProjectStatusData>;
    }) => updateProjectStatus(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projectStatuses"] });
      toast.success("Project Status updated successfully");
      setIsOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update Project Status");
    },
  });

  const handleSave = () => {
    if (!statusName.trim()) {
      toast.error("Status Name is required");
      return;
    }

    const data = {
      statusName: statusName.trim(),
      status: selectedStatus,
    };

    if (isEditMode && initialData?._id) {
      updateMutation.mutate({ id: initialData._id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

      <DialogContent className="max-w-md rounded-xl p-0 overflow-hidden flex flex-col">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-2xl font-bold text-gray-900">
            {isEditMode ? "Edit Project Status" : "Add Project Status"}
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-500">
              Status Name *
            </label>
            <Input
              placeholder="e.g. In Progress"
              value={statusName}
              onChange={(e) => setStatusName(e.target.value)}
              disabled={isPending}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-500">Status</label>
            <Select
              value={selectedStatus}
              onValueChange={setSelectedStatus}
              disabled={isPending}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="p-6 pt-2">
          <Button
            onClick={handleSave}
            disabled={isPending}
            className="w-full bg-[#136FB6] hover:bg-[#105E9A] text-white h-12 rounded-lg font-semibold"
          >
            {isPending ? "Saving..." : "Submit"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

