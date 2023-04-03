import { Component, OnInit } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { Cd } from '../models/cd';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CdsService } from 'src/app/services/cds.service';

@Component({
  selector: 'app-new-cd',
  templateUrl: './new-cd.component.html',
  styleUrls: ['./new-cd.component.scss']
})
export class NewCDComponent implements OnInit {
  currentCD$!: Observable<Cd>;

  formulaire!: FormGroup;

  constructor(private formBuilder: FormBuilder, private CDservice: CdsService, private router: Router) { }

  ngOnInit(): void {

    let thumbRegex = new RegExp('https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg|webp)$'); 

    this.formulaire = this.formBuilder.group({
      title: [null, [Validators.required, Validators.minLength(3)]],
      author: [null, [Validators.required, Validators.minLength(1)]],
      price: [null, [Validators.required, Validators.min(1)]],
      thumbnail: [null, [Validators.required, Validators.pattern(thumbRegex)]],
      dateDeSortie: [null, [Validators.required, Validators.minLength(1)]],
      quantite: [null, [Validators.required, Validators.min(1)]]
    }, { 
      updateOn: 'blur' 
    });

    this.currentCD$ = this.formulaire.valueChanges.pipe(map(formValue => (
      {
        id: 0,
        title: formValue.titre,
        author: formValue.artiste,
        price: formValue.prix,
        thumbnail: formValue.image,
        dateDeSortie: formValue.dateDeSortie,
        quantite: formValue.quantite

      })));
  }

  onSubmitForm() {
    let newCd: Cd = {
      id: 0,
      title: this.formulaire.get('title')?.value,
      author: this.formulaire.get('author')?.value,
      price: this.formulaire.get('price')?.value,
      thumbnail: this.formulaire.get('thumbnail')?.value,
      dateDeSortie: this.formulaire.get('dateDeSortie')?.value,
      quantite: this.formulaire.get('quantite')?.value
    };

    this.CDservice.addCD(newCd).pipe(
      tap(() => this.router.navigateByUrl('/catalog'))
    ).subscribe();
  }
 

}
