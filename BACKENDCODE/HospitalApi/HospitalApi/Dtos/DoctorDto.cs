namespace HospitalApi.Dtos
{
    public class DoctorDto
    {
        public int Id { get; set; }
        public DateTime CreatedDate { get; set; }
        public NestedQualificationDto Qualification { get; set; }
        public NestedSpecializationDto Specialization { get; set; }

        public PersonalDetailsDto PersonalDetails { get; set; }
    }

    public class NestedQualificationDto
    {
        public string Code { get; set; } = null!;
    }

    public class NestedSpecializationDto
    {
        public string SpecializationName { get; set; } = null!;
        public NestedDepartmentDto Department { get; set; }
    }

    public class NestedDepartmentDto
    {
        public string DepartmentName { get; set; } = null!;
    }

    public class PersonalDetailsDto
    {
        public string FullName { get; set; }
        public string Email { get; set; }
    }

}
