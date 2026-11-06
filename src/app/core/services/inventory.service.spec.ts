import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { seedInventory } from '../data/seed-data';
import { API_URL } from './api';
import { InventoryService } from './inventory.service';

describe('InventoryService', () => {
  let service: InventoryService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(InventoryService);
    httpMock = TestBed.inject(HttpTestingController);
    httpMock.expectOne(`${API_URL}/inventory`).flush(seedInventory());
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should load 15 items with 3 low stock items', () => {
    expect(service.items().length).toBe(15);
    expect(service.lowStockItems().length).toBe(3);
  });

  it('should increase quantity when an item is restocked', () => {
    const item = service.lowStockItems()[0];
    service.restock(item, 10);

    const request = httpMock.expectOne(`${API_URL}/inventory/${item.id}`);
    expect(request.request.method).toBe('PUT');
    expect(request.request.body.quantity).toBe(item.quantity + 10);
    request.flush(request.request.body);

    expect(service.lowStockItems().length).toBe(2);
  });

  it('should not send a request when restock quantity is zero', () => {
    service.restock(service.items()[0], 0);
    httpMock.expectNone(`${API_URL}/inventory/${service.items()[0].id}`);
  });

  it('should send a DELETE request and remove the item', () => {
    const item = service.items()[0];
    service.delete(item.id);

    const request = httpMock.expectOne(`${API_URL}/inventory/${item.id}`);
    expect(request.request.method).toBe('DELETE');
    request.flush({});

    expect(service.items().length).toBe(14);
  });
});
