import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PhotoService } from '../../services/photo.service';
import Swal from 'sweetalert2';

interface HtmlInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}

@Component({
  selector: 'app-photo-form',
  templateUrl: './photo-form.component.html',
  styleUrls: ['./photo-form.component.css']
})
export class PhotoFormComponent implements OnInit {

  photoSelected!: string | ArrayBuffer;
  file!: File;

  constructor(private photoService: PhotoService, private router: Router) { }

  ngOnInit() {
  }

  onPhotoSelected(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files[0]) {
      this.file = inputElement.files[0];
      const reader = new FileReader();
      reader.onload = e => this.photoSelected = reader.result as string;
      reader.readAsDataURL(this.file);
    }
  }
  uploadPhoto(title: HTMLInputElement, description: HTMLTextAreaElement) {
    if (!title.value || !description.value) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El título y la descripción son obligatorios',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Aceptar'
      });
      return false;
    }

    this.photoService
      .createPhoto(title.value, description.value, this.file)
      .subscribe(
        res => {
          console.log(res);
          this.router.navigate(['/photos']);
        },
        err => console.log(err)
      );
    return false;
  }
}