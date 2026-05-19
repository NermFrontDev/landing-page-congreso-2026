import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import Aos from 'aos';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  ngOnInit() {
    Aos.init({
      once: false,
      duration: 500,
      easing: 'ease',
    });
  }

}
