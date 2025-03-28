import { SQL, and, asc, desc, eq, ilike, or, sql, inArray } from 'drizzle-orm';
import { db } from '~/db';
import { category, thread } from '~/db/schema';
import { AppError, ErrorCode } from '~/utils/errors';
import { generateCategoryId } from '~/utils/id-generator';

export interface CategoryFilter {
  page?: number;
  limit?: number;
  search?: string;
  parentId?: string | null;
  includeThreadCount?: boolean;
  sortBy?: keyof typeof category.$inferSelect;
  sortOrder?: 'asc' | 'desc';
}

export class CategoryService {
  /**
   * Get a list of categories with pagination and filters
   */
  async getCategories(filter: CategoryFilter = {}) {
    const {
      page = 1,
      limit = 10,
      search,
      parentId,
      includeThreadCount = false,
      sortBy = 'name',
      sortOrder = 'asc',
    } = filter;

    const offset = (page - 1) * limit;

    // Build conditions for WHERE clause
    const whereConditions: SQL<unknown>[] = [];

    if (search) {
      whereConditions.push(
        or(
          ilike(category.name, `%${search}%`),
          ilike(category.description || '', `%${search}%`),
        ) as SQL<unknown>,
      );
    }

    if (parentId !== undefined) {
      if (parentId === null) {
        // Get root categories (where parentId is null)
        whereConditions.push(sql`${category.parentId} IS NULL`);
      } else {
        // Get subcategories of a specific parent
        whereConditions.push(eq(category.parentId, parentId));
      }
    }

    const baseQuery = db
      .select({
        id: category.id,
        name: category.name,
        description: category.description,
        slug: category.slug,
        icon: category.icon,
        isRegional: category.isRegional,
        hospitalSpecific: category.hospitalSpecific,
        parentId: category.parentId,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
      })
      .from(category)
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined);

