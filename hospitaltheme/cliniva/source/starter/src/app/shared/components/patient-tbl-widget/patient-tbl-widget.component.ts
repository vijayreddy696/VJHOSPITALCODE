import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { FeatherIconsComponent } from '../feather-icons/feather-icons.component';

export interface Patient {
  image: string;
  name: string;
  doctor: string;
  doctorEmail: string;
  date: string;
  disease: string;
  diseaseClass: string;
}

@Component({
  selector: 'app-patient-tbl-widget',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatTableModule,
    CommonModule,
    FeatherIconsComponent,
  ],
  templateUrl: './patient-tbl-widget.component.html',
  styleUrl: './patient-tbl-widget.component.scss',
})
export class PatientTblWidgetComponent {
  displayedColumns: string[] = ['name', 'doctor', 'date', 'disease', 'actions'];
  patientDatasource: Patient[] = [
    {
      image: 'assets/images/user/user1.jpg',
      name: 'John Doe',
      doctor: 'Dr.Jacob Ryan',
      doctorEmail: 'test@gmail.com',
      date: '12/05/2016',
      disease: 'Fever',
      diseaseClass: 'col-red',
    },
    {
      image: 'assets/images/user/user2.jpg',
      name: 'Sarah Smith',
      doctor: 'Dr.Rajesh',
      doctorEmail: 'test@gmail.com',
      date: '12/05/2016',
      disease: 'Cholera',
      diseaseClass: 'col-green',
    },
    {
      image: 'assets/images/user/user3.jpg',
      name: 'Airi Satou',
      doctor: 'Dr.Jay Soni',
      doctorEmail: 'test@gmail.com',
      date: '12/05/2016',
      disease: 'Jaundice',
      diseaseClass: 'col-purple',
    },
    {
      image: 'assets/images/user/user4.jpg',
      name: 'Angelica Ramos',
      doctor: 'Dr.John Deo',
      doctorEmail: 'test@gmail.com',
      date: '12/05/2016',
      disease: 'Typhoid',
      diseaseClass: 'col-purple',
    },
    {
      image: 'assets/images/user/user5.jpg',
      name: 'Ashton Cox',
      doctor: 'Dr.Megha Trivedi',
      doctorEmail: 'test@gmail.com',
      date: '12/05/2016',
      disease: 'Malaria',
      diseaseClass: 'col-orange',
    },
    {
      image: 'assets/images/user/user8.jpg',
      name: 'Cara Stevens',
      doctor: 'Dr.Sarah Smith',
      doctorEmail: 'test@gmail.com',
      date: '12/05/2016',
      disease: 'Infection',
      diseaseClass: 'col-cyan',
    },
    {
      image: 'assets/images/user/user6.jpg',
      name: 'Michael Brown',
      doctor: 'Dr.Anna Taylor',
      doctorEmail: 'test@gmail.com',
      date: '12/05/2016',
      disease: 'Pneumonia',
      diseaseClass: 'col-blue',
    },
    {
      image: 'assets/images/user/user7.jpg',
      name: 'Emily White',
      doctor: 'Dr.Kate Wilson',
      doctorEmail: 'test@gmail.com',
      date: '12/05/2016',
      disease: 'Diabetes',
      diseaseClass: 'col-yellow',
    },
    {
      image: 'assets/images/user/user9.jpg',
      name: 'James Green',
      doctor: 'Dr.Nina Patel',
      doctorEmail: 'test@gmail.com',
      date: '12/05/2016',
      disease: 'Hypertension',
      diseaseClass: 'col-red',
    },
    {
      image: 'assets/images/user/user10.jpg',
      name: 'Olivia Black',
      doctor: 'Dr.Ethan Clark',
      doctorEmail: 'test@gmail.com',
      date: '12/05/2016',
      disease: 'Asthma',
      diseaseClass: 'col-orange',
    },
  ];
}
