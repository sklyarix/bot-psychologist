import { instance } from '../helpers/api.tsx';

export type PageField = {
  id: string;
  pageId: string;
  pageGroupId?: string | null;
  name: string;
  title: string;
  html: string;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type PageFieldGroup = {
  id: string;
  pageId: string;
  name: string;
  title?: string | null;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
  fields?: PageField[];
};

export type Page = {
  id: string;
  slug: string;
  title: string;
  description?: string | null;
  published?: boolean;
  fields?: PageField[];
  pageFieldGroups?: PageFieldGroup[];
  createdAt: string;
  updatedAt: string;
};

export type PagesResponse = Page[];
export type PageResponse = Page;

export const pagesApi = {
  getAll: async (): Promise<PagesResponse> => {
    const { data } = await instance.get('/cms/pages');
    return data;
  },
  getById: async (id: string): Promise<PageResponse> => {
    const { data } = await instance.get(`/cms/pages/${id}`);
    return data;
  },
  create: async (payload: { title: string; slug: string }): Promise<PageResponse> => {
    const { data } = await instance.post('/cms/pages', payload);
    return data;
  },
  update: async (id: string, payload: { title?: string; slug?: string }): Promise<PageResponse> => {
    const { data } = await instance.put(`/cms/pages/${id}`, payload);
    return data;
  },
  remove: async (id: string): Promise<{ success: boolean }> => {
    const { data } = await instance.delete(`/cms/pages/${id}`);
    return data;
  },
};
