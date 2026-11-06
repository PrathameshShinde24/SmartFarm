import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
  UrlTree,
  provideRouter,
} from '@angular/router';
import { AuthService, DEMO_EMAIL, DEMO_PASSWORD } from '../services/auth.service';
import { authGuard } from './auth-guard';

describe('authGuard', () => {
  function runGuard() {
    return TestBed.runInInjectionContext(() =>
      authGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot),
    );
  }

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
  });

  it('should redirect to login when user is not logged in', () => {
    const result = runGuard();
    expect(result).toBeInstanceOf(UrlTree);
    expect(TestBed.inject(Router).serializeUrl(result as UrlTree)).toBe('/login');
  });

  it('should allow access when user is logged in', () => {
    TestBed.inject(AuthService).login(DEMO_EMAIL, DEMO_PASSWORD);
    expect(runGuard()).toBe(true);
  });
});
