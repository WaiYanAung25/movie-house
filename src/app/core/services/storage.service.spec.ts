import { TestBed } from '@angular/core/testing';
import { StorageService } from './storage.service';

describe('StorageService', () => {
  let service: StorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StorageService);
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should store and retrieve data', () => {
    service.setItem('test-key', { name: 'test', value: 42 });
    const result = service.getItem<{ name: string; value: number }>('test-key');
    expect(result).toEqual({ name: 'test', value: 42 });
  });

  it('should return null for non-existent key', () => {
    const result = service.getItem('non-existent');
    expect(result).toBeNull();
  });

  it('should remove data', () => {
    service.setItem('test-key', 'value');
    service.removeItem('test-key');
    const result = service.getItem('test-key');
    expect(result).toBeNull();
  });

  it('should handle malformed JSON gracefully', () => {
    localStorage.setItem('bad-key', '{invalid json');
    const result = service.getItem('bad-key');
    expect(result).toBeNull();
  });

  it('should handle localStorage errors gracefully', () => {
    spyOn(Storage.prototype, 'getItem').and.throwError('Storage error');
    const result = service.getItem('test-key');
    expect(result).toBeNull();
  });
});