    // Get total count
    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(category)
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined);

    const total = countResult[0]?.count || 0;

    // Get paginated categories
    const result = await baseQuery
      .orderBy(
        sortBy === 'name'
          ? sortOrder === 'asc'
            ? asc(category.name)
            : desc(category.name)
          : sortBy === 'createdAt'
            ? sortOrder === 'asc'
              ? asc(category.createdAt)
              : desc(category.createdAt)
            : sortBy === 'updatedAt'
              ? sortOrder === 'asc'
                ? asc(category.updatedAt)
                : desc(category.updatedAt)
              : asc(category.name),
      )
      .limit(limit)
      .offset(offset);

    // If thread counts are requested, get them for all categories in the result
    let categoriesWithThreadCounts = result;

    if (includeThreadCount && result.length > 0) {
      const categoryIds = result.map((cat) => cat.id);

      const threadCounts = await db
        .select({
          categoryId: thread.categoryId,
          count: sql<number>`count(*)`,
        })
        .from(thread)
        .where(inArray(thread.categoryId, categoryIds))
        .groupBy(thread.categoryId);

      categoriesWithThreadCounts = result.map((cat) => ({
        ...cat,
        threadCount: threadCounts.find((tc) => tc.categoryId === cat.id)?.count || 0,
      }));
    }

    return {
      data: categoriesWithThreadCounts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get all categories in a flat list (for dropdowns, etc.)
   */
  async getAllCategories() {
    const result = await db
      .select({
        id: category.id,
        name: category.name,
        parentId: category.parentId,
        slug: category.slug,
      })
      .from(category)
      .orderBy(asc(category.name));

    return result;
  }

  /**
   * Create a new category
   */
  async createCategory(data: {
    name: string;
    description?: string;
    slug: string;
    icon?: string;
    isRegional?: boolean;
    hospitalSpecific?: boolean;
    parentId?: string;
  }) {
    // Check if slug is unique
    const existingCategory = await db.query.category.findFirst({
      where: eq(category.slug, data.slug),
    });

    if (existingCategory) {
      throw new AppError(ErrorCode.VALIDATION_ERROR);
    }

    // If parentId is provided, check if it exists
    if (data.parentId) {
      const parentCategory = await db.query.category.findFirst({
        where: eq(category.id, data.parentId),
      });

      if (!parentCategory) {
        throw new AppError(ErrorCode.CATEGORY_NOT_FOUND);
      }
    }

    // Create category
    const [newCategory] = await db
      .insert(category)
      .values({
        id: generateCategoryId(),
        name: data.name,
        description: data.description,
        slug: data.slug,
        icon: data.icon,
        isRegional: data.isRegional,
        hospitalSpecific: data.hospitalSpecific,
        parentId: data.parentId,
      })
      .returning();

    return newCategory;
  }

  /**
   * Get a category by ID
   */
  async getCategoryById(id: string, includeThreadCount: boolean = false) {
    // Get category details
    const categoryData = await db.query.category.findFirst({
      where: eq(category.id, id),
      with: {
        parent: {
          columns: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    if (!categoryData) {
      throw new AppError(ErrorCode.CATEGORY_NOT_FOUND);
    }

    // Get subcategories
    const subcategories = await db.query.category.findMany({
      where: eq(category.parentId, id),
      columns: {
        id: true,
        name: true,
        slug: true,
        icon: true,
      },
    });

    let threadCount;

    // If thread count is requested, get it
    if (includeThreadCount) {
      const threadCountResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(thread)
        .where(eq(thread.categoryId, id));

      threadCount = threadCountResult[0]?.count || 0;
    }

    return {
      ...categoryData,
      subcategories,
      threadCount,
    };
  }

  /**
   * Get a category by slug
   */
  async getCategoryBySlug(slug: string, includeThreadCount: boolean = false) {
    // Get category details
    const categoryData = await db.query.category.findFirst({
      where: eq(category.slug, slug),
      with: {
        parent: {
          columns: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    if (!categoryData) {
      throw new AppError(ErrorCode.CATEGORY_NOT_FOUND);
    }

    // Get subcategories
    const subcategories = await db.query.category.findMany({
      where: eq(category.parentId, categoryData.id),
      columns: {
        id: true,
        name: true,
        slug: true,
        icon: true,
      },
    });

    let threadCount;

    // If thread count is requested, get it
    if (includeThreadCount) {
      const threadCountResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(thread)
        .where(eq(thread.categoryId, categoryData.id));

      threadCount = threadCountResult[0]?.count || 0;
    }

    return {
      ...categoryData,
      subcategories,
      threadCount,
    };
  }

  /**
   * Check if a category exists
   */
  private async checkCategoryExists(id: string) {
    const categoryData = await db.query.category.findFirst({
      where: eq(category.id, id),
      columns: {
        id: true,
      },
    });

    if (!categoryData) {
      throw new AppError(ErrorCode.CATEGORY_NOT_FOUND);
    }

    return categoryData;
  }

  /**
   * Update a category
   */
  async updateCategory(
    id: string,
    data: Partial<{
      name: string;
      description: string | null;
      slug: string;
      icon: string | null;
      isRegional: boolean;
      hospitalSpecific: boolean;
      parentId: string | null;
    }>,
  ) {
    // Check if category exists
    await this.checkCategoryExists(id);

    // If slug is being updated, check if it's unique
    if (data.slug) {
      const existingCategory = await db.query.category.findFirst({
        where: and(eq(category.slug, data.slug), sql`${category.id} != ${id}`),
      });

      if (existingCategory) {
        throw new AppError(ErrorCode.VALIDATION_ERROR);
      }
    }

    // If parentId is provided, check if it exists and is not self-referential
    if (data.parentId) {
      // Cannot set parent to self
      if (data.parentId === id) {
        throw new AppError(ErrorCode.BAD_REQUEST);
      }

      const parentCategory = await db.query.category.findFirst({
        where: eq(category.id, data.parentId),
      });

      if (!parentCategory) {
        throw new AppError(ErrorCode.CATEGORY_NOT_FOUND);
      }

      // Check for circular references
      // This is a simplified check - in a production environment, you might want a more thorough check
      if (parentCategory.parentId === id) {
        throw new AppError(ErrorCode.BAD_REQUEST);
      }
    }

    // Update category
    const [updatedCategory] = await db
      .update(category)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(category.id, id))
      .returning();

    return updatedCategory;
  }

  /**
   * Delete a category
   */
  async deleteCategory(id: string) {
    // Check if category exists
    await this.checkCategoryExists(id);

    // Check if category has subcategories
    const subcategories = await db.query.category.findMany({
      where: eq(category.parentId, id),
      columns: {
        id: true,
      },
    });

    if (subcategories.length > 0) {
      throw new AppError(ErrorCode.BAD_REQUEST);
    }

    // Check if category has threads
    const threadCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(thread)
      .where(eq(thread.categoryId, id));

    if (threadCount[0].count > 0) {
      throw new AppError(ErrorCode.BAD_REQUEST);
    }

    // Delete category
    await db.delete(category).where(eq(category.id, id));

    return true;
  }
}

export const categoryService = new CategoryService();
