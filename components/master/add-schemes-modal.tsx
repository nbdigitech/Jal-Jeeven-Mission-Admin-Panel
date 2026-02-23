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
  createScheme,
  updateScheme,
  getDepartments,
} from "@/services/masterService";
import { toast } from "react-toastify";

interface SchemeData {
  _id?: string;
  schemeName: string;
  fundingSource: string;
  departmentId: string;
  financialYear: string;
  remarks?: string;
}

export default function AddSchemesModal({
  trigger,
  initialData = null,
  open,
  onOpenChange,
}: {
  trigger?: React.ReactNode;
  initialData?: SchemeData | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const queryClient = useQueryClient();
  const [internalOpen, setInternalOpen] = React.useState(false);

  const [schemeName, setSchemeName] = React.useState(
    initialData?.schemeName || "",
  );
  const [fundingSource, setFundingSource] = React.useState(
    initialData?.fundingSource || "",
  );
  const [departmentId, setDepartmentId] = React.useState(
    initialData?.departmentId || "",
  );
  const [financialYear, setFinancialYear] = React.useState(
    initialData?.financialYear || "",
  );
  const [remarks, setRemarks] = React.useState(initialData?.remarks || "");

  const isEditMode = !!initialData?._id;
  const isOpen = open !== undefined ? open : internalOpen;
  const setIsOpen = onOpenChange || setInternalOpen;

  // Fetch Departments
  const { data: departments = [] } = useQuery({
    queryKey: ["departments"],
    queryFn: getDepartments,
  });

  React.useEffect(() => {
    if (initialData) {
      setSchemeName(initialData.schemeName);
      setFundingSource(initialData.fundingSource);
      setDepartmentId(initialData.departmentId);
      setFinancialYear(initialData.financialYear);
      setRemarks(initialData.remarks || "");
    } else {
      setSchemeName("");
      setFundingSource("");
      setDepartmentId("");
      setFinancialYear("");
      setRemarks("");
    }
  }, [initialData, isOpen]);

  const createMutation = useMutation({
    mutationFn: createScheme,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schemes"] });
      toast.success("Scheme created successfully");
      setIsOpen(false);
      setSchemeName("");
      setFundingSource("");
      setDepartmentId("");
      setFinancialYear("");
      setRemarks("");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create Scheme");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SchemeData> }) =>
      updateScheme(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schemes"] });
      toast.success("Scheme updated successfully");
      setIsOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update Scheme");
    },
  });

  const handleSave = () => {
    if (!schemeName.trim()) {
      toast.error("Scheme name is required");
      return;
    }
    if (!departmentId) {
      toast.error("Department is required");
      return;
    }

    // Optional: Validate Financial Year format if needed (e.g. 2023-24)

    const data = {
      schemeName: schemeName.trim(),
      fundingSource: fundingSource.trim(),
      departmentId,
      financialYear: financialYear.trim(),
      remarks: remarks.trim(),
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
            {isEditMode ? "Edit Scheme" : "Add Scheme"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-500">
              Department *
            </label>
            <Select
              value={departmentId}
              onValueChange={setDepartmentId}
              disabled={isPending}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept: any) => (
                  <SelectItem key={dept._id} value={dept._id}>
                    {dept.departmentName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-500">
              Scheme Name *
            </label>
            <Input
              placeholder="e.g. MNREGA"
              value={schemeName}
              onChange={(e) => setSchemeName(e.target.value)}
              disabled={isPending}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-500">
                Funding Source
              </label>
              <Input
                placeholder="e.g. Central Govt"
                value={fundingSource}
                onChange={(e) => setFundingSource(e.target.value)}
                disabled={isPending}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-500">
                Financial Year
              </label>
              <Input
                placeholder="e.g. 2023-24"
                value={financialYear}
                onChange={(e) => setFinancialYear(e.target.value)}
                disabled={isPending}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-500">Remarks</label>
            <Input
              placeholder="Any remarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
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

