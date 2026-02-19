import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { RouterLink } from "@angular/router";
import { AuthService } from '../../services/auth.service';
import { Termos } from '../../modals/termos/termos';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-register-pag',
  imports: [RouterLink, ReactiveFormsModule, MatDialogModule],
  templateUrl: './register-pag.html',
  styleUrl: './register-pag.scss',
})
export class RegisterPag {
 private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  registerForm: FormGroup;
  private dialog = inject(MatDialog);

  registerError: string | null = null;

  openTermosModal(): void {
    this.dialog.open(Termos, {
      width: '800px',
      maxWidth: '90vw',
      maxHeight: '80vh',
      autoFocus: false 
    });
  }

  constructor() {
    this.registerForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      tipo: ['freelancer', [Validators.required]],
      fotoUrl: [null], // Campo do link da foto
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      terms: [false, [Validators.requiredTrue]] 
    }, {
      validators: this.passwordMatcher
    });
  }

  onImageError() {
    this.registerForm.get('fotoUrl')?.setValue(null);
  }
  
  passwordMatcher(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    if (password && confirmPassword && password !== confirmPassword) {
      return { mismatch: true };
    }
    return null;
  }

  submitRegister() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    this.registerError = null;

    this.authService.register(this.registerForm.value).subscribe({
      next: (user) => {
        console.log('Registro bem-sucedido:', user.nome);
      },
      error: (err) => {
        this.registerError = 'Ocorreu um erro ao registrar. Verifique os dados e tente novamente.';
        console.error(err);
      }
    });
  }

}