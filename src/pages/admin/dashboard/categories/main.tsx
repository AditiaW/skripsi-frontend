import { useState, useEffect } from "react";
import { PlusCircle } from "lucide-react";
import axiosInstance from "@/api/axiosInstance";

import { DashboardHeader } from "@/pages/admin/dashboard/components/header";
import { DashboardShell } from "@/pages/admin/dashboard/components/shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CategoryTable } from "@/pages/admin/dashboard/categories/components/category-table";
import { CategoryCreateDialog } from "@/pages/admin/dashboard/categories/components/category-create-dialog";

interface Category {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get("/category");
        setCategories(response.data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        setError("Failed to load categories. Please try again later.");
        setCategories([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Filter categories based on search query
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Create a new category
  const handleCreateCategory = async (categoryData: { name: string }) => {
    try {
      const response = await axiosInstance.post("/category", categoryData);
      setCategories([...categories, response.data.data || response.data]);
      setIsCreateDialogOpen(false);
    } catch (err) {
      console.error("Failed to create category:", err);
      setError("Failed to create category. Please try again.");
    }
  };

  // Update a category
  const handleUpdateCategory = async (
    id: string,
    categoryData: Partial<Category>
  ) => {
    try {
      const response = await axiosInstance.patch(`/category/${id}`, categoryData);
      setCategories(
        categories.map((category) =>
          category.id === id ? (response.data.data || response.data) : category
        )
      );
    } catch (err) {
      console.error("Failed to update category:", err);
      setError("Failed to update category. Please try again.");
    }
  };

  // Delete a category
  const handleDeleteCategory = async (id: string) => {
    try {
      await axiosInstance.delete(`/category/${id}`);
      setCategories(categories.filter((category) => category.id !== id));
    } catch (err) {
      console.error("Failed to delete category:", err);
      setError("Failed to delete category. Please try again.");
    }
  };

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Category Management"
        text="Create and manage product categories"
      >
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Category
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
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9"
            />
          </div>
        </div>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <p>Loading categories...</p>
          </div>
        ) : (
          <CategoryTable
            categories={filteredCategories}
            onUpdate={handleUpdateCategory}
            onDelete={handleDeleteCategory}
          />
        )}
      </div>
      <CategoryCreateDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateCategory}
      />
    </DashboardShell>
  );
}
