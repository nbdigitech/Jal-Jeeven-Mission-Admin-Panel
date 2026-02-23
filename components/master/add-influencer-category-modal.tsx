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

interface InfluencerCategoryData {
  sNo: number;
  influencerId: string;
  categoryName: string;
  status?: string;
}

export default function BlockModal({
  trigger,
  initialData = null,
  onSave,
}: {
  trigger?: React.ReactNode;
  initialData?: InfluencerCategoryData | null;
  onSave?: (data: InfluencerCategoryData) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [focusedField, setFocusedField] = React.useState<string | null>(null);
  const [categoryName, setCategoryName] = React.useState(
    initialData?.categoryName || "",
  );
  const [selectedStatus, setSelectedStatus] = React.useState(
    initialData?.status || "",
  );

  const isEditMode = !!initialData;

  React.useEffect(() => {
    if (initialData) {
      setCategoryName(initialData.categoryName);
      setSelectedStatus(initialData.status || "");
    }
  }, [initialData]);

  const handleSave = () => {
    if (onSave) {
      onSave({
        ...initialData,
        categoryName,
        status: selectedStatus,
      } as InfluencerCategoryData);
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
              <label className="text-xs font-semibold block mb-2 text-gray-700">
                Select District
              </label>
              <Select>
                <SelectTrigger className="w-full border-2 !border-gray-300">
                  <SelectValue placeholder="Select district" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="district-1">District 1</SelectItem>
                  <SelectItem value="district-2">District 2</SelectItem>
                  <SelectItem value="district-3">District 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label
                className={`text-xs font-semibold block mb-2 transition ${
                  focusedField === "categoryName"
                    ? "text-[#136FB6]"
                    : "text-gray-700"
                }`}
              >
                Block Name
              </label>
              <Input
                placeholder="Enter block name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className={`w-full border-2 transition ${
                  focusedField === "categoryName"
                    ? "!border-[#136FB6]"
                    : "!border-gray-300"
                }`}
                onFocus={() => setFocusedField("categoryName")}
                onBlur={() => setFocusedField(null)}
              />
            </div>
            <div>
              <label className="text-xs font-semibold block mb-2 text-gray-700">
                Status
              </label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-full border-2 !border-gray-300">
                  <SelectValue />
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
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-[#136FB6] hover:bg-[#136FB6]/90 text-white"
            >
              {isEditMode ? "Update Block" : "Add Block"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

