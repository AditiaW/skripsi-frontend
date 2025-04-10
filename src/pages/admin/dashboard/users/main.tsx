import { useState } from "react"
import { DashboardHeader } from "@/pages/admin/dashboard/components/header"
import { DashboardShell } from "@/pages/admin/dashboard/components/shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { UserTable } from "@/pages/admin/dashboard/users/components/user-table"
import { UserCreateDialog } from "@/pages/admin/dashboard/users/components/user-create-dialog"
import { PlusCircle } from "lucide-react"

// Mock data for users
const initialUsers = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "Admin",
    status: "Active",
    lastActive: "2023-03-22T10:30:00Z",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "Editor",
    status: "Active",
    lastActive: "2023-03-21T14:20:00Z",
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob@example.com",
    role: "Viewer",
    status: "Inactive",
    lastActive: "2023-03-15T09:45:00Z",
  },
  {
    id: "4",
    name: "Alice Williams",
    email: "alice@example.com",
    role: "Editor",
    status: "Active",
    lastActive: "2023-03-20T16:15:00Z",
  },
  {
    id: "5",
    name: "Charlie Brown",
    email: "charlie@example.com",
    role: "Viewer",
    status: "Active",
    lastActive: "2023-03-19T11:30:00Z",
  },
]

export default function UsersPage() {
  const [users, setUsers] = useState(initialUsers)
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  // Filter users based on search query
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Create a new user
  const handleCreateUser = (userData: Omit<(typeof users)[0], "id" | "lastActive">) => {
    const newUser = {
      ...userData,
      id: (users.length + 1).toString(),
      lastActive: new Date().toISOString(),
    }
    setUsers([...users, newUser])
    setIsCreateDialogOpen(false)
  }

  // Update a user
  const handleUpdateUser = (id: string, userData: Partial<(typeof users)[0]>) => {
    setUsers(users.map((user) => (user.id === id ? { ...user, ...userData } : user)))
  }

  // Delete a user
  const handleDeleteUser = (id: string) => {
    setUsers(users.filter((user) => user.id !== id))
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="User Management" text="Create and manage user accounts">
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
        <UserTable users={filteredUsers} onUpdate={handleUpdateUser} onDelete={handleDeleteUser} />
      </div>
      <UserCreateDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} onSubmit={handleCreateUser} />
    </DashboardShell>
  )
}

