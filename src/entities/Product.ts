import { IProductImage } from "./ProductImage.ts";

export interface IProduct {
  id: number;
  name: string;
  description: string;
  categoryId: number;
  images: IProductImage[];
}

export interface IProductCreate {
  name: string;
  description: string;
  categoryId: number | null;
  images: File[];
}

export interface IProductEdit {
  name: string;
  description: string;
  categoryId: number | null;
  images: File[];
}
