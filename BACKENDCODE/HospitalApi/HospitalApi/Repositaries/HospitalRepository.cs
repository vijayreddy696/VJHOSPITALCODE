using HospitalApi.Data;
using HospitalApi.Models;
using Microsoft.EntityFrameworkCore;

namespace HospitalApi.Repositaries
{
    public interface IHospitalRepository
    {
        Task<IEnumerable<Hospital>> GetAllHospitalsAsync();
        Task<Hospital> GetHospitalByIdAsync(int id);
        Task<Hospital> AddHospitalAsync(Hospital hospital); // changed return type
        Task<Hospital> UpdateHospitalAsync(Hospital hospital); // changed return type
        Task DeleteHospitalAsync(int id);
    }
    public class HospitalRepository : IHospitalRepository
    {
        private readonly HospitalContext _context;

        public HospitalRepository(HospitalContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Hospital>> GetAllHospitalsAsync()
        {
            return await _context.Hospitals.ToListAsync();
        }

        public async Task<Hospital> GetHospitalByIdAsync(int id)
        {
            return await _context.Hospitals.FindAsync(id);
        }

        public async Task<Hospital> AddHospitalAsync(Hospital hospital)
        {
            await _context.Hospitals.AddAsync(hospital);
            await _context.SaveChangesAsync();
            return hospital; // Return the hospital with generated Id
        }

        public async Task<Hospital> UpdateHospitalAsync(Hospital hospital)
        {
            _context.Hospitals.Update(hospital);
            await _context.SaveChangesAsync();
            return hospital; // Return the updated hospital
        }

        public async Task DeleteHospitalAsync(int id)
        {
            var hospital = await _context.Hospitals.FindAsync(id);
            if (hospital != null)
            {
                _context.Hospitals.Remove(hospital);
                await _context.SaveChangesAsync();
            }
        }
    }
}
