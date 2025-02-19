import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegionService } from '../../core/services/region.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-regions',
  imports: [CommonModule],
  templateUrl: './regions.component.html',
  styleUrl: './regions.component.scss'
})
export class RegionsComponent implements OnInit {
  regions: any[] = [];
  error: string | null = null;

  constructor(private regionService: RegionService, private router: Router) {}

  ngOnInit() {
    this.regionService.fetchRegions().subscribe({
      next: (res: any) => (this.regions = res),

      error: (err) => {
        if (err.status === 403) {
          this.router.navigate(['/forbidden']);
          } else {
            this.error = 'An error occurred';
          }
      },
      });
  }
}