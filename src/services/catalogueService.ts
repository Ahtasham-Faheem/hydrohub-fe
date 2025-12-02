import type { CatalogueItem } from '../types/catalogue';

const LS_KEY = 'hydro_catalog_v1';

export class CatalogueService {
  static load(): CatalogueItem[] {
    try {
      return JSON.parse(localStorage.getItem(LS_KEY) || '[]');
    } catch {
      return [];
    }
  }

  static save(items: CatalogueItem[]): void {
    localStorage.setItem(LS_KEY, JSON.stringify(items));
  }

  static getAll(): CatalogueItem[] {
    return this.load();
  }

  static getById(id: string): CatalogueItem | null {
    return this.load().find(item => item.id === id) || null;
  }

  static create(item: Omit<CatalogueItem, 'id' | 'updated'>): CatalogueItem {
    const newItem: CatalogueItem = {
      ...item,
      id: `item_${Date.now()}_${Math.floor(Math.random() * 9000)}`,
      updated: Date.now(),
    };
    const items = this.load();
    items.unshift(newItem);
    this.save(items);
    return newItem;
  }

  static update(id: string, updates: Partial<CatalogueItem>): CatalogueItem | null {
    const items = this.load();
    const index = items.findIndex(item => item.id === id);
    if (index === -1) return null;
    
    items[index] = {
      ...items[index],
      ...updates,
      id: items[index].id, // Ensure id doesn't change
      updated: Date.now(),
    };
    this.save(items);
    return items[index];
  }

  static delete(id: string): boolean {
    const items = this.load();
    const filtered = items.filter(item => item.id !== id);
    if (filtered.length === items.length) return false;
    this.save(filtered);
    return true;
  }

  static toggleStatus(id: string): CatalogueItem | null {
    const item = this.getById(id);
    if (!item) return null;
    return this.update(id, {
      status: item.status === 'active' ? 'inactive' : 'active',
    });
  }

  static getCategories(): string[] {
    const items = this.load();
    const cats = Array.from(new Set(items.map(i => i.category).filter(Boolean) as string[]));
    return cats.length ? cats : ['Water', 'Accessories', 'Services'];
  }

  static getCollections(): string[] {
    const items = this.load();
    const cols = Array.from(new Set(items.map(i => i.collection).filter(Boolean) as string[]));
    return cols.length ? cols : ['Bottles', 'Dispenser', 'Delivery'];
  }

  static addCategory(category: string): void {
    const cats = this.getCategories();
    if (!cats.includes(category)) {
      cats.unshift(category);
    }
  }

  static addCollection(collection: string): void {
    const cols = this.getCollections();
    if (!cols.includes(collection)) {
      cols.unshift(collection);
    }
  }

  static seedIfEmpty(): void {
    if (this.load().length === 0) {
      const demo: CatalogueItem[] = [
        {
          id: `item_${Date.now()}_1`,
          name: '19L Mineral Water',
          subHeading: 'Pure Mineral',
          category: 'Water',
          collection: 'Bottles',
          type: 'product',
          sellingPrice: 300,
          salePrice: 300,
          discountAmount: 0,
          discountPercent: 0,
          costPrice: 120,
          mainImage: 'https://springs.com.pk/cdn/shop/files/606e0ce9a2e7fd051a03c670508d05dc_940x.jpg?v=1752039304',
          gallery: ['https://springs.com.pk/cdn/shop/files/606e0ce9a2e7fd051a03c670508d05dc_940x.jpg?v=1752039304'],
          status: 'active',
          sku: 'W19-001',
          barcode: '123456789012',
          tags: ['water', 'bottle'],
          rating: 4,
          variants: [],
          markSale: false,
          stockManaged: true,
          openingStock: 100,
          stockIn: 0,
          stockOut: 10,
          currentStock: 90,
          updated: Date.now(),
        },
        {
          id: `item_${Date.now()}_2`,
          name: 'Sparkling Water 500ml',
          subHeading: 'Sparkle',
          category: 'Sparkling',
          collection: 'Bottles',
          type: 'product',
          sellingPrice: 120,
          salePrice: 120,
          discountAmount: 0,
          discountPercent: 0,
          costPrice: 50,
          mainImage: '',
          gallery: [],
          status: 'active',
          sku: 'SP500-01',
          barcode: '987654321098',
          tags: ['sparkling'],
          rating: 5,
          variants: [],
          markSale: false,
          stockManaged: true,
          openingStock: 200,
          stockIn: 0,
          stockOut: 20,
          currentStock: 180,
          updated: Date.now(),
        },
      ];
      this.save(demo);
    }
  }
}
