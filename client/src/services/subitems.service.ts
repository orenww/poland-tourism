import api from "./api";

export interface SubItem {
  id: number;
  itemId: number;
  sectionType: string;
  name: string;
  description: string;
  address?: string;
  website?: string;
  priceRange?: string;
  hours?: string;
  ticketPrice?: string;
  type?: string;
  benefit?: string; // ADD THIS LINE
  images: string[];
}

export interface CreateSubItemDto {
  itemId: number;
  sectionType: string;
  name: string;
  description: string;
  address?: string;
  website?: string;
  priceRange?: string;
  hours?: string;
  ticketPrice?: string;
  type?: string;
  images?: string[];
}

export interface UpdateSubItemDto {
  sectionType?: string;
  name?: string;
  description?: string;
  address?: string;
  website?: string;
  priceRange?: string;
  hours?: string;
  ticketPrice?: string;
  type?: string;
  images?: string[];
}

export const subItemsService = {
  getAll: async (): Promise<SubItem[]> => {
    const response = await api.get("/subitems");
    return response.data;
  },

  getByItem: async (itemId: number): Promise<SubItem[]> => {
    const response = await api.get(`/subitems/item/${itemId}`);
    return response.data;
  },

  getById: async (id: number): Promise<SubItem> => {
    const response = await api.get(`/subitems/${id}`);
    return response.data;
  },

  create: async (data: CreateSubItemDto): Promise<SubItem> => {
    const response = await api.post("/subitems", data);
    return response.data;
  },

  update: async (id: number, data: UpdateSubItemDto): Promise<SubItem> => {
    const response = await api.patch(`/subitems/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/subitems/${id}`);
  },
};
