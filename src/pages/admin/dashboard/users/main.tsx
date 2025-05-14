import { useState, useEffect } from "react";
import { DashboardHeader } from "@/pages/admin/dashboard/components/header";
import { DashboardShell } from "@/pages/admin/dashboard/components/shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserTable } from "@/pages/admin/dashboard/users/components/user-table";
import { UserCreateDialog } from "@/pages/admin/dashboard/users/components/user-create-dialog";
import { PlusCircle } from "lucide-react";
import axiosInstance from "@/api/axiosInstance";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  lastActive: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get("/users");

        // Extract user array correctly
        const usersData = Array.isArray(response.data.data)
          ? response.data.data
          : [];

        setUsers(usersData);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch users:", err);
        setError("Failed to load users. Please try again later.");
        setUsers([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filter users based on search query
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Create a new user
  const handleCreateUser = async (
    userData: Omit<User, "id" | "lastActive">
  ) => {
    try {
      const response = await axiosInstance.post("/users", userData);
      setUsers([...users, response.data]);
      setIsCreateDialogOpen(false);
    } catch (err) {
      console.error("Failed to create user:", err);
      setError("Failed to create user. Please try again.");
    }
  };

  // Update a user
  const handleUpdateUser = async (id: string, userData: Partial<User>) => {
    try {
      const response = await axiosInstance.patch(`/users/${id}`, userData);
      setUsers(users.map((user) => (user.id === id ? response.data : user)));
    } catch (err) {
      console.error("Failed to update user:", err);
      setError("Failed to update user. Please try again.");
    }
  };

  // Delete a user
  const handleDeleteUser = async (id: string) => {
    try {
      await axiosInstance.delete(`/users/${id}`);
      setUsers(users.filter((user) => user.id !== id));
    } catch (err) {
      console.error("Failed to delete user:", err);
      setError("Failed to delete user. Please try again.");
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
        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
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
