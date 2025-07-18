/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect, useMemo } from "react";
import { PlusCircle } from "lucide-react";
import Fuse from "fuse.js";
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
  createdAt: Date;
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

  // Create Fuse.js instance with improved options
  const fuse = useMemo(() => {
    const options = {
      keys: [
        { name: "name", weight: 0.5 },
        { name: "description", weight: 0.3 },
        { name: "category.name", weight: 0.2 },
      ],
      includeScore: true,
      threshold: 0.4,
      minMatchCharLength: 2,
      ignoreLocation: true,
      shouldSort: true,
    };

    return new Fuse(products, options);
  }, [products]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const [productsRes, categoriesRes] = await Promise.all([
          axiosInstance.get("/product"),
          axiosInstance.get("/category"),
        ]);

        setProducts(
          productsRes.data.map((product: Product) => ({
            ...product,
            category: product.category,
          }))
        );

        setCategories(categoriesRes.data);
      } catch {
        toast.error("Failed to load data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCreateProduct = async (data: Omit<Product, "id">) => {
    try {
      if (!data.categoryId) {
        throw new Error("Category is required.");
      }

      const res = await axiosInstance.post("/product", {
        ...data,
        categoryId: data.categoryId,
      });

      const updatedProduct = await axiosInstance.get(`/product/${res.data.id}`);

      setProducts([...products, updatedProduct.data]);
      toast.success("Product created successfully");
      setIsCreateDialogOpen(false);
    } catch (err) {
      toast.error(err.message || "Failed to create product. Please try again.");
    }
  };

  const handleUpdateProduct = async (id: string, data: Partial<Product>) => {
    try {
      await axiosInstance.patch(`/product/${id}`, data);

      const updatedProduct = await axiosInstance.get(`/product/${id}`);
      setProducts(
        products.map((product) =>
          product.id === id ? updatedProduct.data : product
        )
      );

      toast.success("Product updated successfully");
    } catch (err) {
      toast.error("Failed to update product. Please try again.");
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await axiosInstance.delete(`/product/${id}`);

      const refreshedProducts = await axiosInstance.get("/product");
      setProducts(refreshedProducts.data);

      toast.success("Product deleted successfully");
    } catch (err) {
      toast.error("Failed to delete product");
    }
  };

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;

    const results = fuse.search(searchQuery);
    return results.map((result) => result.item);
  }, [searchQuery, products, fuse]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

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
            onChange={handleSearchChange}
            className="focus-visible:ring-2 focus-visible:ring-primary"
          />
        </div>

        {isLoading ? (
          <div className="text-center py-8">Loading products...</div>
        ) : (
          <>
            {filteredProducts.length === 0 ? (
              <div className="text-center py-8">
                {products.length === 0
                  ? "No products available. Create your first product!"
                  : "No products match your search. Try different keywords."}
              </div>
            ) : (
              <ProductTable
                products={filteredProducts}
                categories={categories}
                onUpdate={handleUpdateProduct}
                onDelete={handleDeleteProduct}
                searchTerm={searchQuery}
              />
            )}
          </>
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
