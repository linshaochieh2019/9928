import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth';
import { EmployerService } from '../../../services/employer.service';
import { Employer } from '../../../models/employer.model';

@Component({
  selector: 'app-employer-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './employer-detail.html'
})
export class EmployerDetailComponent implements OnInit {
  employer?: Employer;
  loading = true;
  error: string | null = null;
  isMyProfile = false;
  selectedImage?: string;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private employerService: EmployerService,
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.fetchEmployer(id);

        this.authService.currentUser$.subscribe((me) => {
          if (me && me.employerId === id) {
            this.isMyProfile = true;
          }
        });
      } else {
        this.error = 'Invalid employer ID';
        this.loading = false;
      }
    });
  }

  private fetchEmployer(id: string): void {
    this.loading = true;
    this.error = null;

    this.employerService.getEmployerById(id).subscribe({
      next: (data) => {
        this.employer = data;
        this.loading = false;

        // Default main image = coverImage OR first image
        if (this.employer?.coverImage) {
          this.selectedImage = this.employer.coverImage;
        } else if (this.employer?.images?.length) {
          this.selectedImage = this.employer.images[0];
        }
      },
      error: () => {
        this.error = 'Failed to load employer profile';
        this.loading = false;
      }
    });
  }

  isOwner(): boolean {
    return this.isMyProfile;
  }

  goEdit(): void {
    if (this.isOwner()) {
      this.router.navigate(['employers/my-employer-profile']);
    }
  }

  get thumbnailImages(): string[] {
    if (!this.employer?.images) return [];
    const cover = this.employer.coverImage;
    if (cover) {
      // Put cover first, then the rest
      return [cover, ...this.employer.images.filter(img => img !== cover)];
    }
    return this.employer.images;
  }

}
