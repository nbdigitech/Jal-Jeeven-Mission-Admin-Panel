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
import AddProjectStatusModal from "./add-project-status-modal";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProjectStatuses,
  deleteProjectStatus,
} from "@/services/masterService";
import { toast } from "react-toastify";

interface ProjectStatus {
  _id: string;
  statusName: string;
  status: string;
}

export default function ProjectStatusCard() {
  const queryClient = useQueryClient();
  const [editingStatus, setEditingStatus] = useState<ProjectStatus | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: statuses = [], isLoading } = useQuery({
    queryKey: ["projectStatuses"],
    queryFn: getProjectStatuses,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProjectStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projectStatuses"] });
      toast.success("Project Status deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete Project Status");
    },
  });

  const handleEditStatus = (status: ProjectStatus) => {
    setEditingStatus(status);
    setIsModalOpen(true);
  };

  const handleDeleteStatus = async (id: string) => {
    if (confirm("Are you sure you want to delete this Status?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingStatus(null);
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Project Status</CardTitle>
        <AddProjectStatusModal
          open={isModalOpen && !editingStatus}
          onOpenChange={(open) => {
            setIsModalOpen(open);
            if (!open) setEditingStatus(null);
          }}
          trigger={
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#136FB633] text-[#136FB6] hover:bg-[#136FB622] h-8 text-xs"
            >
              + Add Project Status
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
                  Status Name
                </TableHead>
                <TableHead className="font-semibold text-gray-700">
                  Status
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
                    Loading Statuses...
                  </TableCell>
                </TableRow>
              ) : statuses.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center py-8 text-gray-500"
                  >
                    No records found
                  </TableCell>
                </TableRow>
              ) : (
                statuses.map((item: ProjectStatus, index: number) => (
                  <TableRow
                    key={item._id}
                    className="border-b hover:bg-gray-50"
                  >
                    <TableCell className="text-gray-700">{index + 1}</TableCell>
                    <TableCell>
                      <span className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-green-500"></span>
                        {item.statusName}
                      </span>
                    </TableCell>
                    <TableCell className="text-gray-700 capitalize">
                      {item.status}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEditStatus(item)}
                          className="text-[#136FB6] hover:text-[#105E9A]"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteStatus(item._id)}
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

      {editingStatus && (
        <AddProjectStatusModal
          open={isModalOpen}
          onOpenChange={handleCloseModal}
          initialData={editingStatus}
        />
      )}
    </Card>
  );
}
