import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { PhotoService } from '../../services/photo.service';
import { Photo } from '../../interfaces/Photo';



@Component({
  selector: 'app-photos-list',
  templateUrl: './photos-list.component.html',
  styleUrls: ['./photos-list.component.css'],
})
export class PhotosListComponent implements OnInit {
  photos: Photo[] = [];
  showDescription: boolean = false;
  processingReactions: { [key: string]: boolean } = {};



  currentPage: number = 1;
  itemsPerPage: number = 13;

  constructor(private photoService: PhotoService, private router: Router, private changeDetectorRef: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadPhotos();
  }

  loadPhotos(): void {
    this.photoService.getPhotos().subscribe(
      (res) => {
        this.photos = res;
        this.changeDetectorRef.detectChanges();

      },
      (err) => console.log(err)
    );
  }
  addNewPhoto(newPhoto: Photo): void {
    this.photos.unshift(newPhoto);
    this.changeDetectorRef.detectChanges();
  }

  selectedCard(id: string | undefined): void {
    if (id) {
      this.router.navigate(['/photosview', id]);
    }
  }

  onReact(event: MouseEvent, photoId: string): void {
    if (this.processingReactions[photoId]) {
        return;
    }
  
    this.processingReactions[photoId] = true;
  
    this.photoService.reactToPhoto(photoId).subscribe(
        (response) => {
        const updatedPhoto = response.photo;
        const index = this.photos.findIndex(photo => photo._id === photoId);
        if (index !== -1) {
          this.photos[index].reactions = updatedPhoto.reactions;
          this.changeDetectorRef.detectChanges();
          console.log(`Reaccionado correctamente a la foto con ID: ${photoId}. Número actual de reacciones: ${updatedPhoto.reactions}`);
  
          const reactionsCountEl = document.getElementById(`reactions-count-${photoId}`);
          if (reactionsCountEl) {
              const formattedReactions = updatedPhoto.reactions.toLocaleString();
              reactionsCountEl.textContent = formattedReactions;
  
              reactionsCountEl.classList.add('show');
              setTimeout(() => {
                  reactionsCountEl.classList.remove('show');
              }, 2000); 
          }
      }
      
        this.processingReactions[photoId] = false;
      },
      (err) => {
        console.error('Error al reaccionar a la foto', err);
        this.processingReactions[photoId] = false;
      }
    );
  }

updatePhotoInList(photoId: string, updatedPhoto: Photo): void {
  const index = this.photos.findIndex(photo => photo._id === photoId);
  if (index !== -1) {
    this.photos[index].reactions = updatedPhoto.reactions; 
  }
}
getCurrentPagePhotos(): Photo[] {
  const startIndex = (this.currentPage - 1) * this.itemsPerPage;
  const endIndex = startIndex + this.itemsPerPage;
  return this.photos.slice(startIndex, endIndex);
}

  getPageNumbers(): number[] {
    const pageCount = Math.ceil(this.photos.length / this.itemsPerPage);
    return Array.from({ length: pageCount }, (_, index) => index + 1);
  }

  onPageChange(pageNumber: number): void {
    this.currentPage = pageNumber;
  }
}
