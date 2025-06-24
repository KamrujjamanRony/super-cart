import { Component, inject, signal } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { GalleryService } from '../../../services/gallery.service';

@Component({
  selector: 'app-gallery-form',
  imports: [FormsModule],
  templateUrl: './gallery-form.component.html',
  styleUrl: './gallery-form.component.css'
})
export class GalleryFormComponent {
  galleryService = inject(GalleryService);
  route = inject(ActivatedRoute);
  id: any = null;
  model?: any;
  paramsSubscription?: Subscription;
  gallerySubscription?: Subscription;
  error = signal<any>(null);
  success = signal<any>(null);
  loading = signal<boolean>(false);

  constructor() {
    this.onReset();
  }

  ngOnInit(): void {
    this.paramsSubscription = this.route.paramMap.subscribe({
      next: (params) => {
        this.id = params.get('id');
        if (this.id) {
          this.galleryService.getGallery({
            "search": this.id
          })
            .subscribe({
              next: (response) => {
                if (response) {
                  this.model = response[0];
                }
              }
            });
        }
      }
    });
  }

  onFormSubmit(): void {
    this.loading.set(true);
    const { title, link } = this.model;

    if (title && link) {
      if (this.id) {
        this.gallerySubscription = this.galleryService.updateGallery(this.id, this.model)
          .subscribe({
            next: (response) => {
              this.success.set('Gallery Update successfully');
              this.onReset();
              this.id = null;
              setTimeout(() => {
                this.success.set(null);
                this.loading.set(false);
              }, 1500);
            },
            error: (error) => {
              this.error.set(error.error.message);
              console.error('Error Update Gallery:', error.error);
              setTimeout(() => {
                this.error.set(null);
                this.loading.set(false);
              }, 1500);
            }
          });
      } else {
        this.gallerySubscription = this.galleryService.addGallery(this.model)
          .subscribe({
            next: (response) => {
              this.success.set('Gallery Add successfully');
              this.onReset();
              setTimeout(() => {
                this.success.set(null);
                this.loading.set(false);
              }, 1500);
            },
            error: (error) => {
              this.error.set(error.error.message);
              console.error('Error Add Gallery:', error.error);
              setTimeout(() => {
                this.error.set(null);
                this.loading.set(false);
              }, 1500);
            }
          });
      }
    } else {
      this.error.set('Please Fill all the required fields')
      setTimeout(() => {
        this.error.set(null);
        this.loading.set(false);
      }, 1500);
    }
  };

  onReset() {
    this.model = {
      title: "",
      description: "",
      link: "",
    };
  }

  ngOnDestroy(): void {
    this.paramsSubscription?.unsubscribe();
    this.gallerySubscription?.unsubscribe();
  }

}
