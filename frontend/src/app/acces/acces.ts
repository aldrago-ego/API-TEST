import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-acces',
  imports: [CommonModule],
  templateUrl: './acces.html',
  styleUrl: './acces.css',
})
export class Acces {
  showComiteOptions: boolean = false;

  constructor(private router: Router) {}

  // Fonction pour afficher les options si le comité clique sur sa carte
  selectComite() {
    this.showComiteOptions = true;
  }
  
  // Fonction de navigation
  goTo(route: string) {
    this.router.navigate([route]);
  }

}
