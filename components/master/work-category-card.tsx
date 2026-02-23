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
import AddWorkCategoryModal from "./add-work-category-modal";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getWorkTypes, deleteWorkType } from "@/services/masterService";
import { toast } from "react-toastify";

interface WorkType {
  _id: string;
  workTypeName: string;
}

export default function WorkCategoryCard() {
  const queryClient = useQueryClient();
  const [editingWorkType, setEditingWorkType] = useState<WorkType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: workTypes = [], isLoading } = useQuery({
    queryKey: ["workTypes"],
    queryFn: getWorkTypes,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteWorkType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workTypes"] });
      toast.success("Work Type deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete Work Type");
    },
  });

  const handleEditWorkType = (workType: WorkType) => {
    setEditingWorkType(workType);
    setIsModalOpen(true);
  };

  const handleDeleteWorkType = async (id: string) => {
    if (confirm("Are you sure you want to delete this Work Type?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingWorkType(null);
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Work Type</CardTitle>
        <AddWorkCategoryModal
          open={isModalOpen && !editingWorkType}
          onOpenChange={(open) => {
            setIsModalOpen(open);
            if (!open) setEditingWorkType(null);
          }}
          trigger={
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#136FB633] text-[#136FB6] hover:bg-[#136FB622] h-8 text-xs"
            >
              + Add Work Type
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
                  Work Type Name
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
                    colSpan={3}
                    className="text-center py-8 text-gray-500"
                  >
                    Loading Work Types...
                  </TableCell>
                </TableRow>
              ) : workTypes.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="text-center py-8 text-gray-500"
                  >
                    No records found
                  </TableCell>
                </TableRow>
              ) : (
                workTypes.map((item: WorkType, index: number) => (
                  <TableRow
                    key={item._id}
                    className="border-b hover:bg-gray-50"
                  >
                    <TableCell className="text-gray-700">{index + 1}</TableCell>
                    <TableCell>
                      <span className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-green-500"></span>
                        {item.workTypeName}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEditWorkType(item)}
                          className="text-[#136FB6] hover:text-[#105E9A]"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteWorkType(item._id)}
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

      {editingWorkType && (
        <AddWorkCategoryModal
          open={isModalOpen}
          onOpenChange={handleCloseModal}
          initialData={editingWorkType}
        />
      )}
    </Card>
  );
}
