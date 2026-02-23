"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Trash2 } from "lucide-react";
import AddWorkSubCategoryModal from "./add-work-sub-category-modal";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getWorkSubtypes, deleteWorkSubtype } from "@/services/masterService";
import { toast } from "react-toastify";

interface WorkSubType {
  _id: string;
  workSubtypeName: string;
  parentWorkType?: {
    _id: string;
    workTypeName: string;
  };
}

export default function WorkSubCategoryCard() {
  const queryClient = useQueryClient();
  const [editingSubtype, setEditingSubtype] = useState<WorkSubType | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: subtypes = [], isLoading } = useQuery({
    queryKey: ["workSubtypes"],
    queryFn: () => getWorkSubtypes(),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteWorkSubtype,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workSubtypes"] });
      toast.success("Work Subtype deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete Work Subtype");
    },
  });

  const handleEditSubtype = (subtype: WorkSubType) => {
    setEditingSubtype(subtype);
    setIsModalOpen(true);
  };

  const handleDeleteSubtype = async (id: string) => {
    if (confirm("Are you sure you want to delete this Work Subtype?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSubtype(null);
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">
          Work Sub Category
        </CardTitle>
        <AddWorkSubCategoryModal
          open={isModalOpen && !editingSubtype}
          onOpenChange={(open) => {
            setIsModalOpen(open);
            if (!open) setEditingSubtype(null);
          }}
          trigger={
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#136FB633] text-[#136FB6] hover:bg-[#136FB622] h-8 text-xs"
            >
              + Add Sub Category
            </Button>
          }
        />
      </CardHeader>
      <CardContent className="pt-2">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b hover:bg-transparent">
                <TableHead className="w-12 font-semibold text-gray-700">
                  S No.
                </TableHead>
                <TableHead className="font-semibold text-gray-700">
                  Sub Category Name
                </TableHead>
                <TableHead className="font-semibold text-gray-700">
                  Parent Work Type
                </TableHead>
                <TableHead className="w-24 font-semibold text-gray-700 text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center py-8 text-gray-500"
                  >
                    Loading Work Subtypes...
                  </TableCell>
                </TableRow>
              ) : subtypes.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center py-8 text-gray-500"
                  >
                    No records found
                  </TableCell>
                </TableRow>
              ) : (
                subtypes.map((item: WorkSubType, index: number) => (
                  <TableRow
                    key={item._id}
                    className="border-b hover:bg-gray-50"
                  >
                    <TableCell className="text-gray-700">{index + 1}</TableCell>
                    <TableCell>
                      <span className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-green-500"></span>
                        {item.workSubtypeName}
                      </span>
                    </TableCell>
                    <TableCell className="text-gray-700">
                      {item.parentWorkType?.workTypeName || "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEditSubtype(item)}
                          className="text-[#136FB6] hover:text-[#105E9A]"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteSubtype(item._id)}
                          className="text-red-500 hover:text-red-600"
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      {editingSubtype && (
        <AddWorkSubCategoryModal
          open={isModalOpen}
          onOpenChange={handleCloseModal}
          initialData={{
            _id: editingSubtype._id,
            workSubtypeName: editingSubtype.workSubtypeName,
            parentWorkTypeId: editingSubtype.parentWorkType?._id || "",
          }}
        />
      )}
    </Card>
  );
}
