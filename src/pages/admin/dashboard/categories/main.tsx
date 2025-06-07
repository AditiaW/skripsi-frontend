import { useState, useEffect, useMemo } from "react";
import { PlusCircle } from "lucide-react";
import Fuse from "fuse.js";
import axiosInstance from "@/api/axiosInstance";
import toast from "react-hot-toast";

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

  // Create Fuse.js instance for fuzzy search
  const fuse = useMemo(() => {
    const options = {
      keys: [
        'name',
        'id'
      ],
      includeScore: true,
      threshold: 0.3, // More strict matching for categories
      minMatchCharLength: 2,
      ignoreLocation: true, // Search anywhere in the string
    };
    
    return new Fuse(categories, options);
  }, [categories]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get("/category");
      setCategories(response.data);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
      toast.error("Failed to load categories. Please try again later.");
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter categories using Fuse.js
  const filteredCategories = useMemo(() => {
    if (!searchQuery) return categories;
    
    const results = fuse.search(searchQuery);
    return results.map(result => result.item);
  }, [searchQuery, categories, fuse]);

  const handleCreateCategory = async (categoryData: { name: string }) => {
    try {
      const response = await axiosInstance.post("/category", categoryData);
      setCategories([...categories, response.data.data || response.data]);
      toast.success("Category created successfully!");
      setIsCreateDialogOpen(false);
    } catch (err) {
      console.error("Failed to create category:", err);
      toast.error("Failed to create category. Please try again.");
    }
  };

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
      toast.success("Category updated successfully!");
    } catch (err) {
      console.error("Failed to update category:", err);
      toast.error("Failed to update category. Please try again.");
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await axiosInstance.delete(`/category/${id}`);
      setCategories(categories.filter((category) => category.id !== id));
      toast.success("Category deleted successfully!");
    } catch (err) {
      console.error("Failed to delete category:", err);
      toast.error("Failed to delete category. Please try again.");
    }
  };

  return (
    <DashboardShell>
      <DashboardHeader heading="Category Management" text="Create and manage product categories">
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </DashboardHeader>
      <div className="space-y-4">
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