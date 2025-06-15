import {
  Component,
  OnInit,
  ChangeDetectorRef,
  HostListener,
} from '@angular/core';
import { SecurityService } from '../security/security.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

interface SearchResult {
  id: number;
  name: string;
  type: 'movie' | 'actor' | 'genre';
  icon?: string;
}

interface Notification {
  id: number;
  title: string;
  message: string;
  time: Date;
  read: boolean;
  icon: string;
  link?: string;
}

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent implements OnInit {
  isMobileView = false;
  isMobileMenuOpen = false;
  isDarkTheme = false;
  searchQuery = '';
  searchResults: SearchResult[] = [];
  private searchSubject = new Subject<string>();

  notifications: Notification[] = [];
  notificationCount = 0;
  userAvatar = 'assets/default-avatar.png';
  memberSince = new Date('2025-01-01');

  genres = [
    { id: 1, name: 'Action', icon: 'local_fire_department' },
    { id: 2, name: 'Comedy', icon: 'sentiment_very_satisfied' },
    { id: 3, name: 'Drama', icon: 'theater_comedy' },
    { id: 4, name: 'Horror', icon: 'coronavirus' },
    { id: 5, name: 'Romance', icon: 'favorite' },
    { id: 6, name: 'Sci-Fi', icon: 'rocket' },
    { id: 7, name: 'Thriller', icon: 'psychology' },
    { id: 8, name: 'Documentary', icon: 'chrome_reader_mode' },
  ];

  constructor(
    public securityService: SecurityService,
    private dialog: MatDialog,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.checkScreenSize();
    // Initialize search debounce
    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((query) => {
        this.performSearch(query);
      });
  }

  @HostListener('window:resize')
  onResize() {
    this.checkScreenSize();
  }

  private checkScreenSize() {
    this.isMobileView = window.innerWidth <= 768;
    if (!this.isMobileView) {
      this.isMobileMenuOpen = false;
    }
  }

  ngOnInit(): void {
    this.loadUserData();
    this.loadNotifications();
    this.loadThemePreference();
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  onSearchInput(): void {
    this.searchSubject.next(this.searchQuery);
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.searchResults = [];
  }

  performSearch(query: string): void {
    if (!query.trim()) {
      this.searchResults = [];
      return;
    }

    // Mock search results - replace with actual API calls
    const mockResults: SearchResult[] = [
      { id: 1, name: 'The Dark Knight', type: 'movie' },
      { id: 2, name: 'Tom Hanks', type: 'actor' },
      { id: 3, name: 'Action', type: 'genre' },
    ];

    this.searchResults = mockResults.filter((result) =>
      result.name.toLowerCase().includes(query.toLowerCase())
    );
  }

  navigateToResult(result: SearchResult): void {
    switch (result.type) {
      case 'movie':
        this.router.navigate(['/movies', result.id]);
        break;
      case 'actor':
        this.router.navigate(['/actors', result.id]);
        break;
      case 'genre':
        this.router.navigate(['/movies/filter'], {
          queryParams: { genre: result.id },
        });
        break;
    }
    this.clearSearch();
  }

  toggleTheme(): void {
    this.isDarkTheme = !this.isDarkTheme;
    document.body.classList.toggle('dark-theme');
    localStorage.setItem('theme', this.isDarkTheme ? 'dark' : 'light');
  }

  loadThemePreference(): void {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
      this.isDarkTheme = true;
      document.body.classList.add('dark-theme');
    }
  }

  loadUserData(): void {
    if (this.securityService.isAuthenticated()) {
      // Load user data from API
      // This is a mock implementation
      const userData = {
        avatar: 'assets/default-avatar.png',
        memberSince: new Date('2025-01-01'),
      };

      this.userAvatar = userData.avatar;
      this.memberSince = userData.memberSince;
    }
  }

  loadNotifications(): void {
    // Mock notifications - replace with actual API calls
    this.notifications = [
      {
        id: 1,
        title: 'New Movie Release',
        message: 'The Dark Knight is now playing in theaters',
        time: new Date(),
        read: false,
        icon: 'movie',
        link: '/movies/1',
      },
      {
        id: 2,
        title: 'Account Update',
        message: 'Your profile has been updated successfully',
        time: new Date(Date.now() - 86400000), // 1 day ago
        read: true,
        icon: 'person',
      },
    ];
    this.updateNotificationCount();
  }

  handleNotification(notification: Notification): void {
    if (!notification.read) {
      notification.read = true;
      this.updateNotificationCount();
    }
    if (notification.link) {
      this.router.navigate([notification.link]);
    }
  }

  clearNotifications(): void {
    this.notifications = [];
    this.updateNotificationCount();
  }

  private updateNotificationCount(): void {
    this.notificationCount = this.notifications.filter((n) => !n.read).length;
    this.cdr.detectChanges();
  }
}
