import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-unlock-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './unlock-modal.html'
})
export class UnlockModalComponent {
  @Input() teacher: any;
  @Input() employerPoints: number = 0;
  @Output() confirmUnlock = new EventEmitter<void>();
  @Output() buyPoints = new EventEmitter<void>();

  get hasEnoughPoints(): boolean {
    return this.employerPoints >= 1;
  }
}
