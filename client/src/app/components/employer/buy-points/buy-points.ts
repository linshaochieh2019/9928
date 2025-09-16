import { Component } from '@angular/core';
import { PaymentService } from '../../../services/payment';
import { AuthService } from '../../../services/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-buy-points',
  standalone: true,
  templateUrl: './buy-points.html',
  styleUrls: ['./buy-points.scss'],
  imports: [CommonModule]
})
export class BuyPointsComponent {
  
  loading = false;   // ✅ add this state
  errorMsg = '';    // ✅ add this state
  
  constructor(
    private paymentService: PaymentService,
    private authService: AuthService
  ) {}



  buyPoints(amount: number, packageId: string) {
    const employerId = this.authService.getEmployerId();

    if (!employerId) {
      console.error('Employer ID not found. User might not be logged in as an employer.');
      return;
    }

    this.paymentService.initiatePayment({ packageId, employerId })
      .subscribe((data) => this.redirectToNewebPay(data));
  }

  private redirectToNewebPay(initiateData: any) {
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = initiateData.actionUrl;

    ['MerchantID', 'TradeInfo', 'TradeSha', 'Version'].forEach((key) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = initiateData[key];
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
  }
}
