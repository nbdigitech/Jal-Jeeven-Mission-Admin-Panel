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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createWorkType, updateWorkType } from "@/services/masterService";
import { toast } from "react-toastify";

interface WorkTypeData {
  _id?: string;
  workTypeName: string;
}

export default function AddWorkCategoryModal({
  trigger,
  initialData = null,
  open,
  onOpenChange,
}: {
  trigger?: React.ReactNode;
  initialData?: WorkTypeData | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const queryClient = useQueryClient();
  const [internalOpen, setInternalOpen] = React.useState(false);
  const [workTypeName, setWorkTypeName] = React.useState(
    initialData?.workTypeName || "",
  );

  const isEditMode = !!initialData?._id;
  const isOpen = open !== undefined ? open : internalOpen;
  const setIsOpen = onOpenChange || setInternalOpen;

  React.useEffect(() => {
    if (initialData) {
      setWorkTypeName(initialData.workTypeName);
    } else {
      setWorkTypeName("");
    }
  }, [initialData, isOpen]);

  const createMutation = useMutation({
    mutationFn: createWorkType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workTypes"] });
      toast.success("Work Type created successfully");
      setIsOpen(false);
      setWorkTypeName("");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create Work Type");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<WorkTypeData> }) =>
      updateWorkType(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workTypes"] });
      toast.success("Work Type updated successfully");
      setIsOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update Work Type");
    },
  });

  const handleSave = () => {
    if (!workTypeName.trim()) {
      toast.error("Work Type Name is required");
      return;
    }

    const data = {
      workTypeName: workTypeName.trim(),
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
            {isEditMode ? "Edit Work Type" : "Add Work Type"}
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-500">
              Work Type Name *
            </label>
            <Input
              placeholder="e.g. Civil Work"
              value={workTypeName}
              onChange={(e) => setWorkTypeName(e.target.value)}
              disabled={isPending}
            />
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

