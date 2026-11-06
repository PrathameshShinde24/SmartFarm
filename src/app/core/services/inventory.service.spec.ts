import { TestBed } from '@angular/core/testing';
import { InventoryService } from './inventory.service';

describe('InventoryService', () => {
  let service: InventoryService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(InventoryService);
  });

  it('should load 15 demo items with 3 low stock items', () => {
    expect(service.items().length).toBe(15);
    expect(service.lowStockItems().length).toBe(3);
  });

  it('should increase quantity when restocked', () => {
    const item = service.lowStockItems()[0];
    service.restock(item.id, 10);
    const updated = service.items().find((i) => i.id === item.id);
    expect(updated?.quantity).toBe(item.quantity + 10);
    expect(service.lowStockItems().length).toBe(2);
  });

  it('should restore demo data on reset', () => {
    service.delete(service.items()[0].id);
    service.reset();
    expect(service.items().length).toBe(15);
  });
});
