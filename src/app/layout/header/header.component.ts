import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { NotificationsComponent } from '../../shared/notifications/notifications.component';

@Component({
  selector: 'app-header',
  imports: [RouterLink, CommonModule, NotificationsComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  private subscription: Subscription | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
      this.subscription = this.authService.isLoggedIn().subscribe((loggedIn) => {
        this.isLoggedIn = loggedIn;
      });
  }

  logout() {
    this.authService.logout();
  }

  ngOnDestroy(): void {
      if (this.subscription) {
        this.subscription.unsubscribe();
      }
  }
}
