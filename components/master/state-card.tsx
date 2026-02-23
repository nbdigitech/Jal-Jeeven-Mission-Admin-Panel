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
import AddStateModal from "./add-state-modal";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getStates, deleteState } from "@/services/masterService";
import { toast } from "react-toastify";

interface State {
  _id: string;
  stateName: string;
  stateCode?: string;
  createdAt: string;
  updatedAt: string;
}

export default function StateCard() {
  const queryClient = useQueryClient();
  const [editingState, setEditingState] = useState<State | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: states = [], isLoading } = useQuery({
    queryKey: ["states"],
    queryFn: getStates,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteState,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["states"] });
      toast.success("State deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete state");
    },
  });

  const handleEditState = (state: State) => {
    setEditingState(state);
    setIsModalOpen(true);
  };

  const handleDeleteState = async (id: string) => {
    if (confirm("Are you sure you want to delete this state?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingState(null);
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between ">
        <CardTitle className="text-lg font-semibold">State</CardTitle>
        <AddStateModal
          open={isModalOpen && !editingState}
          onOpenChange={(open) => {
            setIsModalOpen(open);
            if (!open) setEditingState(null);
          }}
          trigger={
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#136FB633] text-[#136FB6] hover:bg-[#136FB622] h-8 text-xs"
            >
              + Add State
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
                  State Name
                </TableHead>

                {/* <TableHead className="font-semibold text-gray-700">
                  State Code
                </TableHead> */}
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
                    Loading states...
                  </TableCell>
                </TableRow>
              ) : states.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="text-center py-8 text-gray-500"
                  >
                    No states found
                  </TableCell>
                </TableRow>
              ) : (
                states.map((state: State, index: number) => (
                  <TableRow
                    key={state._id}
                    className="border-b hover:bg-gray-50"
                  >
                    <TableCell className="text-gray-700">{index + 1}</TableCell>
                    <TableCell>
                      <span className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-green-500"></span>
                        {state.stateName}
                      </span>
                    </TableCell>
                    {/* <TableCell className="text-gray-700">
                      {state.stateCode || "-"}
                    </TableCell> */}
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEditState(state)}
                          className="text-[#136FB6] hover:text-[#105E9A]"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteState(state._id)}
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

      {editingState && (
        <AddStateModal
          open={isModalOpen}
          onOpenChange={handleCloseModal}
          initialData={editingState}
        />
      )}
    </Card>
  );
}
