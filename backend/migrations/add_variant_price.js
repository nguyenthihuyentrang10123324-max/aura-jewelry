const pool = require('../config/database');

async function migrate() {
  const conn = await pool.getConnection();
  try {
    // 1. Add price column to product_variants if missing
    const [variantCols] = await conn.query('DESCRIBE product_variants');
    const hasPrice = variantCols.some(c => c.Field === 'price');
    if (hasPrice) {
      console.log('✓ Column price already exists in product_variants');
    } else {
      await conn.query(
        'ALTER TABLE product_variants ADD COLUMN price DECIMAL(12,2) DEFAULT NULL AFTER price_modifier'
      );
      console.log('✓ Added price column to product_variants');
    }

    // 2. Add view_count column to products if missing
    const [productCols] = await conn.query('DESCRIBE products');
    const hasViewCount = productCols.some(c => c.Field === 'view_count');
    if (hasViewCount) {
      console.log('✓ Column view_count already exists in products');
    } else {
      await conn.query(
        'ALTER TABLE products ADD COLUMN view_count INT DEFAULT 0 AFTER seo_description'
      );
      console.log('✓ Added view_count column to products');
    }

    console.log('Migration completed successfully!');
  } catch (err) {
    console.error('Migration error:', err.message);
  } finally {
    conn.release();
    await pool.end();
  }
}

migrate();
