import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, DEMO_EMAIL, DEMO_PASSWORD } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private auth = inject(AuthService);
  private router = inject(Router);
  private fb = inject(NonNullableFormBuilder);

  demoEmail = DEMO_EMAIL;
  demoPassword = DEMO_PASSWORD;
  errorMessage = signal('');
  showPassword = signal(false);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  constructor() {
    if (this.auth.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }

  useDemo(): void {
    this.form.setValue({ email: this.demoEmail, password: this.demoPassword });
    this.errorMessage.set('');
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { email, password } = this.form.getRawValue();
    if (this.auth.login(email, password)) {
      this.router.navigate(['/dashboard']);
    } else {
      this.errorMessage.set('Invalid email or password. Use the demo login shown below.');
    }
  }
}
