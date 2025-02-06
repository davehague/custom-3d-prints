// server/services/ProductService.ts
import { type Database } from '@/types/database'
import { type DBProduct, type DBProductWithDetails } from '@/types/database'
import { serverSupabase } from '../utils/serverSupabaseClient'

export class ProductService {
  static async getAllProducts(): Promise<DBProduct[]> {
    console.log(`[ProductService] Getting all active products`)
    try {
      const { data, error } = await serverSupabase
        .from('products')
        .select('*')
        .eq('active', true)
        .order('name')

      if (error) {
        console.error(`[ProductService] Error getting products:`, error)
        throw error
      }

      console.log(`[ProductService] Found ${data.length} products`)
      return data
    } catch (error) {
      console.error(`[ProductService] Unexpected error in getAllProducts:`, error)
      throw error
    }
  }

  static async getProductById(id: string): Promise<DBProductWithDetails | null> {
    console.log(`[ProductService] Getting product by id:`, id)
    try {
      const { data, error } = await serverSupabase
        .from('products')
        .select(`
          *,
          images:product_images(*),
          customizations:product_customizations(
            type:customization_types(*),
            options:customization_options(*)
          )
        `)
        .eq('id', id)
        .single()

      if (error) {
        console.error(`[ProductService] Error getting product:`, error)
        throw error
      }

      console.log(`[ProductService] ${data ? 'Found product' : 'Product not found'}`)
      return data
    } catch (error) {
      console.error(`[ProductService] Unexpected error in getProductById:`, error)
      throw error
    }
  }

  static async createProduct(product: Database['public']['Tables']['products']['Insert']): Promise<DBProduct> {
    console.log(`[ProductService] Creating new product:`, product.name)
    try {
      const { data, error } = await serverSupabase
        .from('products')
        .insert(product)
        .select()
        .single()

      if (error) {
        console.error(`[ProductService] Error creating product:`, error)
        throw error
      }

      console.log(`[ProductService] Successfully created product:`, data.id)
      return data
    } catch (error) {
      console.error(`[ProductService] Unexpected error in createProduct:`, error)
      throw error
    }
  }

  static async updateProduct(id: string, updates: Database['public']['Tables']['products']['Update']): Promise<DBProduct> {
    console.log(`[ProductService] Updating product:`, id)
    try {
      const { data, error } = await serverSupabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error(`[ProductService] Error updating product:`, error)
        throw error
      }

      console.log(`[ProductService] Successfully updated product:`, id)
      return data
    } catch (error) {
      console.error(`[ProductService] Unexpected error in updateProduct:`, error)
      throw error
    }
  }

  static async uploadProductImage(productId: string, file: File): Promise<string> {
    console.log(`[ProductService] Uploading image for product:`, productId)
    try {
      const filePath = `products/${productId}/${file.name}`
      const { error: uploadError } = await serverSupabase.storage
        .from('product-images')
        .upload(filePath, file)

      if (uploadError) {
        console.error(`[ProductService] Error uploading image:`, uploadError)
        throw uploadError
      }

      const { data: imageData, error: imageError } = await serverSupabase
        .from('product_images')
        .insert({
          product_id: productId,
          storage_path: filePath,
          is_primary: false
        })
        .select()
        .single()

      if (imageError) {
        console.error(`[ProductService] Error creating image record:`, imageError)
        throw imageError
      }

      console.log(`[ProductService] Successfully uploaded image:`, filePath)
      return imageData.storage_path
    } catch (error) {
      console.error(`[ProductService] Unexpected error in uploadProductImage:`, error)
      throw error
    }
  }
}