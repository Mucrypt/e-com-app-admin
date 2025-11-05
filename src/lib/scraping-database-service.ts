import { createClient } from '@/supabase/server';
import { Database } from '../supabase/types';
import { ScrapedProduct, ScrapingJob } from '../types/scraper.types';

// Type the Supabase client more permissively to handle the new tables
type PermissiveDatabase = Database & {
  public: Database['public'] & {
    Tables: Database['public']['Tables'] & {
      scraped_products: any;
      scraping_jobs: any;
      imported_products: any;
    };
  };
};

type ScrapedProductInsert = Database['public']['Tables']['scraped_products']['Insert'];
type ScrapingJobInsert = Database['public']['Tables']['scraping_jobs']['Insert'];
type ScrapingJobUpdate = Database['public']['Tables']['scraping_jobs']['Update'];

export class ScrapingDatabaseService {
  private supabaseClient: any = null;

  // Set the supabase client from outside (from API routes)
  setSupabaseClient(client: any) {
    this.supabaseClient = client;
  }

  private get supabase() {
    if (!this.supabaseClient) {
      throw new Error('Supabase client not set. Call setSupabaseClient() first.');
    }
    return this.supabaseClient;
  }

  /**
   * Generate slug from title
   */
  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  /**
   * Store scraped product in database
   */
  async storeScrapedProduct(product: ScrapedProduct, jobId?: string): Promise<{ data: any; error: any }> {
    try {
      const productData: ScrapedProductInsert = {
        title: product.title,
        description: product.description,
        price: product.price,
        original_price: product.original_price,
        currency: product.currency || 'USD',
        images: product.images || [],
        rating: product.rating,
        review_count: product.review_count,
        brand: product.brand,
        category: product.category,
        availability: product.availability,
        source_url: product.source_url,
        source_platform: product.source_platform,
        specifications: product.specifications as any || {},
        discount_percentage: product.discount_percentage,
        sku: product.sku,
        weight: product.weight,
        dimensions: product.dimensions as any || {},
        shipping_info: product.shipping_info as any || {},
        seller_info: product.seller_info as any || {},
        variants: product.variants as any || []
      };

      const { data, error } = await this.supabase
        .from('scraped_products')
        .insert([productData])
        .select()
        .single();

      if (error) {
        console.error('Error storing scraped product:', error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error in storeScrapedProduct:', error);
      return { data: null, error };
    }
  }

  /**
   * Create a new scraping job
   */
  async createScrapingJob(
    urls: string[], 
    platform: string, 
    userId: string, 
    settings: any
  ): Promise<{ data: any; error: any }> {
    try {
      const jobData: ScrapingJobInsert = {
        urls: urls as any,
        platform: platform as any,
        created_by: userId,
        total_urls: urls.length,
        processed_urls: 0,
        successful_scrapes: 0,
        failed_scrapes: 0,
        imported_products: 0,
        status: 'pending' as any,
        settings: settings as any,
        results: [] as any
      };

      const { data, error } = await this.supabase
        .from('scraping_jobs')
        .insert([jobData])
        .select()
        .single();

      if (error) {
        console.error('Error in createScrapingJob:', error);
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (error: any) {
      console.error('Error in createScrapingJob:', error);
      return { data: null, error: error.message };
    }
  }

  /**
   * Update scraping job progress
   */
  async updateScrapingJob(
    jobId: string, 
    updates: Partial<ScrapingJobUpdate>
  ): Promise<{ data: any; error: any }> {
    try {
      const { data, error } = await this.supabase
        .from('scraping_jobs')
        .update(updates)
        .eq('id', jobId)
        .select()
        .single();

      if (error) {
        console.error('Error updating scraping job:', error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error in updateScrapingJob:', error);
      return { data: null, error };
    }
  }

  /**
   * Get scraping job by ID
   */
  async getScrapingJob(jobId: string): Promise<{ data: any; error: any }> {
    try {
      const { data, error } = await this.supabase
        .from('scraping_jobs')
        .select('*')
        .eq('id', jobId)
        .single();

      if (error) {
        console.error('Error getting scraping job:', error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error in getScrapingJob:', error);
      return { data: null, error };
    }
  }

  /**
   * Get all scraping jobs for a user
   */
  async getUserScrapingJobs(userId: string, limit = 50): Promise<{ data: any[]; error: any }> {
    try {
      const { data, error } = await this.supabase
        .from('scraping_jobs')
        .select('*')
        .eq('created_by', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error getting user scraping jobs:', error);
        return { data: [], error };
      }

      return { data: data || [], error: null };
    } catch (error) {
      console.error('Error in getUserScrapingJobs:', error);
      return { data: [], error };
    }
  }

  /**
   * Get scraped products
   */
  async getScrapedProducts(
    filters?: {
      platform?: string;
      limit?: number;
      offset?: number;
    }
  ): Promise<{ data: any[]; error: any }> {
    try {
      let query = this.supabase
        .from('scraped_products')
        .select('*');

      if (filters?.platform) {
        query = query.eq('source_platform', filters.platform);
      }

      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      if (filters?.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 50) - 1);
      }

      query = query.order('scraped_at', { ascending: false });

      const { data, error } = await query;

      if (error) {
        console.error('Error getting scraped products:', error);
        return { data: [], error };
      }

      return { data: data || [], error: null };
    } catch (error) {
      console.error('Error in getScrapedProducts:', error);
      return { data: [], error };
    }
  }

  /**
   * Import scraped product to main products table
   */
  async importScrapedProduct(
    scrapedProductId: string,
    modifications?: any
  ): Promise<{ data: any; error: any }> {
    try {
      // Get current user for created_by field
      const { data: { user }, error: userError } = await this.supabase.auth.getUser();
      
      if (userError || !user) {
        return { data: null, error: 'Authentication required for product import' };
      }

      // First get the scraped product
      const { data: scrapedProduct, error: fetchError } = await this.supabase
        .from('scraped_products')
        .select('*')
        .eq('id', scrapedProductId)
        .single();

      if (fetchError || !scrapedProduct) {
        return { data: null, error: fetchError || 'Scraped product not found' };
      }

      // Type the scraped product data
      const productRecord = scrapedProduct as any;

      // Prepare images data - use first image as main, rest as additional
      const images = productRecord.images || [];
      const mainImage = Array.isArray(images) && images.length > 0 ? images[0] : null;
      const additionalImages = Array.isArray(images) && images.length > 1 ? images.slice(1) : [];

      // Prepare product data for main products table with proper image handling
      const productData = {
        name: (modifications?.name || productRecord.title || 'Imported Product').substring(0, 255),
        description: modifications?.description || productRecord.description || '',
        short_description: productRecord.description ? productRecord.description.substring(0, 300) : '',
        price: Number(modifications?.price || productRecord.price || 0),
        original_price: productRecord.original_price ? Number(productRecord.original_price) : null,
        image_url: mainImage, // Main product image
        images: additionalImages.length > 0 ? JSON.stringify(additionalImages) : null, // Additional images as JSON
        brand: productRecord.brand || null,
        sku: productRecord.sku || null,
        weight: productRecord.weight ? Number(productRecord.weight) : null,
        rating: productRecord.rating ? Number(productRecord.rating) : null,
        review_count: productRecord.review_count ? Number(productRecord.review_count) : null,
        is_active: true,
        in_stock: true,
        stock_quantity: 0,
        created_by: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log('📦 Importing scraped product with images:', {
        id: scrapedProductId,
        title: productRecord.title,
        totalImages: images.length,
        mainImage: mainImage ? 'Yes' : 'No',
        additionalImages: additionalImages.length
      });

      // Insert into products table directly (not using RPC)
      const { data: productInsert, error: insertError } = await this.supabase
        .from('products')
        .insert([productData])
        .select()
        .single();

      if (insertError) {
        console.error('❌ Error importing product:', insertError);
        return { data: null, error: insertError };
      }

      console.log('✅ Successfully imported product:', productInsert.id, 'with', images.length, 'images');

      // Update scraped product with import info
      await this.supabase
        .from('scraped_products')
        .update({ 
          imported_at: new Date().toISOString(),
          product_id: productInsert.id 
        })
        .eq('id', scrapedProductId);

      // Record the import in imported_products table
      await this.supabase
        .from('imported_products')
        .insert([{
          scraped_product_id: scrapedProductId,
          product_id: productInsert.id,
          modifications: modifications as any || {},
          status: 'imported'
        }]);

      return { data: productInsert, error: null };
    } catch (error) {
      console.error('❌ Error in importScrapedProduct:', error);
      return { data: null, error };
    }
  }

  /**
   * Bulk import multiple scraped products
   */
  async bulkImportScrapedProducts(
    scrapedProductIds: string[],
    globalModifications?: any
  ): Promise<{ data: any[]; errors: any[] }> {
    const results = [];
    const errors = [];

    for (const id of scrapedProductIds) {
      const { data, error } = await this.importScrapedProduct(id, globalModifications);
      
      if (error) {
        errors.push({ id, error });
      } else {
        results.push(data);
      }
    }

    return { data: results, errors };
  }

  /**
   * Delete scraped product and its associated imported product
   */
  async deleteScrapedProduct(productId: string): Promise<{ error: any }> {
    try {
      // First, check if this scraped product has been imported
      const { data: scrapedProduct, error: fetchError } = await this.supabase
        .from('scraped_products')
        .select('product_id')
        .eq('id', productId)
        .single();

      if (fetchError) {
        console.error('Error fetching scraped product:', fetchError);
        return { error: fetchError };
      }

      // If the scraped product was imported, delete the imported product first
      if (scrapedProduct?.product_id) {
        console.log('🗑️ Deleting imported product:', scrapedProduct.product_id);
        
        // Delete from imported_products table
        await this.supabase
          .from('imported_products')
          .delete()
          .eq('scraped_product_id', productId);

        // Delete from main products table
        const { error: productDeleteError } = await this.supabase
          .from('products')
          .delete()
          .eq('id', scrapedProduct.product_id);

        if (productDeleteError) {
          console.error('Error deleting imported product:', productDeleteError);
          // Continue with scraped product deletion even if imported product deletion fails
        }
      }

      // Now delete the scraped product
      console.log('🗑️ Deleting scraped product:', productId);
      const { error: scrapedDeleteError } = await this.supabase
        .from('scraped_products')
        .delete()
        .eq('id', productId);

      if (scrapedDeleteError) {
        console.error('Error deleting scraped product:', scrapedDeleteError);
        return { error: scrapedDeleteError };
      }

      console.log('✅ Successfully deleted scraped product and associated imported product');
      return { error: null };
    } catch (error) {
      console.error('Error in deleteScrapedProduct:', error);
      return { error };
    }
  }

  /**
   * Bulk delete multiple scraped products and their imported products
   */
  async bulkDeleteScrapedProducts(productIds: string[]): Promise<{ data: any[]; errors: any[] }> {
    const results = [];
    const errors = [];

    for (const productId of productIds) {
      const { error } = await this.deleteScrapedProduct(productId);
      
      if (error) {
        errors.push({ productId, error });
      } else {
        results.push({ productId, success: true });
      }
    }

    return { data: results, errors };
  }

  /**
   * Delete a product and clean up any scraped product relationships
   */
  async deleteProduct(productId: string): Promise<{ error: any }> {
    try {
      // Check if this product was imported from a scraped product
      const { data: importedProduct } = await this.supabase
        .from('imported_products')
        .select('scraped_product_id')
        .eq('product_id', productId)
        .maybeSingle();

      // Soft delete the product
      const { error } = await this.supabase
        .from('products')
        .update({
          is_deleted: true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', productId);

      if (error) {
        console.error('❌ Error deleting product:', error);
        return { error };
      }

      // If this was an imported product, clean up the relationships
      if (importedProduct && importedProduct.scraped_product_id) {
        console.log('🗑️ Cleaning up imported product relationships for product:', productId);
        
        // Remove the product_id reference from scraped_products
        await this.supabase
          .from('scraped_products')
          .update({ 
            product_id: null,
            imported_at: null 
          })
          .eq('id', importedProduct.scraped_product_id);

        // Remove the import record
        await this.supabase
          .from('imported_products')
          .delete()
          .eq('product_id', productId);

        console.log('✅ Cleaned up relationships for imported product');
      }

      console.log('✅ Successfully deleted product:', productId);
      return { error: null };
    } catch (error) {
      console.error('❌ Error in deleteProduct:', error);
      return { error };
    }
  }

  /**
   * Get import statistics
   */
  async getImportStatistics(userId?: string): Promise<{ data: any; error: any }> {
    try {
      // Get total scraped products
      let scrapedQuery = this.supabase
        .from('scraped_products')
        .select('id', { count: 'exact' });

      // Get total imported products
      let importedQuery = this.supabase
        .from('scraped_products')
        .select('id', { count: 'exact' })
        .not('imported_at', 'is', null);

      // Get scraping jobs stats if user provided
      let jobsQuery = null;
      if (userId) {
        jobsQuery = this.supabase
          .from('scraping_jobs')
          .select('status', { count: 'exact' })
          .eq('created_by', userId);
      }

      const [scrapedResult, importedResult, jobsResult] = await Promise.all([
        scrapedQuery,
        importedQuery,
        jobsQuery
      ]);

      const stats = {
        total_scraped: scrapedResult.count || 0,
        total_imported: importedResult.count || 0,
        pending_import: (scrapedResult.count || 0) - (importedResult.count || 0),
        ...(jobsResult && { jobs_stats: jobsResult.data })
      };

      return { data: stats, error: null };
    } catch (error) {
      console.error('Error in getImportStatistics:', error);
      return { data: null, error };
    }
  }
}

// Export singleton instance
export const scrapingDbService = new ScrapingDatabaseService();