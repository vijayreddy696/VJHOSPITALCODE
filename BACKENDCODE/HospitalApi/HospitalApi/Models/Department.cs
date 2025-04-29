namespace HospitalApi.Models
{
    public class Department : BaseEntity
    {
        public int Id { get; set; }  // Unique identifier for the department
        public string DepartmentName { get; set; }  // Name of the department (e.g., Cardiology)

        // Foreign key to the Hospital model
        public int HospitalId { get; set; }

        // Optional: description of what the department does
        public string? Description { get; set; }

        // Optional: status of the department (active/inactive)
        public bool Status { get; set; }
        // Department head details
        public string DepartmentHeadName { get; set; }  // Name of the department head
        public string DepartmentHeadEmail { get; set; }  // Email of the department head
        public string DepartmentHeadPhoneNumber { get; set; }  // Phone number of the department head

        public Hospital? Hospital { get; set; }

    }
}
