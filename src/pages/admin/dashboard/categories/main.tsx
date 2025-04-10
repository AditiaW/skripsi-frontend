import { useState } from "react";
import { PlusCircle } from "lucide-react";

import { DashboardHeader } from "@/pages/admin/dashboard/components/header";
import { DashboardShell } from "@/pages/admin/dashboard/components/shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CategoryTable } from "@/pages/admin/dashboard/categories/components/category-table";
import { CategoryCreateDialog } from "@/pages/admin/dashboard/categories/components/category-create-dialog";

// Mock data for categories
const initialCategories = [
  {
    id: "1",
    name: "Electronics",
    slug: "electronics",
    description: "Electronic devices and gadgets",
    productCount: 42,
  },
  {
    id: "2",
    name: "Clothing",
    slug: "clothing",
    description: "Apparel and fashion items",
    productCount: 56,
  },
  {
    id: "3",
    name: "Home & Kitchen",
    slug: "home-kitchen",
    description: "Home appliances and kitchen essentials",
    productCount: 38,
  },
  {
    id: "4",
    name: "Books",
    slug: "books",
    description: "Books, e-books, and audiobooks",
    productCount: 120,
  },
  {
    id: "5",
    name: "Sports & Outdoors",
    slug: "sports-outdoors",
    description: "Sports equipment and outdoor gear",
    productCount: 35,
  },
];

export default function CategoriesPage() {
  const [categories, setCategories] = useState(initialCategories);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Filter categories based on search query
  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Create a new category
  const handleCreateCategory = (
    categoryData: Omit<(typeof categories)[0], "id" | "productCount">
  ) => {
    const newCategory = {
      ...categoryData,
      id: (categories.length + 1).toString(),
      productCount: 0,
    };
    setCategories([...categories, newCategory]);
    setIsCreateDialogOpen(false);
  };

  // Update a category
  const handleUpdateCategory = (
    id: string,
    categoryData: Partial<(typeof categories)[0]>
  ) => {
    setCategories(
      categories.map((category) =>
        category.id === id ? { ...category, ...categoryData } : category
      )
    );
  };

  // Delete a category
  const handleDeleteCategory = (id: string) => {
    setCategories(categories.filter((category) => category.id !== id));
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
        <CategoryTable
          categories={filteredCategories}
          onUpdate={handleUpdateCategory}
          onDelete={handleDeleteCategory}
        />
      </div>
      <CategoryCreateDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateCategory}
      />
    </DashboardShell>
  );
}
