using System.ComponentModel.DataAnnotations.Schema;

namespace HospitalApi.Models
{
    public class Qualification :BaseEntity
    {
        public int Id { get; set; }
        public string Code { get; set; }  // e.g., MBBS, 
        public string FullForm { get; set; }  
        public int? HospitalId { get; set; }  // null = global
        public Hospital? Hospital { get; set; }

    }
}
