import { useState, useEffect, useMemo } from "react";
import { PlusCircle } from "lucide-react";
import Fuse from "fuse.js";
import axiosInstance from "@/api/axiosInstance";
import toast from "react-hot-toast";

import { DashboardHeader } from "@/pages/admin/dashboard/components/header";
import { DashboardShell } from "@/pages/admin/dashboard/components/shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserTable } from "@/pages/admin/dashboard/users/components/user-table";
import { UserCreateDialog } from "@/pages/admin/dashboard/users/components/user-create-dialog";

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "ADMIN" | "USER";
  resetToken: string | null;
  resetTokenExpiry: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Create Fuse.js instance for fuzzy search
  const fuse = useMemo(() => {
    const options = {
      keys: [
        'name',
        'email',
        'role',
        'id'
      ],
      includeScore: true,
      threshold: 0.4, 
      minMatchCharLength: 2,
      ignoreLocation: true,
      shouldSort: true, 
    };
    
    return new Fuse(users, options);
  }, [users]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get("/users");
      setUsers(response.data.data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      toast.error("Failed to load users. Please try again later.");
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter users using Fuse.js
  const filteredUsers = useMemo(() => {
    if (!searchQuery) return users;
    
    const results = fuse.search(searchQuery);
    return results.map(result => result.item);
  }, [searchQuery, users, fuse]);

  const handleCreateUser = async (userData: {
    name: string;
    email: string;
    role: "ADMIN" | "USER";
    password: string;
  }) => {
    try {
      const response = await axiosInstance.post("/users", userData);
      setUsers((prevUsers) => [...prevUsers, response.data.data]);
      toast.success("User created successfully!");
      setIsCreateDialogOpen(false);
    } catch (err) {
      console.error("Failed to create user:", err);
      toast.error("Failed to create user. Please try again.");
    }
  };

  const handleUpdateUser = async (id: string, userData: Partial<User>) => {
    try {
      await axiosInstance.patch(`/users/${id}`, userData);
      fetchUsers();
      toast.success("User updated successfully!");
    } catch (err) {
      console.error("Failed to update user:", err);
      toast.error("Failed to update user. Please try again.");
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      await axiosInstance.delete(`/users/${id}`);
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
      toast.success("User deleted successfully!");
    } catch (err) {
      console.error("Failed to delete user:", err);
      toast.error("Failed to delete user. Please try again.");
    }
  };

  return (
    <DashboardShell>
      <DashboardHeader
        heading="User Management"
        text="Create and manage user accounts"
      >
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </DashboardHeader>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="w-full max-w-sm">
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9"
            />
          </div>
        </div>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <p>Loading users...</p>
          </div>
        ) : (
          <UserTable
            users={filteredUsers}
            onUpdate={handleUpdateUser}
            onDelete={handleDeleteUser}
            searchTerm={searchQuery}
          />
        )}
      </div>
      <UserCreateDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateUser}
      />
    </DashboardShell>
  );
}