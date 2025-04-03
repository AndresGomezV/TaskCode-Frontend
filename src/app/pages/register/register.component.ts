import { Component, inject, AfterViewInit  } from '@angular/core';
import {ReactiveFormsModule, FormBuilder, Validators} from "@angular/forms";
import { AuthService } from "../../services/auth.service";
import { Router } from '@angular/router';
import M from 'materialize-css'

@Component({
  selector: 'app-register',
  imports: [ ReactiveFormsModule ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements AfterViewInit {

  private router = inject(Router)
  private authService = inject(AuthService);
  formBuilder: FormBuilder = inject(FormBuilder);
  authError: boolean = false;

  registerForm = this.formBuilder.group({
    username: ['', [Validators.required, Validators.minLength(6)]],
    password: ['', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,}$/)]],
    role: ['USER', [Validators.required]]
  });

  onSubmit() {
    if(this.registerForm.invalid) return;

    this.authError = false;

    const { username, password, role } = this.registerForm.value;

    if(this.authService.userExists(username!)) {
      this.authError = true;
    }

    this.authService.register(username!, password!, role!).subscribe({
      next: response => {
        console.log('User registered successfully.', response);
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Registration failed', error);
        this.authError = true;
      }
    })
  }
  ngAfterViewInit() {
    setTimeout(() => {
      const elems = document.querySelectorAll('select');
      M.FormSelect.init(elems);
    }, 0);
  }
}
