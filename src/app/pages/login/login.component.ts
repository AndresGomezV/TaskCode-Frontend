import { Component, inject } from '@angular/core';
import {ReactiveFormsModule, FormBuilder, Validators} from "@angular/forms"
import { AuthService } from "../../services/auth.service";
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  private authService: AuthService = inject(AuthService);
  formBuilder: FormBuilder = inject(FormBuilder);
  authError: boolean = false;
  private router: Router = inject(Router)

  loginForm = this.formBuilder.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]]
  })

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.authError = false;

    const { username, password } = this.loginForm.value;

    this.authService.login(username!, password!).subscribe({
      next: response => {
        localStorage.setItem('token', response.token);
        this.authError = false;
        this.router.navigate(['/dashboard']);

      },
      error: () => {
        console.error("Error: username or password are invalid");
        this.authError = true;
      }
    });

  }
}
