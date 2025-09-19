import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-employer-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './employer-card.html',
  styleUrls: ['./employer-card.scss']
})
export class EmployerCardComponent {
  @Input() employer: any;
  @Input() photoHeight: number = 180;
}
