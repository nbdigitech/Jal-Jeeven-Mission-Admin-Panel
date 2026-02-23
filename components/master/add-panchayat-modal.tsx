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
  createPanchayat,
  updatePanchayat,
  getDistricts,
  getBlocks,
  getCityVillages,
} from "@/services/masterService";
import { toast } from "react-toastify";

export interface PanchayatData {
  _id?: string;
  panchayatName: string;
  districtId: string;
  blockId: string;
  cityVillageId: string;
  sarpanchName?: string;
  sarpanchContact?: string;
  panchayatSecretaryName?: string;
  panchayatSecretaryContact?: string;
  zilaPanchayatName?: string;
  janpadPanchayatName?: string;
  status?: string;
}

export default function AddPanchayatModal({
  trigger,
  initialData = null,
  open,
  onOpenChange,
}: {
  trigger?: React.ReactNode;
  initialData?: PanchayatData | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const queryClient = useQueryClient();
  const [internalOpen, setInternalOpen] = React.useState(false);

  const [panchayatName, setPanchayatName] = React.useState(
    initialData?.panchayatName || "",
  );
  const [districtId, setDistrictId] = React.useState(
    initialData?.districtId || "",
  );
  const [blockId, setBlockId] = React.useState(initialData?.blockId || "");
  const [cityVillageId, setCityVillageId] = React.useState(
    initialData?.cityVillageId || "",
  );

  const [zilaPanchayatName, setZilaPanchayatName] = React.useState(
    initialData?.zilaPanchayatName || "",
  );
  const [janpadPanchayatName, setJanpadPanchayatName] = React.useState(
    initialData?.janpadPanchayatName || "",
  );

  const [sarpanchName, setSarpanchName] = React.useState(
    initialData?.sarpanchName || "",
  );
  const [sarpanchContact, setSarpanchContact] = React.useState(
    initialData?.sarpanchContact || "",
  );

  const [secretaryName, setSecretaryName] = React.useState(
    initialData?.panchayatSecretaryName || "",
  );
  const [secretaryContact, setSecretaryContact] = React.useState(
    initialData?.panchayatSecretaryContact || "",
  );

  const isEditMode = !!initialData?._id;
  const isOpen = open !== undefined ? open : internalOpen;
  const setIsOpen = onOpenChange || setInternalOpen;

  // Fetch Dropdown Data
  const { data: districts = [] } = useQuery({
    queryKey: ["districts"],
    queryFn: getDistricts,
  });
  const { data: blocks = [] } = useQuery({
    queryKey: ["blocks"],
    queryFn: () => getBlocks(),
  });
  const { data: cityVillages = [] } = useQuery({
    queryKey: ["cityVillages"],
    queryFn: getCityVillages,
  });

  React.useEffect(() => {
    if (initialData) {
      setPanchayatName(initialData.panchayatName);
      setDistrictId(initialData.districtId);
      setBlockId(initialData.blockId);
      setCityVillageId(initialData.cityVillageId);
      setZilaPanchayatName(initialData.zilaPanchayatName || "");
      setJanpadPanchayatName(initialData.janpadPanchayatName || "");
      setSarpanchName(initialData.sarpanchName || "");
      setSarpanchContact(initialData.sarpanchContact || "");
      setSecretaryName(initialData.panchayatSecretaryName || "");
      setSecretaryContact(initialData.panchayatSecretaryContact || "");
    } else {
      setPanchayatName("");
      setDistrictId("");
      setBlockId("");
      setCityVillageId("");
      setZilaPanchayatName("");
      setJanpadPanchayatName("");
      setSarpanchName("");
      setSarpanchContact("");
      setSecretaryName("");
      setSecretaryContact("");
    }
  }, [initialData, isOpen]);

  const createMutation = useMutation({
    mutationFn: createPanchayat,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["panchayats"] });
      toast.success("Panchayat created successfully");
      setIsOpen(false);
      // Reset form
      setPanchayatName("");
      setDistrictId("");
      setBlockId("");
      setCityVillageId("");
      setZilaPanchayatName("");
      setJanpadPanchayatName("");
      setSarpanchName("");
      setSarpanchContact("");
      setSecretaryName("");
      setSecretaryContact("");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create Panchayat");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PanchayatData> }) =>
      updatePanchayat(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["panchayats"] });
      toast.success("Panchayat updated successfully");
      setIsOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update Panchayat");
    },
  });

  const handleSave = () => {
    if (!panchayatName || !districtId || !blockId || !cityVillageId) {
      toast.error("Please fill all required fields");
      return;
    }

    const data = {
      panchayatName,
      districtId,
      blockId,
      cityVillageId,
      zilaPanchayatName,
      janpadPanchayatName,
      sarpanchName,
      sarpanchContact,
      panchayatSecretaryName: secretaryName,
      panchayatSecretaryContact: secretaryContact,
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

      <DialogContent className="max-w-xl rounded-xl p-0 overflow-hidden flex flex-col max-h-[90vh]">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-2xl font-bold text-gray-900">
            {isEditMode ? "Edit Panchayat" : "Add Panchayat"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-500">
              Panchayat Name *
            </label>
            <Input
              placeholder="e.g. Gram Panchayat A"
              value={panchayatName}
              onChange={(e) => setPanchayatName(e.target.value)}
              disabled={isPending}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-500">
                District *
              </label>
              <Select
                value={districtId}
                onValueChange={setDistrictId}
                disabled={isPending}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select District" />
                </SelectTrigger>
                <SelectContent>
                  {districts.map((d: any) => (
                    <SelectItem key={d._id} value={d._id}>
                      {d.districtName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-500">
                Block *
              </label>
              <Select
                value={blockId}
                onValueChange={setBlockId}
                disabled={isPending}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Block" />
                </SelectTrigger>
                <SelectContent>
                  {blocks.map((b: any) => (
                    <SelectItem key={b._id} value={b._id}>
                      {b.blockName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-500">
              City/Village *
            </label>
            <Select
              value={cityVillageId}
              onValueChange={setCityVillageId}
              disabled={isPending}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select City/Village" />
              </SelectTrigger>
              <SelectContent>
                {cityVillages.map((cv: any) => (
                  <SelectItem key={cv._id} value={cv._id}>
                    {cv.name} ({cv.type})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-500">
                Zila Panchayat
              </label>
              <Input
                placeholder="e.g. Zila Panchayat A"
                value={zilaPanchayatName}
                onChange={(e) => setZilaPanchayatName(e.target.value)}
                disabled={isPending}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-500">
                Janpad Panchayat
              </label>
              <Input
                placeholder="e.g. Janpad Panchayat B"
                value={janpadPanchayatName}
                onChange={(e) => setJanpadPanchayatName(e.target.value)}
                disabled={isPending}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-500">
                Sarpanch Name
              </label>
              <Input
                value={sarpanchName}
                onChange={(e) => setSarpanchName(e.target.value)}
                disabled={isPending}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-500">
                Sarpanch Mobile
              </label>
              <Input
                value={sarpanchContact}
                onChange={(e) => setSarpanchContact(e.target.value)}
                disabled={isPending}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-500">
                Secretary Name
              </label>
              <Input
                value={secretaryName}
                onChange={(e) => setSecretaryName(e.target.value)}
                disabled={isPending}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-500">
                Secretary Mobile
              </label>
              <Input
                value={secretaryContact}
                onChange={(e) => setSecretaryContact(e.target.value)}
                disabled={isPending}
              />
            </div>
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
