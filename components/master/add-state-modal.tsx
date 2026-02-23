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
import { createState, updateState } from "@/services/masterService";
import { toast } from "react-toastify";

interface StateData {
  _id?: string;
  stateName: string;
  stateCode?: string;
}

export default function AddStateModal({
  trigger,
  initialData = null,
  open,
  onOpenChange,
}: {
  trigger?: React.ReactNode;
  initialData?: StateData | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const queryClient = useQueryClient();
  const [internalOpen, setInternalOpen] = React.useState(false);
  const [focusedField, setFocusedField] = React.useState<string | null>(null);
  const [stateName, setStateName] = React.useState(
    initialData?.stateName || "",
  );
  const [stateCode, setStateCode] = React.useState(
    initialData?.stateCode || "",
  );

  const isEditMode = !!initialData?._id;
  const isOpen = open !== undefined ? open : internalOpen;
  const setIsOpen = onOpenChange || setInternalOpen;

  React.useEffect(() => {
    if (initialData) {
      setStateName(initialData.stateName || "");
      setStateCode(initialData.stateCode || "");
    } else {
      setStateName("");
      setStateCode("");
    }
  }, [initialData, isOpen]);

  const createMutation = useMutation({
    mutationFn: createState,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["states"] });
      toast.success("State created successfully");
      setIsOpen(false);
      setStateName("");
      setStateCode("");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create state");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<StateData> }) =>
      updateState(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["states"] });
      toast.success("State updated successfully");
      setIsOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update state");
    },
  });

  const handleSave = () => {
    if (!stateName.trim()) {
      toast.error("State name is required");
      return;
    }

    const data = {
      stateName: stateName.trim(),
      stateCode: stateCode.trim() || undefined,
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

      <DialogContent className="max-w-2xl rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {isEditMode ? "Edit State" : "Add State"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <div>
              <label
                className={`text-xs font-semibold block mb-2 transition ${
                  focusedField === "stateName"
                    ? "text-[#136FB6]"
                    : "text-gray-700"
                }`}
              >
                State Name *
              </label>
              <Input
                placeholder="Enter state name"
                value={stateName}
                onChange={(e) => setStateName(e.target.value)}
                className={`w-full border-2 transition ${
                  focusedField === "stateName"
                    ? "!border-[#136FB6]"
                    : "!border-gray-300"
                }`}
                onFocus={() => setFocusedField("stateName")}
                onBlur={() => setFocusedField(null)}
                disabled={isPending}
              />
            </div>

            {/* <div>
              <label
                className={`text-xs font-semibold block mb-2 transition ${
                  focusedField === "stateCode"
                    ? "text-[#136FB6]"
                    : "text-gray-700"
                }`}
              >
                State Code (Optional)
              </label>
              <Input
                placeholder="Enter state code (e.g., CG)"
                value={stateCode}
                onChange={(e) => setStateCode(e.target.value)}
                className={`w-full border-2 transition ${
                  focusedField === "stateCode"
                    ? "!border-[#136FB6]"
                    : "!border-gray-300"
                }`}
                onFocus={() => setFocusedField("stateCode")}
                onBlur={() => setFocusedField(null)}
                disabled={isPending}
              />
            </div> */}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              className="border-2"
              onClick={() => setIsOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-[#136FB6] hover:bg-[#136FB6]/90 text-white"
              disabled={isPending}
            >
              {isPending
                ? "Saving..."
                : isEditMode
                  ? "Update State"
                  : "Add State"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

