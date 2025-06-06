namespace HospitalApi.Models
{
    public class Specialization : BaseEntity
    {
        public int Id { get; set; }  // Unique ID
        public string SpecializationName { get; set; }  // e.g., Interventional Cardiology
        public string? Description { get; set; }  // Optional
        public int? DepartmentId { get; set; }  // FK to Department
        public int? HospitalId { get; set; }
        public Department? Department { get; set; }
    }
}
