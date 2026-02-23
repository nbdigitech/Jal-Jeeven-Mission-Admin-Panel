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
import AddCityVillageModal from "./add-city-village-modal";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCityVillages, deleteCityVillage } from "@/services/masterService";
import { toast } from "react-toastify";

interface CityVillage {
  _id: string;
  name: string;
  pincode?: string;
  districtId: string;
  district?: {
    districtName: string;
  };
}

export default function CityVillageCard() {
  const queryClient = useQueryClient();
  const [editingCity, setEditingCity] = useState<CityVillage | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: cities = [], isLoading } = useQuery({
    queryKey: ["cityVillages"],
    queryFn: getCityVillages,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCityVillage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cityVillages"] });
      toast.success("City/Village deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete City/Village");
    },
  });

  const handleEditCity = (city: CityVillage) => {
    setEditingCity(city);
    setIsModalOpen(true);
  };

  const handleDeleteCity = async (id: string) => {
    if (confirm("Are you sure you want to delete this City/Village?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCity(null);
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between ">
        <CardTitle className="text-lg font-semibold">City/Village</CardTitle>
        <AddCityVillageModal
          open={isModalOpen && !editingCity}
          onOpenChange={(open) => {
            setIsModalOpen(open);
            if (!open) setEditingCity(null);
          }}
          trigger={
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#136FB633] text-[#136FB6] hover:bg-[#136FB622] h-8 text-xs"
            >
              + Add City/Village
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
                  Name
                </TableHead>

                <TableHead className="font-semibold text-gray-700">
                  District
                </TableHead>
                <TableHead className="font-semibold text-gray-700">
                  Pincode
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
                    Loading City/Village data...
                  </TableCell>
                </TableRow>
              ) : cities.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-8 text-gray-500"
                  >
                    No records found
                  </TableCell>
                </TableRow>
              ) : (
                cities.map((city: CityVillage, index: number) => (
                  <TableRow
                    key={city._id}
                    className="border-b hover:bg-gray-50"
                  >
                    <TableCell className="text-gray-700">{index + 1}</TableCell>
                    <TableCell>
                      <span className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-green-500"></span>
                        {city.name}
                      </span>
                    </TableCell>

                    <TableCell className="text-gray-700">
                      {city.district?.districtName || "-"}
                    </TableCell>
                    <TableCell className="text-gray-700">
                      {city.pincode || "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEditCity(city)}
                          className="text-[#136FB6] hover:text-[#105E9A]"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCity(city._id)}
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

      {editingCity && (
        <AddCityVillageModal
          open={isModalOpen}
          onOpenChange={handleCloseModal}
          initialData={editingCity}
        />
      )}
    </Card>
  );
}
