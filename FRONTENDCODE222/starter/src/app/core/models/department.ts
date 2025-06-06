export class Department {
    id?: number;  // Optional, assigned by backend when created
    departmentName!: string;  // Name of the department (e.g., Cardiology)
    description?: string;  // Optional description of the department
    departmentHeadName!: string;  // Name of the department head
    departmentHeadEmail!: string;  // Email of the department head
    departmentHeadPhoneNumber!: string;  // Phone number of the department head
  }
  