import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormBuilder, FormGroup, Validators, ReactiveFormsModule} from "@angular/forms";
import { Router } from '@angular/router';
import { TripDataService } from '../services/trip-data.service';

@Component({
  selector: 'app-add-trip',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-trip.component.html',
  styleUrl: './add-trip.component.css'
})

export class AddTripComponent implements OnInit{
  public addForm!: FormGroup;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private tripService: TripDataService
  ) {}

  ngOnInit(){
    this.addForm = this.formBuilder.group({
      _id:[],
      code: ['', Validators.required],
      name: ['', Validators.required],
      nights: [0, [Validators.required, Validators.min(0)]],
      days: [0, [Validators.required, Validators.min(0)]],
      start: ['', Validators.required],
      resort: ['', Validators.required],
      perPerson: ['', Validators.required],
      image: ['', Validators.required],
      description: ['', Validators.required],
    })
  }

  public onSubmit(): void {
    this.submitted = true;
  
    if (this.addForm.valid) {
      // Combine nights and days into a single length field
      const formData = {
        ...this.addForm.value,
        length: `${this.addForm.value.nights}  / ${this.addForm.value.days} `
      };
  
      this.tripService.addTrip(formData).subscribe({
        next: (data: any) => {
          console.log('Trip added successfully:', data);
          this.router.navigate(['']);
        },
        error: (error: any) => {
          console.error('Error adding trip:', error);
        }
      });
    }
  }
  
  get f() {return this.addForm.controls;}
}
