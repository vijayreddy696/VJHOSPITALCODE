using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;

namespace HospitalApi.Models
{
    public class Doctor:BaseEntity
    {
        public int Id { get; set; }  // Unique identifier
        public int QualificationId { get; set; }
        public Qualification? Qualification { get; set; }  // Navigation property
        public int SpecializationId { get; set; }  // FK to Specialization
        [ValidateNever]
        public Specialization? Specialization { get; set; }  // Navigation property
        public int? HospitalId { get; set; }  // FK to Hospital
        public Hospital? Hospital { get; set; }  // Optional if you need direct Hospital access
        public int? Experience { get; set; }

        public int? PersonalDetailsId { get; set; }
        public User PersonalDetails { get; set; }


    }
}
