
namespace HospitalApi.Models
{
    public class Hospital: BaseEntity
    {
        public int Id { get; set; }
        public  string HospitalName { get; set; } 
        public  string HospitalAddress { get; set; }
        public  string HospitalEmail { get; set; }
        public bool Status { get; set; } = true;
        public int? OwnerId { get; set; }
        public User OwnerDetails { get; set; }
        public ICollection<User>? Users { get; set; }
    }
}
