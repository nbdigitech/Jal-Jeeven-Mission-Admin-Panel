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

export default function AddWorkSubCategoryModal({
  trigger,
  initialData = null,
  onSave,
}: {
  trigger?: React.ReactNode;
  initialData?: any;
  onSave?: (data: any) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = React.useState(
    initialData?.categoryName || "",
  );
  const [subCategoryName, setSubCategoryName] = React.useState(
    initialData?.subCategoryName || "",
  );
  const [selectedStatus, setSelectedStatus] = React.useState(
    initialData?.status || "active",
  );

  const isEditMode = !!initialData;

  React.useEffect(() => {
    if (initialData) {
      setSelectedCategory(initialData.categoryName);
      setSubCategoryName(initialData.subCategoryName);
      setSelectedStatus(initialData.status || "active");
    }
  }, [initialData]);

  const handleSave = () => {
    if (onSave) {
      onSave({
        ...initialData,
        categoryName: selectedCategory,
        subCategoryName,
        status: selectedStatus,
      });
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

      <DialogContent className="max-w-md rounded-xl p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            {isEditMode ? "Edit Work Sub Category" : "Add Work Sub Category"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-500">
              Select Work Category
            </label>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-full border-gray-300 rounded-lg h-12 flex justify-between items-center text-gray-600">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Civil Work (Rural Infrastructure)">
                  Civil Work (Rural Infrastructure)
                </SelectItem>
                <SelectItem value="Irrigation Works">
                  Irrigation Works
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-500">
              Sub Category Name
            </label>
            <Input
              placeholder="Enter sub category name"
              value={subCategoryName}
              onChange={(e) => setSubCategoryName(e.target.value)}
              className="w-full border-gray-300 rounded-lg h-12"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-500">Status</label>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full border-gray-300 rounded-lg h-12 flex justify-between items-center text-gray-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleSave}
            className="w-full bg-[#136FB6] hover:bg-[#105E9A] text-white h-12 rounded-lg font-semibold mt-4"
          >
            Submit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

