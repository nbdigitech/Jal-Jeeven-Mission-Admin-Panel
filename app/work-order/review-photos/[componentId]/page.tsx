"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getComponentPhotos, submitComponentPhoto } from "@/services/workService";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import { toast } from "react-toastify";

export default function ReviewPhotosPage() {
  const { componentId } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: photosData, isLoading, isError } = useQuery({
    queryKey: ["componentPhotos", componentId],
    queryFn: () => getComponentPhotos(componentId as string),
    enabled: !!componentId,
  });

  const submitMutation = useMutation({
    mutationFn: (photoId: string) => submitComponentPhoto(componentId as string, photoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["componentPhotos", componentId] });
      toast.success("Photo submitted for approval");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to submit photo");
    },
  });

  const photos = photosData?.data || [];

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-[1200px] mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => router.back()}
              className="rounded-full h-9 w-9 border-gray-100 shadow-sm"
            >
              <ArrowLeft size={18} className="text-gray-600" />
            </Button>
            <div>
              <h1 className="text-[20px] font-extrabold text-[#1a2b3c] tracking-tight">
                Review Component Photos
              </h1>
              <p className="text-[12px] text-gray-500 font-medium">
                Component ID: {componentId}
              </p>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64 space-y-3 bg-white rounded-[20px] shadow-sm">
            <Loader2 className="h-8 w-8 animate-spin text-[#136FB6]" />
            <p className="text-gray-500 text-[13px] font-medium">Loading photos...</p>
          </div>
        ) : isError ? (
          <div className="p-10 text-center bg-white rounded-[20px] shadow-sm">
            <p className="text-red-500 font-medium">Failed to load photos.</p>
          </div>
        ) : photos.length === 0 ? (
          <div className="p-20 text-center bg-white rounded-[20px] shadow-sm">
            <p className="text-gray-500 text-[14px]">No photos uploaded for this component yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {photos.map((photo: any) => (
              <Card key={photo.id} className="overflow-hidden border-none shadow-sm rounded-[20px] bg-white group">
                <div className="aspect-video relative overflow-hidden bg-gray-100">
                  <img
                    src={photo.photo_url}
                    alt="Component Evidence"
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                  />
                  {photo.is_selected && (
                    <div className="absolute top-3 left-3 bg-green-500 text-white px-3 py-1 rounded-full text-[10px] font-bold shadow-lg">
                      SELECTED
                    </div>
                  )}
                  {photo.status === 'FORWARDED' && (
                    <div className="absolute top-3 right-3 bg-blue-500 text-white px-3 py-1 rounded-full text-[10px] font-bold shadow-lg">
                      SUBMITTED
                    </div>
                  )}
                </div>
                <CardContent className="p-5">
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="space-y-0.5">
                        <p className="text-gray-400 font-bold uppercase">Progress</p>
                        <p className="text-[#1a2b3c] font-black">{photo.progress}%</p>
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-gray-400 font-bold uppercase">Uploader</p>
                        <p className="text-[#1a2b3c] font-black truncate">{photo.uploader?.name || 'Anonymous'}</p>
                      </div>
                    </div>
                    
                    <div className="pt-2 flex gap-2">
                       <Button
                        onClick={() => submitMutation.mutate(photo.id)}
                        disabled={submitMutation.isPending || photo.status === 'FORWARDED'}
                        className="flex-1 bg-[#136FB6] hover:bg-[#105E9A] text-white h-10 rounded-xl text-[12px] font-bold shadow-md shadow-[#136FB6]/10"
                      >
                        {submitMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : "Submit for Approval"}
                      </Button>
                      <Button
                        variant="ghost"
                        className="h-10 px-4 rounded-xl text-red-500 hover:text-red-600 hover:bg-red-50 text-[12px] font-bold"
                        onClick={() => toast.info("Reject functionality to be implemented")}
                      >
                        <XCircle size={18} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
