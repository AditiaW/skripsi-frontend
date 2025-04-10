import { useState } from "react";
import { PlusCircle } from "lucide-react";

import { DashboardHeader } from "@/pages/admin/dashboard/components/header";
import { DashboardShell } from "@/pages/admin/dashboard/components/shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductTable } from "@/pages/admin/dashboard/products/components/product-table";
import { ProductCreateDialog } from "@/pages/admin/dashboard/products/components/product-create-dialog";

// Mock data for products
const initialProducts = [
  {
    id: "1",
    name: "Wireless Headphones",
    slug: "wireless-headphones",
    description: "Premium wireless headphones with noise cancellation",
    price: 149.99,
    category: "Electronics",
    inventory: 45,
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "2",
    name: "Smart Watch",
    slug: "smart-watch",
    description: "Fitness tracker and smartwatch with heart rate monitoring",
    price: 199.99,
    category: "Electronics",
    inventory: 32,
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "3",
    name: "Cotton T-Shirt",
    slug: "cotton-t-shirt",
    description: "Comfortable cotton t-shirt in various colors",
    price: 24.99,
    category: "Clothing",
    inventory: 120,
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "4",
    name: "Coffee Maker",
    slug: "coffee-maker",
    description: "Programmable coffee maker with thermal carafe",
    price: 89.99,
    category: "Home & Kitchen",
    inventory: 18,
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "5",
    name: "Yoga Mat",
    slug: "yoga-mat",
    description: "Non-slip yoga mat with carrying strap",
    price: 29.99,
    category: "Sports & Outdoors",
    inventory: 65,
    image: "/placeholder.svg?height=200&width=200",
  },
];

// Mock data for categories (for dropdown selection)
const categories = [
  { id: "1", name: "Electronics" },
  { id: "2", name: "Clothing" },
  { id: "3", name: "Home & Kitchen" },
  { id: "4", name: "Books" },
  { id: "5", name: "Sports & Outdoors" },
];

export default function ProductsPage() {
  const [products, setProducts] = useState(initialProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Filter products based on search query
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Create a new product
  const handleCreateProduct = (
    productData: Omit<(typeof products)[0], "id">
  ) => {
    const newProduct = {
      ...productData,
      id: (products.length + 1).toString(),
    };
    setProducts([...products, newProduct]);
    setIsCreateDialogOpen(false);
  };

  // Update a product
  const handleUpdateProduct = (
    id: string,
    productData: Partial<(typeof products)[0]>
  ) => {
    setProducts(
      products.map((product) =>
        product.id === id ? { ...product, ...productData } : product
      )
    );
  };

  // Delete a product
  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter((product) => product.id !== id));
  };

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Product Management"
        text="Create and manage products"
      >
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </DashboardHeader>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="w-full max-w-sm">
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9"
            />
          </div>
        </div>
        <ProductTable
          products={filteredProducts}
          categories={categories}
          onUpdate={handleUpdateProduct}
          onDelete={handleDeleteProduct}
        />
      </div>
      <ProductCreateDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateProduct}
        categories={categories}
      />
    </DashboardShell>
  );
}
