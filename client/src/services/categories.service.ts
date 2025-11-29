import api from "./api";

export interface Category {
  id: number;
  key: string;
  icon: string;
  _count?: {
    items: number;
  };
}

export const categoriesService = {
  // Get all categories with item counts
  getAll: async (): Promise<Category[]> => {
    const response = await api.get("/categories");
    return response.data;
  },

  // Get single category with its items
  getById: async (id: number) => {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },
};
