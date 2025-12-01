import api from "./api";
import { Category } from "./categories.service";
import { SubItem } from "./subitems.service";

export interface Item {
  id: number;
  name: string;
  description: string;
  categoryId: number;
  nearLocationIds: number[];
  images?: string[];
  textContent: Record<string, any>;
  category?: Category; // ADD - Related category object
  subItems?: SubItem[];
  createdAt: string; // ADD
  updatedAt: string; // ADD
}

export interface CreateItemDto {
  name: string;
  description: string;
  categoryId: number;
  images?: string[];
  textContent: Record<string, any>; // Changed from 'content'
}

export interface UpdateItemDto {
  name?: string;
  description?: string;
  categoryId?: number;
  images?: string[];
  textContent?: Record<string, any>; // Changed from 'content'
}

// Services stay the same
export const itemsService = {
  getAll: async (): Promise<Item[]> => {
    const response = await api.get("/items");
    return response.data;
  },

  getById: async (id: number): Promise<Item> => {
    const response = await api.get(`/items/${id}`);
    return response.data;
  },

  create: async (data: CreateItemDto): Promise<Item> => {
    const response = await api.post("/items", data);
    return response.data;
  },

  update: async (id: number, data: UpdateItemDto): Promise<Item> => {
    const response = await api.patch(`/items/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/items/${id}`);
  },
};
