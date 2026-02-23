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
  createBlock,
  updateBlock,
  getDistricts,
} from "@/services/masterService";
import { toast } from "react-toastify";

interface BlockData {
  _id?: string;
  blockName: string;
  districtId: string; // Changed from stateId
  district?: {
    _id: string;
    districtName: string;
  };
}

export default function AddBlockModal({
  trigger,
  initialData = null,
  open,
  onOpenChange,
}: {
  trigger?: React.ReactNode;
  initialData?: BlockData | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const queryClient = useQueryClient();
  const [internalOpen, setInternalOpen] = React.useState(false);
  const [focusedField, setFocusedField] = React.useState<string | null>(null);
  const [blockName, setBlockName] = React.useState(
    initialData?.blockName || "",
  );
  const [selectedDistrictId, setSelectedDistrictId] = React.useState(
    initialData?.districtId || "",
  );

  const isEditMode = !!initialData?._id;
  const isOpen = open !== undefined ? open : internalOpen;
  const setIsOpen = onOpenChange || setInternalOpen;

  // Fetch districts for dropdown
  const { data: districts = [] } = useQuery({
    queryKey: ["districts"],
    queryFn: getDistricts,
  });

  React.useEffect(() => {
    if (initialData) {
      setBlockName(initialData.blockName || "");
      setSelectedDistrictId(initialData.districtId || "");
    } else {
      setBlockName("");
      setSelectedDistrictId("");
    }
  }, [initialData, isOpen]);

  const createMutation = useMutation({
    mutationFn: createBlock,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blocks"] });
      toast.success("Block created successfully");
      setIsOpen(false);
      setBlockName("");
      setSelectedDistrictId("");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create block");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<BlockData> }) =>
      updateBlock(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blocks"] });
      toast.success("Block updated successfully");
      setIsOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update block");
    },
  });

  const handleSave = () => {
    if (!blockName.trim()) {
      toast.error("Block name is required");
      return;
    }

    if (!selectedDistrictId) {
      toast.error("Please select a district");
      return;
    }

    const data = {
      blockName: blockName.trim(),
      districtId: selectedDistrictId,
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
            {isEditMode ? "Edit Block" : "Add Block"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <div>
              <label
                className={`text-xs font-semibold block mb-2 transition ${
                  focusedField === "blockName"
                    ? "text-[#136FB6]"
                    : "text-gray-700"
                }`}
              >
                Block Name *
              </label>
              <Input
                placeholder="Enter block name"
                value={blockName}
                onChange={(e) => setBlockName(e.target.value)}
                className={`w-full border-2 transition ${
                  focusedField === "blockName"
                    ? "!border-[#136FB6]"
                    : "!border-gray-300"
                }`}
                onFocus={() => setFocusedField("blockName")}
                onBlur={() => setFocusedField(null)}
                disabled={isPending}
              />
            </div>

            <div>
              <label className="text-xs font-semibold block mb-2 text-gray-700">
                District *
              </label>
              <Select
                value={selectedDistrictId}
                onValueChange={setSelectedDistrictId}
                disabled={isPending}
              >
                <SelectTrigger className="w-full border-2 !border-gray-300">
                  <SelectValue placeholder="Select district" />
                </SelectTrigger>
                <SelectContent>
                  {districts.map((district: any) => (
                    <SelectItem key={district._id} value={district._id}>
                      {district.districtName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
                  ? "Update Block"
                  : "Add Block"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

