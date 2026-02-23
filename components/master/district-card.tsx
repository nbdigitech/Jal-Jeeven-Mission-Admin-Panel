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
import AddDistrictModal from "./add-district-modal";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getDistricts, deleteDistrict } from "@/services/masterService";
import { toast } from "react-toastify";

interface District {
  _id: string;
  districtName: string;
  status?: string;
}

export default function DistrictCard() {
  const queryClient = useQueryClient();
  const [editingDistrict, setEditingDistrict] = useState<District | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: districts = [], isLoading } = useQuery({
    queryKey: ["districts"],
    queryFn: getDistricts,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteDistrict,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["districts"] });
      toast.success("District deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete district");
    },
  });

  const handleEditDistrict = (district: District) => {
    setEditingDistrict(district);
    setIsModalOpen(true);
  };

  const handleDeleteDistrict = async (id: string) => {
    if (confirm("Are you sure you want to delete this district?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingDistrict(null);
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between ">
        <CardTitle className="text-lg font-semibold">District</CardTitle>
        <AddDistrictModal
          open={isModalOpen && !editingDistrict}
          onOpenChange={(open) => {
            setIsModalOpen(open);
            if (!open) setEditingDistrict(null);
          }}
          trigger={
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#136FB633] text-[#136FB6] hover:bg-[#136FB622] h-8 text-xs"
            >
              + Add District
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
                  District Name
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
                    Loading districts...
                  </TableCell>
                </TableRow>
              ) : districts.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center py-8 text-gray-500"
                  >
                    No districts found
                  </TableCell>
                </TableRow>
              ) : (
                districts.map((district: District, index: number) => (
                  <TableRow
                    key={district._id}
                    className="border-b hover:bg-gray-50"
                  >
                    <TableCell className="text-gray-700">{index + 1}</TableCell>
                    <TableCell>
                      <span className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-green-500"></span>
                        {district.districtName}
                      </span>
                    </TableCell>
                    <TableCell className="text-gray-700 capitalize">
                      {district.status || "Active"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEditDistrict(district)}
                          className="text-[#136FB6] hover:text-[#105E9A]"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteDistrict(district._id)}
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

      {editingDistrict && (
        <AddDistrictModal
          open={isModalOpen}
          onOpenChange={handleCloseModal}
          initialData={editingDistrict}
        />
      )}
    </Card>
  );
}
