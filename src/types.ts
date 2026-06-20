export type CategoryId =
  | 'home'
  | 'health'
  | 'finance'
  | 'tips'
  | 'tech'
  | 'cooking'
  | 'medical'
  | 'travel'
  | 'transport'
  | 'law'
  | 'science';

export interface CategoryInfo {
  id: CategoryId;
  name: string;
  icon: string;
  description: string;
}

export interface Article {
  id: string;
  categoryId: CategoryId;
  categoryName: string;
  title: string;
  summary: string;
  content: string; // Markdown format
  views: number;
  readingTime: number; // in minutes
  createdAt: string;
  author: string;
  tags: string[];
  helpfulCount: number;
  unhelpfulCount: number;
  isGenerated?: boolean;
}

export interface Comment {
  id: string;
  author: string;
  content: string;
  createdAt: string;
}

export type AdType = 'horizontal' | 'vertical' | 'square' | 'native' | 'sticky';

export interface AdSenseFormat {
  id: string;
  slotName: string;
  type: AdType;
  description: string;
  width?: string;
  height?: string;
}
