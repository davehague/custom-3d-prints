// server/api/database/products/[id]/images.ts
import { ProductService } from "~/server/services/ProductService";
import { H3Event } from "h3";
import type { DBProductImage } from "@/types/database";

export default defineEventHandler(async (event: H3Event) => {
  const productId = event.context.params?.id;
  
  if (!productId) {
    throw createError({
      statusCode: 400,
      message: "Product ID is required"
    });
  }

  try {
    // GET - List images for a product
    if (event.method === "GET") {
      const images = await ProductService.getProductImages(productId);
      return { success: true, data: images };
    }

    // POST - Upload new image(s)
    if (event.method === "POST") {
      const formData = await readMultipartFormData(event);
      if (!formData) {
        throw createError({
          statusCode: 400,
          message: "No files provided"
        });
      }

      const results = [];
      for (const file of formData) {
        if (file.filename && file.data) {
          const blob = new Blob([file.data], { type: file.type });
          const uploadedFile = new File([blob], file.filename, { type: file.type });
          const result = await ProductService.uploadProductImage(productId, uploadedFile);
          results.push(result);
        }
      }

      return { success: true, data: results };
    }

    // PATCH - Update image metadata
    if (event.method === "PATCH") {
      const body = await readBody<{ imageId: string } & Partial<DBProductImage>>(event);
      
      if (!body.imageId) {
        throw createError({
          statusCode: 400,
          message: "Image ID is required"
        });
      }

      const result = await ProductService.updateProductImage(body.imageId, body);
      return { success: true, data: result };
    }

    // DELETE - Delete an image
    if (event.method === "DELETE") {
      const { imageId } = getQuery(event);
      
      if (!imageId) {
        throw createError({
          statusCode: 400,
          message: "Image ID is required"
        });
      }

      await ProductService.deleteProductImage(imageId as string);
      return { success: true, message: "Image deleted successfully" };
    }

    throw createError({
      statusCode: 405,
      message: "Method not allowed"
    });
  } catch (error: any) {
    console.error(`[API] Error in /products/${productId}/images:`, error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Internal server error'
    });
  }
});