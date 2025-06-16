namespace HospitalApi.Dtos
{
    public class HospitalDto
    {
        public int Id { get; set; }
        public string HospitalName { get; set; }
        public string HospitalAddress { get; set; }
        public string HospitalEmail { get; set; }
        public OwnerDto OwnerDetails { get; set; }
    }

    public class OwnerDto
    {
        public int Id { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
    }

}
