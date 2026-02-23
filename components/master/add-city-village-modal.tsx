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
  createCityVillage,
  updateCityVillage,
  getDistricts,
} from "@/services/masterService";
import { toast } from "react-toastify";

interface CityVillageData {
  _id?: string;
  name: string;
  pincode?: string;
  districtId: string;
}

export default function AddCityVillageModal({
  trigger,
  initialData = null,
  open,
  onOpenChange,
}: {
  trigger?: React.ReactNode;
  initialData?: CityVillageData | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const queryClient = useQueryClient();
  const [internalOpen, setInternalOpen] = React.useState(false);
  const [name, setName] = React.useState(initialData?.name || "");

  const [pincode, setPincode] = React.useState(initialData?.pincode || "");
  const [districtId, setDistrictId] = React.useState(
    initialData?.districtId || "",
  );

  const isEditMode = !!initialData?._id;
  const isOpen = open !== undefined ? open : internalOpen;
  const setIsOpen = onOpenChange || setInternalOpen;

  // Fetch districts
  const { data: districts = [], isLoading: isLoadingDistricts } = useQuery({
    queryKey: ["districts"],
    queryFn: getDistricts,
  });

  React.useEffect(() => {
    if (initialData) {
      setName(initialData.name);

      setPincode(initialData.pincode || "");
      setDistrictId(initialData.districtId || "");
    } else {
      setName("");

      setPincode("");
      setDistrictId("");
    }
  }, [initialData, isOpen]);

  const createMutation = useMutation({
    mutationFn: createCityVillage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cityVillages"] });
      toast.success("City/Village created successfully");
      setIsOpen(false);
      setName("");

      setPincode("");
      setDistrictId("");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create City/Village");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CityVillageData>;
    }) => updateCityVillage(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cityVillages"] });
      toast.success("City/Village updated successfully");
      setIsOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update City/Village");
    },
  });

  const handleSave = () => {
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }

    if (!districtId) {
      toast.error("District is required");
      return;
    }

    const data = {
      name: name.trim(),

      pincode: pincode.trim(),
      districtId: districtId,
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
            {isEditMode ? "Edit City/Village" : "Add City/Village"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold block mb-2 text-gray-700">
                District *
              </label>
              <Select
                value={districtId}
                onValueChange={setDistrictId}
                disabled={isPending || isLoadingDistricts}
              >
                <SelectTrigger className="w-full border-2 !border-gray-300">
                  <SelectValue
                    placeholder={
                      isLoadingDistricts
                        ? "Loading districts..."
                        : "Select District"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {districts.map((district: any) => (
                    <SelectItem key={district._id} value={district._id}>
                      {district.districtName || district.name || "Unnamed"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-xs font-semibold block mb-2 text-gray-700">
                Name *
              </label>
              <Input
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border-2 !border-gray-300"
                disabled={isPending}
              />
            </div>

            <div>
              <label className="text-xs font-semibold block mb-2 text-gray-700">
                Pincode
              </label>
              <Input
                placeholder="Enter pincode"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                className="w-full border-2 !border-gray-300"
                disabled={isPending}
              />
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
                  ? "Update City/Village"
                  : "Add City/Village"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

