import { Component, OnInit } from '@angular/core';
import { MoviesService } from '../movies/movies.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  moviesInTheaters;
  moviesFutureReleases;

  constructor(private moviesService: MoviesService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.moviesService.getHomePageMovies().subscribe((homeDTO) => {
      this.moviesFutureReleases = homeDTO.upcomingReleases;
      this.moviesInTheaters = homeDTO.inTheaters;
    });
  }

  onDelete() {
    this.loadData();
  }

  onSubscribe(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const emailInput = form.querySelector(
      'input[type="email"]'
    ) as HTMLInputElement;

    if (emailInput && emailInput.value) {
      // TODO: Implement newsletter subscription logic
      console.log('Newsletter subscription for:', emailInput.value);
      emailInput.value = '';
      // You can add a toast notification here
      alert('Thank you for subscribing to our newsletter!');
    }
  }

  exploreMovies() {
    // TODO: Implement navigation to movies page
    console.log('Navigating to movies page');
  }

  learnMore() {
    // TODO: Implement navigation to about page
    console.log('Navigating to about page');
  }
}
