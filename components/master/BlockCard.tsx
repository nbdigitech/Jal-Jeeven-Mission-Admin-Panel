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
import AddBlockModal from "./add-block-modal";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getBlocks, deleteBlock } from "@/services/masterService";
import { toast } from "react-toastify";

interface Block {
  _id: string;
  blockName: string;
  districtId: string;
  district?: {
    // Changed from state
    _id: string;
    districtName: string; // Changed from stateName
  };
  createdAt: string;
  updatedAt: string;
}

export default function BlockCard() {
  const queryClient = useQueryClient();
  const [editingBlock, setEditingBlock] = useState<Block | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: blocks = [], isLoading } = useQuery({
    queryKey: ["blocks"],
    queryFn: () => getBlocks(),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteBlock,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blocks"] });
      toast.success("Block deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete block");
    },
  });

  const handleEditBlock = (block: Block) => {
    setEditingBlock(block);
    setIsModalOpen(true);
  };

  const handleDeleteBlock = async (id: string) => {
    if (confirm("Are you sure you want to delete this block?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBlock(null);
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Block</CardTitle>
        <AddBlockModal
          open={isModalOpen && !editingBlock}
          onOpenChange={(open) => {
            setIsModalOpen(open);
            if (!open) setEditingBlock(null);
          }}
          trigger={
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#136FB633] text-[#136FB6] hover:bg-[#136FB622] h-8 text-xs"
            >
              + Add Block
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
                  Block Name
                </TableHead>
                <TableHead className="font-semibold text-gray-700">
                  District
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
                    Loading blocks...
                  </TableCell>
                </TableRow>
              ) : blocks.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center py-8 text-gray-500"
                  >
                    No blocks found
                  </TableCell>
                </TableRow>
              ) : (
                blocks.map((block: Block, index: number) => (
                  <TableRow
                    key={block._id}
                    className="border-b hover:bg-gray-50"
                  >
                    <TableCell className="text-gray-700">{index + 1}</TableCell>
                    <TableCell>
                      <span className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-green-500"></span>
                        {block.blockName}
                      </span>
                    </TableCell>
                    <TableCell className="text-gray-700">
                      {block.district?.districtName || "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEditBlock(block)}
                          className="text-[#136FB6] hover:text-[#105E9A]"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteBlock(block._id)}
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

      {editingBlock && (
        <AddBlockModal
          open={isModalOpen}
          onOpenChange={handleCloseModal}
          initialData={editingBlock}
        />
      )}
    </Card>
  );
}
