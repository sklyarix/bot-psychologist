export const pagesId = {
  home: '45b08a44-d2ca-4ba8-af39-b0761eaa92ab',
  about: '4a50dd8b-2f78-49af-8e84-3e569afd3bcb',
  ai_qa: '6f0846c9-bc8d-4837-a5cf-889323070152',
  ai_goal: 'd723d4d9-7615-48a8-8596-bf7a9a78059c',
};

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

export function getFieldHtml(page: Page, groupName: string, fieldName: string) {
  const groupId = page?.pageFieldGroups?.find((g) => g.name === groupName)?.id;
  if (!groupId) return undefined;

  return page?.fields?.find((f) => f.pageGroupId === groupId && f.name === fieldName)?.html;
}
