using Newtonsoft.Json;

namespace HospitalApi.Models
{
    public class User : BaseEntity
    {
        public int Id { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }

        public string Gender { get; set; }
        public string? Address { get; set; }
        public DateTime DateOfBirth { get; set; }

        public Role Role { get; set; }
        public int? HospitalId { get; set; }

     
        public string Password { get; set; }
        public Hospital? Hospital { get; set; }

    }

    public enum Role
    {
        All = 1,
        Owner =2,
        Admin = 3,
        SuperAdmin = 4,
        Doctor = 5,
        Nurse = 6,
        Receptionist = 7,
    }

}
