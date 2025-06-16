namespace HospitalApi.Dtos
{
    public class DepartmentDto
    {
        public int Id { get; set; }  // Department ID
        public string DepartmentName { get; set; }  // Department name
        public string DepartmentHeadName { get; set; }  // Department head's name
        public bool Status { get; set; }  // Active or Inactive
    }
}
