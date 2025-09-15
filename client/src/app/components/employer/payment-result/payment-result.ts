import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth';

@Component({
  selector: "app-payment-result",
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="text-center p-5">
      @if (status === 'success') {
        <h2>🎉 Payment Successful!</h2>
        <p>Your points have been added. You can now unlock teacher contacts.</p>
        <button class="btn btn-primary" routerLink="/employers/points">
          Go to My Points
        </button>
      } @else if (status === 'cancel') {
        <h2>⚠️ Payment Cancelled</h2>
        <p>Your transaction was cancelled. No points were deducted.</p>
        <button class="btn btn-secondary" routerLink="/employers/points">
          Back to My Points
        </button>
      } @else {
        <h2>❌ Payment Failed</h2>
        <p>Something went wrong. Please try again or contact support.</p>
        <button class="btn btn-danger" routerLink="/employers/points">
          Back to My Points
        </button>
      }
    </div>
  `
})
export class PaymentResultComponent implements OnInit {
  status: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.status = this.route.snapshot.queryParamMap.get('status');

    // Refresh user info so updated points balance is visible
    this.authService.fetchMe().subscribe();
  }
}
