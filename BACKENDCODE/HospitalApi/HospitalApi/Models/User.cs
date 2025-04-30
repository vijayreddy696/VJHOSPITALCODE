using System.Text.Json.Serialization;

namespace HospitalApi.Models
{
    public class User : BaseEntity
    {
        public int Id { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string Role { get; set; }
        public int HospitalId { get; set; }

        [JsonIgnore]
        public string Password { get; set; }
        public Hospital? Hospital { get; set; }

    }
}
