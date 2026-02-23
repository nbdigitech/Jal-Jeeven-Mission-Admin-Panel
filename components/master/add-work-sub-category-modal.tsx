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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createWorkSubtype,
  updateWorkSubtype,
  getWorkTypes,
} from "@/services/masterService";
import { toast } from "react-toastify";

interface WorkSubtypeData {
  _id?: string;
  workSubtypeName: string;
  parentWorkTypeId: string;
}

export default function AddWorkSubCategoryModal({
  trigger,
  initialData = null,
  open,
  onOpenChange,
}: {
  trigger?: React.ReactNode;
  initialData?: WorkSubtypeData | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const queryClient = useQueryClient();
  const [internalOpen, setInternalOpen] = React.useState(false);

  const [subtypeName, setSubtypeName] = React.useState(
    initialData?.workSubtypeName || "",
  );
  const [parentWorkTypeId, setParentWorkTypeId] = React.useState(
    initialData?.parentWorkTypeId || "",
  );

  const isEditMode = !!initialData?._id;
  const isOpen = open !== undefined ? open : internalOpen;
  const setIsOpen = onOpenChange || setInternalOpen;

  const { data: workTypes = [] } = useQuery({
    queryKey: ["workTypes"],
    queryFn: getWorkTypes,
  });

  React.useEffect(() => {
    if (initialData) {
      setSubtypeName(initialData.workSubtypeName);
      setParentWorkTypeId(initialData.parentWorkTypeId);
    } else {
      setSubtypeName("");
      setParentWorkTypeId("");
    }
  }, [initialData, isOpen]);

  const createMutation = useMutation({
    mutationFn: createWorkSubtype,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workSubtypes"] });
      toast.success("Work Subtype created successfully");
      setIsOpen(false);
      setSubtypeName("");
      setParentWorkTypeId("");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create Work Subtype");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<WorkSubtypeData>;
    }) => updateWorkSubtype(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workSubtypes"] });
      toast.success("Work Subtype updated successfully");
      setIsOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update Work Subtype");
    },
  });

  const handleSave = () => {
    if (!subtypeName.trim() || !parentWorkTypeId) {
      toast.error("Subtype Name and Parent Work Type are required");
      return;
    }

    const data = {
      workSubtypeName: subtypeName.trim(),
      parentWorkTypeId,
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
            {isEditMode ? "Edit Work Sub Category" : "Add Work Sub Category"}
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-500">
              Parent Work Type *
            </label>
            <Select
              value={parentWorkTypeId}
              onValueChange={setParentWorkTypeId}
              disabled={isPending}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Parent Work Type" />
              </SelectTrigger>
              <SelectContent>
                {workTypes.map((wt: any) => (
                  <SelectItem key={wt._id} value={wt._id}>
                    {wt.workTypeName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-500">
              Sub Category Name *
            </label>
            <Input
              placeholder="e.g. Building Construction"
              value={subtypeName}
              onChange={(e) => setSubtypeName(e.target.value)}
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

