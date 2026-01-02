import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe, NgFor, NgIf } from '@angular/common';

interface ArticleFile { _id: string; originalName: string; uploadDate: string; filePath: string; }

@Component({
  selector: 'app-article',
  standalone: true,
  imports: [FormsModule, CommonModule,DatePipe,NgIf,NgFor],
  templateUrl: './article.html',
  styleUrl: './article.css',
})
export class Article implements OnInit {
   articles: ArticleFile[] = [];
  loading = false;
  errorMessage = '';

  // ⚠️ REMPLACE par ton vrai project id Supabase
  private readonly SUPABASE_PUBLIC_BASE_URL =
    'https://weyxuvweqvnbdtkjmtob.supabase.co/storage/v1/object/public/articles2/';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.fetchArticles();
  }

  fetchArticles(): void {
        this.loading = true;
        this.errorMessage = ''; // ✅ REMETTRE À ZÉRO avant l'appel

        this.authService.getPublicFiles().subscribe({
            next: (data) => {
                this.articles = data;
                this.loading = false;
                // Si la récupération réussit, errorMessage est déjà ''
            },
            error: (error) => {
                console.error(error);
                this.errorMessage = 'Erreur lors du chargement des articles.';
                this.loading = false;
            }
        });
    }

  /**
   * 🔗 Construit et retourne l'URL Supabase complète du fichier
   */
  getFileUrl(filePath: string): string {
    if (!filePath) {
      return '';
    }

    // Si jamais le backend renvoie déjà une URL complète
    if (filePath.startsWith('http')) {
      return filePath;
    }

    return this.SUPABASE_PUBLIC_BASE_URL + filePath;
  }

  /**
   * ⬇ Téléchargement / ouverture du fichier
   */
  downloadArticle(filePath: string): void {
    const url = this.getFileUrl(filePath);
    window.open(url, '_blank');
  }

}
