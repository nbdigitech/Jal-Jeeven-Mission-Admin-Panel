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
import { createDepartment, updateDepartment } from "@/services/masterService";
import { toast } from "react-toastify";

interface DepartmentData {
  _id?: string;
  departmentName: string;
}

export default function AddDepartmentModal({
  trigger,
  initialData = null,
  open,
  onOpenChange,
}: {
  trigger?: React.ReactNode;
  initialData?: DepartmentData | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const queryClient = useQueryClient();
  const [internalOpen, setInternalOpen] = React.useState(false);

  const [departmentName, setDepartmentName] = React.useState(
    initialData?.departmentName || "",
  );

  const isEditMode = !!initialData?._id;
  const isOpen = open !== undefined ? open : internalOpen;
  const setIsOpen = onOpenChange || setInternalOpen;

  React.useEffect(() => {
    if (initialData) {
      setDepartmentName(initialData.departmentName);
    } else {
      setDepartmentName("");
    }
  }, [initialData, isOpen]);

  const createMutation = useMutation({
    mutationFn: createDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      toast.success("Department created successfully");
      setIsOpen(false);
      setDepartmentName("");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create Department");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<DepartmentData> }) =>
      updateDepartment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      toast.success("Department updated successfully");
      setIsOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update Department");
    },
  });

  const handleSave = () => {
    if (!departmentName.trim()) {
      toast.error("Department name is required");
      return;
    }

    const data = {
      departmentName: departmentName.trim(),
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

      <DialogContent className="max-w-md rounded-xl p-0 overflow-hidden flex flex-col max-h-[90vh]">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-2xl font-bold text-gray-900">
            {isEditMode ? "Edit Department" : "Add Department"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-500">
              Department Name *
            </label>
            <Input
              placeholder="e.g. Health Department"
              value={departmentName}
              onChange={(e) => setDepartmentName(e.target.value)}
              disabled={isPending}
            />
          </div>
        </div>

        <div className="p-6 pt-2">
          <Button
            onClick={handleSave}
            disabled={isPending}
            className="w-full bg-[#F87B1B] hover:bg-[#e86f12] text-white h-12 rounded-lg font-semibold"
          >
            {isPending ? "Saving..." : "Submit"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
