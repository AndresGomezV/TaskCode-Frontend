import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import {LoginComponent} from './pages/login/login.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ReactiveFormsModule, LoginComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'taskcode-front';
}
