namespace HospitalApi.Dtos
{
    public class DoctorDto
    {
        public int Id { get; set; }
        public string FullName { get; set; } = null!;
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string Gender { get; set; }
        public int HospitalId { get; set; }
        public int QualificationId { get; set; }
        public int SpecializationId { get; set; }
        public DateTime CreatedDate { get; set; }
        public int Experience { get; set; }
        public bool IsActive { get; set; }

        public QualificationDto Qualification { get; set; }
        public SpecializationDto Specialization { get; set; }
    }

    public class QualificationDto
    {
        public int Id { get; set; }
        public string Code { get; set; } = null!;
    }

    public class SpecializationDto
    {
        public int Id { get; set; }
        public string SpecializationName { get; set; } = null!;
        public int DepartmentId { get; set; }

        public DepartmentDto Department { get; set; }
    }

    public class DepartmentDto
    {
        public int Id { get; set; }
        public string DepartmentName { get; set; } = null!;
    }

}
