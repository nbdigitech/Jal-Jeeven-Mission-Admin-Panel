"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUser, updateUser } from "@/services/masterService";
import { toast } from "react-toastify";

interface UserData {
  _id?: string;
  name: string;
  email: string;
  role: string;
  contactNumber?: string;
  address?: string;
  password?: string;
}

export default function AddUserModal({
  trigger,
  open,
  onOpenChange,
  initialData,
}: {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  initialData?: UserData;
}) {
  const queryClient = useQueryClient();
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isOpen = open !== undefined ? open : internalOpen;
  const setIsOpen = onOpenChange || setInternalOpen;

  const [name, setName] = React.useState(initialData?.name || "");
  const [email, setEmail] = React.useState(initialData?.email || "");
  const [password, setPassword] = React.useState("");
  const [role, setRole] = React.useState(initialData?.role || "");
  const [contactNumber, setContactNumber] = React.useState(
    initialData?.contactNumber || "",
  );
  const [address, setAddress] = React.useState(initialData?.address || "");

  const isEditMode = !!initialData;

  React.useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setEmail(initialData.email);
      setRole(initialData.role);
      setContactNumber(initialData.contactNumber || "");
      setAddress(initialData.address || "");
      setPassword(""); // Don't populate password
    } else {
      setName("");
      setEmail("");
      setRole("");
      setContactNumber("");
      setAddress("");
      setPassword("");
    }
  }, [initialData, isOpen]);

  const createMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User created successfully");
      setIsOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create User");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User updated successfully");
      setIsOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update User");
    },
  });

  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setRole("");
    setContactNumber("");
    setAddress("");
  };

  const handleSave = () => {
    if (!name || !email || !role) {
      toast.error("Please fill Name, Email, and Role");
      return;
    }

    if (!isEditMode && !password) {
      toast.error("Password is required for new users");
      return;
    }

    const data: any = {
      name,
      email,
      role,
      contactNumber,
      address,
    };

    if (password) {
      data.password = password;
    }

    if (isEditMode && initialData._id) {
      updateMutation.mutate({ id: initialData._id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

      <DialogContent className="max-w-md rounded-xl p-0 overflow-hidden flex flex-col max-h-[90vh]">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-2xl font-bold text-gray-900">
            {isEditMode ? "Edit User" : "Add User"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-500">Name *</label>
            <Input
              placeholder="Full Name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isPending}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-500">Role *</label>
            <Select value={role} onValueChange={setRole} disabled={isPending}>
              <SelectTrigger>
                <SelectValue placeholder="Select Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="department Officer">
                  Department Officer
                </SelectItem>
                <SelectItem value="feild executer">Field Executor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-500">
              Contact Number
            </label>
            <Input
              placeholder="Mobile Number"
              value={contactNumber}
              required
              onChange={(e) => setContactNumber(e.target.value)}
              disabled={isPending}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-500">Address</label>
            <Input
              placeholder="Address"
              value={address}
              required
              onChange={(e) => setAddress(e.target.value)}
              disabled={isPending}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-500">Email *</label>
            <Input
              placeholder="email@example.com"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isPending}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-500">
              {isEditMode
                ? "Password (leave blank to keep current)"
                : "Password *"}
            </label>
            <Input
              placeholder={isEditMode ? "New Password" : "Strong Password"}
              type="password"
              required={!isEditMode}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isPending}
            />
          </div>
        </div>

        <div className="p-6 pt-2">
          <Button
            onClick={handleSave}
            disabled={isPending}
            className="w-full bg-[#136FB6] hover:bg-[#105E9A] text-white h-12 rounded-lg font-semibold"
          >
            {isPending
              ? "Saving..."
              : isEditMode
                ? "Update User"
                : "Create User"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

