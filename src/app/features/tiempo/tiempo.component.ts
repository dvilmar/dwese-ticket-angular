import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OpenWeatherService } from '../../core/services/open-weather.service';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-tiempo',
  imports: [CommonModule, FormsModule],
  templateUrl: './tiempo.component.html',
  styleUrls: ['./tiempo.component.css'],
})
export class TiempoComponent {
  private weatherService = inject(OpenWeatherService);
  city = signal('Madrid');
  weather = signal<any>(null);

  getWeather() {
    this.weatherService.getWeather(this.city()).subscribe((data) => {
      this.weather.set(data);
    });
  }

  ngOnInit() {
    this.getWeather();
  }
}
