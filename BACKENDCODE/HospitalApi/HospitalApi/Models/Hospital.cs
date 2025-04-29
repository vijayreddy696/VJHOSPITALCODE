using System.Text.Json.Serialization;

namespace HospitalApi.Models
{
    public class Hospital: BaseEntity
    {
        public int Id { get; set; }
        public  string HospitalName { get; set; } 
        public  string Location { get; set; }
        public  string HospitalEmail { get; set; }
        public  string OwnerName { get; set; }
        public  string OwnerPhoneNumber { get; set; }
        public  string OwnerEmail { get; set; }

    }
}
