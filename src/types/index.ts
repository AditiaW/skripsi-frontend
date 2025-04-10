// enums
export enum Role {
    ADMIN = "ADMIN",
    USER = "USER",
}

// types
export interface User {
    id: string;
    name: string;
    email: string;
    password: string;
    role: Role;
    resetToken?: string | null;
    resetTokenExpiry?: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface Category {
    id: string;
    name: string;
    products: Product[];
    createdAt: Date;
    updatedAt: Date;
}

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    quantity: number;
    image: string;
    category: Category;
    categoryId: string;
    createdAt: Date;
    updatedAt: Date;
}