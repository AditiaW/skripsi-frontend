/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { PlusCircle } from "lucide-react";
import axiosInstance from "@/api/axiosInstance";
import { DashboardHeader } from "@/pages/admin/dashboard/components/header";
import { DashboardShell } from "@/pages/admin/dashboard/components/shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductTable } from "@/pages/admin/dashboard/products/components/product-table";
import { ProductCreateDialog } from "@/pages/admin/dashboard/products/components/product-create-dialog";
import toast from "react-hot-toast";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  image: string;
  categoryId: string;
  category: {
    id: string;
    name: string;
  };
}

interface Category {
  id: string;
  name: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [productsRes, categoriesRes] = await Promise.all([
          axiosInstance.get("/product"),
          axiosInstance.get("/category"),
        ]);

        setProducts(
          productsRes.data.map((p: any) => ({
            ...p,
            category: p.category,
          }))
        );
        setCategories(categoriesRes.data);
      } catch (err) {
        toast.error("Failed to load data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCreateProduct = async (data: Omit<Product, "id">) => {
    try {
      const res = await axiosInstance.post("/product", {
        ...data,
      });

      setProducts([...products, res.data]);
      toast.success("Product created successfully");
      setIsCreateDialogOpen(false);
    } catch (err) {
      toast.error("Failed to create product. Please try again.");
    }
  };

  const handleUpdateProduct = async (id: string, data: Partial<Product>) => {
    try {
      await axiosInstance.patch(`/product/${id}`, data);
      setProducts(products.map((p) => (p.id === id ? { ...p, ...data } : p)));
      toast.success("Product updated successfully");
    } catch (err) {
      toast.error("Failed to update product. Please try again.");
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await axiosInstance.delete(`/product/${id}`);
      setProducts(products.filter((p) => p.id !== id));
      toast.success("Product deleted successfully");
    } catch (err) {
      toast.error("Failed to delete product");
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Manage Products"
        text="Manage your store's products"
      >
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </DashboardHeader>

      <div className="space-y-4">
        <div className="w-full max-w-sm">
          <Input
            placeholder="Search product..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {isLoading ? (
          <div className="text-center py-8">Loading products...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-8">
            {products.length === 0
              ? "No products available"
              : "No search results found"}
          </div>
        ) : (
          <ProductTable
            products={filteredProducts}
            categories={categories}
            onUpdate={handleUpdateProduct}
            onDelete={handleDeleteProduct}
          />
        )}
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
