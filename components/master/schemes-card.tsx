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
import AddSchemesModal from "./add-schemes-modal";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSchemes, deleteScheme } from "@/services/masterService";
import { toast } from "react-toastify";

interface Scheme {
  _id: string;
  schemeName: string;
  fundingSource: string;
  departmentId: string;
  department?: {
    _id: string;
    departmentName: string;
  };
  financialYear: string;
  remarks?: string;
}

export default function SchemesCard() {
  const queryClient = useQueryClient();
  const [editingScheme, setEditingScheme] = useState<Scheme | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: schemes = [], isLoading } = useQuery({
    queryKey: ["schemes"],
    queryFn: getSchemes,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteScheme,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schemes"] });
      toast.success("Scheme deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete Scheme");
    },
  });

  const handleEditScheme = (scheme: Scheme) => {
    // Ensure we pass the ID for departmentId if it's an object or string
    const schemeData = {
      ...scheme,
      departmentId: scheme.department?._id || scheme.departmentId,
    };
    setEditingScheme(schemeData as any);
    setIsModalOpen(true);
  };

  const handleDeleteScheme = async (id: string) => {
    if (confirm("Are you sure you want to delete this Scheme?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingScheme(null);
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Schemes</CardTitle>
        <AddSchemesModal
          open={isModalOpen && !editingScheme}
          onOpenChange={(open) => {
            setIsModalOpen(open);
            if (!open) setEditingScheme(null);
          }}
          trigger={
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#136FB633] text-[#136FB6] hover:bg-[#136FB622] h-8 text-xs"
            >
              + Add Scheme
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
                  Scheme Name
                </TableHead>
                <TableHead className="font-semibold text-gray-700">
                  Department
                </TableHead>
                <TableHead className="font-semibold text-gray-700">
                  Financial Year
                </TableHead>
                <TableHead className="font-semibold text-gray-700">
                  Funding Source
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
                    colSpan={6}
                    className="text-center py-8 text-gray-500"
                  >
                    Loading Schemes...
                  </TableCell>
                </TableRow>
              ) : schemes.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-8 text-gray-500"
                  >
                    No records found
                  </TableCell>
                </TableRow>
              ) : (
                schemes.map((item: Scheme, index: number) => (
                  <TableRow
                    key={item._id}
                    className="border-b hover:bg-gray-50"
                  >
                    <TableCell className="text-gray-700">{index + 1}</TableCell>
                    <TableCell>
                      <span className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-green-500"></span>
                        {item.schemeName}
                      </span>
                    </TableCell>
                    <TableCell className="text-gray-700">
                      {item.department?.departmentName || "-"}
                    </TableCell>
                    <TableCell className="text-gray-700">
                      {item.financialYear || "-"}
                    </TableCell>
                    <TableCell className="text-gray-700">
                      {item.fundingSource || "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEditScheme(item)}
                          className="text-[#136FB6] hover:text-[#105E9A]"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteScheme(item._id)}
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

      {editingScheme && (
        <AddSchemesModal
          open={isModalOpen}
          onOpenChange={handleCloseModal}
          initialData={editingScheme}
        />
      )}
    </Card>
  );
}
