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
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createDistrict,
  updateDistrict,
  getStates as getQueryStates,
} from "@/services/masterService";
import { toast } from "react-toastify";

interface DistrictData {
  _id?: string;
  districtName: string;
  status?: string;
  stateId?: string; // Added stateId
}

export default function AddDistrictModal({
  trigger,
  initialData = null,
  open,
  onOpenChange,
}: {
  trigger?: React.ReactNode;
  initialData?: DistrictData | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const queryClient = useQueryClient();
  const [internalOpen, setInternalOpen] = React.useState(false);
  const [districtName, setDistrictName] = React.useState(
    initialData?.districtName || "",
  );
  const [selectedStatus, setSelectedStatus] = React.useState(
    initialData?.status || "active",
  );
  const [selectedStateId, setSelectedStateId] = React.useState(
    "", // No initial data stateId support yet, need to update interface
  );

  const isEditMode = !!initialData?._id;
  const isOpen = open !== undefined ? open : internalOpen;
  const setIsOpen = onOpenChange || setInternalOpen;

  // Fetch states
  const { data: states = [] } = useQuery({
    queryKey: ["states"],
    queryFn: getQueryStates, // renamed to avoid conflict if I imported getStates
  });

  React.useEffect(() => {
    if (initialData) {
      setDistrictName(initialData.districtName);
      setSelectedStatus(initialData.status || "active");
      setSelectedStateId(initialData.stateId || "");
    } else {
      setDistrictName("");
      setSelectedStatus("active");
      setSelectedStateId("");
    }
  }, [initialData, isOpen]);

  const createMutation = useMutation({
    mutationFn: createDistrict,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["districts"] });
      toast.success("District created successfully");
      setIsOpen(false);
      setDistrictName("");
      setSelectedStatus("active");
      setSelectedStateId("");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create district");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<DistrictData> }) =>
      updateDistrict(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["districts"] });
      toast.success("District updated successfully");
      setIsOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update district");
    },
  });

  const handleSave = () => {
    if (!districtName.trim()) {
      toast.error("District name is required");
      return;
    }

    if (!selectedStateId) {
      toast.error("State is required");
      return;
    }

    const data = {
      districtName: districtName.trim(),
      stateId: selectedStateId,
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

      <DialogContent className="max-w-2xl rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {isEditMode ? "Edit District" : "Add District"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold block mb-2 text-gray-700">
                State *
              </label>
              <Select
                value={selectedStateId}
                onValueChange={setSelectedStateId}
                disabled={isPending}
              >
                <SelectTrigger className="w-full border-2 !border-gray-300">
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {states.map((state: any) => (
                    <SelectItem key={state._id} value={state._id}>
                      {state.stateName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-xs font-semibold block mb-2 text-gray-700">
                District Name *
              </label>
              <Input
                placeholder="Enter district name"
                value={districtName}
                onChange={(e) => setDistrictName(e.target.value)}
                className="w-full border-2 !border-gray-300"
                disabled={isPending}
              />
            </div>

            <div>
              <label className="text-xs font-semibold block mb-2 text-gray-700">
                Status
              </label>
              <Select
                value={selectedStatus}
                onValueChange={setSelectedStatus}
                disabled={isPending}
              >
                <SelectTrigger className="w-full border-2 !border-gray-300">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
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
                  ? "Update District"
                  : "Add District"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

