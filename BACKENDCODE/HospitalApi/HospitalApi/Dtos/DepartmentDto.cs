namespace HospitalApi.Dtos
{
    public class DepartmentDto
    {
        public int Id { get; set; }  // Department ID
        public string DepartmentName { get; set; }  // Department name
        public string DepartmentHeadName { get; set; }  // Department head's name
        public bool Status { get; set; }  // Active or Inactive

        public string DepartmentHeadEmail { get; set; }  // Email of the department head
        public string DepartmentHeadPhoneNumber { get; set; }  // Phone number of the department head
    }
}
