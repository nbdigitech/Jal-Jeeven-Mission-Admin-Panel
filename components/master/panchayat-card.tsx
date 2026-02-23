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
import AddPanchayatModal, { PanchayatData } from "./add-panchayat-modal";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPanchayats, deletePanchayat } from "@/services/masterService";
import { toast } from "react-toastify";

interface Panchayat extends PanchayatData {
  _id: string;
  block?: {
    blockName: string;
  };
}

export default function PanchayatCard() {
  const queryClient = useQueryClient();
  const [editingPanchayat, setEditingPanchayat] = useState<Panchayat | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: panchayats = [], isLoading } = useQuery({
    queryKey: ["panchayats"],
    queryFn: getPanchayats,
  });

  const deleteMutation = useMutation({
    mutationFn: deletePanchayat,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["panchayats"] });
      toast.success("Panchayat deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete Panchayat");
    },
  });

  const handleEditPanchayat = (panchayat: Panchayat) => {
    setEditingPanchayat(panchayat);
    setIsModalOpen(true);
  };

  const handleDeletePanchayat = async (id: string) => {
    if (confirm("Are you sure you want to delete this Panchayat?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPanchayat(null);
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Panchayat</CardTitle>
        <AddPanchayatModal
          open={isModalOpen && !editingPanchayat}
          onOpenChange={(open) => {
            setIsModalOpen(open);
            if (!open) setEditingPanchayat(null);
          }}
          trigger={
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#136FB633] text-[#136FB6] hover:bg-[#136FB622] h-8 text-xs"
            >
              + Add Panchayat
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
                  Panchayat Name
                </TableHead>
                <TableHead className="font-semibold text-gray-700">
                  Block Name
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
                    Loading Panchayats...
                  </TableCell>
                </TableRow>
              ) : panchayats.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center py-8 text-gray-500"
                  >
                    No records found
                  </TableCell>
                </TableRow>
              ) : (
                panchayats.map((panchayat: Panchayat, index: number) => (
                  <TableRow
                    key={panchayat._id}
                    className="border-b hover:bg-gray-50"
                  >
                    <TableCell className="text-gray-700">{index + 1}</TableCell>
                    <TableCell>
                      <span className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-green-500"></span>
                        {panchayat.panchayatName}
                      </span>
                    </TableCell>
                    <TableCell className="text-gray-700">
                      {panchayat.block?.blockName || "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEditPanchayat(panchayat)}
                          className="text-[#136FB6] hover:text-[#105E9A]"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeletePanchayat(panchayat._id)}
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

      {editingPanchayat && (
        <AddPanchayatModal
          open={isModalOpen}
          onOpenChange={handleCloseModal}
          initialData={editingPanchayat}
        />
      )}
    </Card>
  );
}
