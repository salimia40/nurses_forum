import { z } from 'zod';
import { zValidator } from '~/utils/validator-wrapper';
import { categoryService } from '../services/category.service';
import { requireAdmin, requireAuth } from './middlewares';
import { factory } from './__base';

const app = factory.createApp();

// Zod schemas for validation
const categoryInsertSchema = z.object({
  name: z.string().min(3).max(100),
  description: z.string().optional(),
  slug: z
    .string()
    .min(3)
    .max(100)
    .regex(/^[a-z0-9-]+$/),
  icon: z.string().optional(),
  isRegional: z.boolean().optional(),
  hospitalSpecific: z.boolean().optional(),
  parentId: z.string().optional(),
});

const categoryUpdateSchema = z.object({
  name: z.string().min(3).max(100).optional(),
  description: z.string().optional().nullable(),
  slug: z
    .string()
    .min(3)
    .max(100)
    .regex(/^[a-z0-9-]+$/)
    .optional(),
  icon: z.string().optional().nullable(),
  isRegional: z.boolean().optional(),
  hospitalSpecific: z.boolean().optional(),
  parentId: z.string().optional().nullable(),
});

const categoryQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  search: z.string().optional(),
  parentId: z.string().optional().nullable(),
  includeThreadCount: z.coerce.boolean().optional(),
  sortBy: z.enum(['name', 'createdAt', 'updatedAt']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

// GET /category - Get a list of categories with pagination and filters
app.get('/', zValidator('query', categoryQuerySchema), async (c) => {
  const query = c.req.valid('query');

  // Handle special case for parentId=null
  const parentId = query.parentId === 'null' ? null : query.parentId;

  const categories = await categoryService.getCategories({
    ...query,
    parentId,
  });

  return c.json({
    success: true,
    ...categories,
  });
});

// GET /category/all - Get all categories (for dropdowns, etc.)
app.get('/all', async (c) => {
  const categories = await categoryService.getAllCategories();

  return c.json({
    success: true,
    data: categories,
  });
});

// POST /category - Create a new category (admin only)
app.post('/', requireAdmin, zValidator('json', categoryInsertSchema), async (c) => {
  const categoryData = c.req.valid('json');

  const newCategory = await categoryService.createCategory(categoryData);

  return c.json(
    {
      success: true,
      data: newCategory,
      message: 'دسته‌بندی با موفقیت ایجاد شد.',
    },
    201,
  );
});

// GET /category/:id - Get a category by ID
app.get('/:id', async (c) => {
  const { id } = c.req.param();
  const includeThreadCount = c.req.query('includeThreadCount') === 'true';

  const category = await categoryService.getCategoryById(id, includeThreadCount);

  return c.json({
    success: true,
    data: category,
  });
});

// GET /category/slug/:slug - Get a category by slug
app.get('/slug/:slug', async (c) => {
  const { slug } = c.req.param();
  const includeThreadCount = c.req.query('includeThreadCount') === 'true';

  const category = await categoryService.getCategoryBySlug(slug, includeThreadCount);

  return c.json({
    success: true,
    data: category,
  });
});

// PUT /category/:id - Update a category (admin only)
app.put('/:id', requireAuth, zValidator('json', categoryUpdateSchema), async (c) => {
  const { id } = c.req.param();
  const categoryData = c.req.valid('json');

  // Handle special case for parentId=null
  const parentId = categoryData.parentId === 'null' ? null : categoryData.parentId;

  const updatedCategory = await categoryService.updateCategory(id, {
    ...categoryData,
    parentId,
  });

  return c.json({
    success: true,
    data: updatedCategory,
    message: 'دسته‌بندی با موفقیت به‌روزرسانی شد.',
  });
});

// DELETE /category/:id - Delete a category (admin only)
app.delete('/:id', requireAdmin, async (c) => {
  const { id } = c.req.param();

  await categoryService.deleteCategory(id);

  return c.json({
    success: true,
    message: 'دسته‌بندی با موفقیت حذف شد.',
  });
});

export default app;
