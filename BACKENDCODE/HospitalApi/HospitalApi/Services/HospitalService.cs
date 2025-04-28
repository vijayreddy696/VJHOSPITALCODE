using HospitalApi.Models;
using HospitalApi.Repositaries;

namespace HospitalApi.Services
{
    public interface IHospitalService
    {
        Task<IEnumerable<Hospital>> GetAllHospitalsAsync();
        Task<Hospital> GetHospitalByIdAsync(int id);
        Task<Hospital> AddOrUpdateHospitalAsync(Hospital hospital);
        Task DeleteHospitalAsync(int id);
    }
    public class HospitalService : IHospitalService
    {
        private readonly IHospitalRepository _hospitalRepository;

        public HospitalService(IHospitalRepository hospitalRepository)
        {
            _hospitalRepository = hospitalRepository;
        }

        public async Task<IEnumerable<Hospital>> GetAllHospitalsAsync()
        {
            return await _hospitalRepository.GetAllHospitalsAsync();
        }

        public async Task<Hospital> GetHospitalByIdAsync(int id)
        {
            return await _hospitalRepository.GetHospitalByIdAsync(id);
        }

        public async Task<Hospital> AddOrUpdateHospitalAsync(Hospital hospital)
        {
            if (hospital == null)
            {
                throw new ArgumentNullException(nameof(hospital));
            }

            Hospital result;

            if (hospital.Id == 0)  // No ID means add new hospital
            {
                result = await _hospitalRepository.AddHospitalAsync(hospital);
            }
            else
            {
                var existingHospital = await _hospitalRepository.GetHospitalByIdAsync(hospital.Id);
                if (existingHospital != null)
                {
                    result = await _hospitalRepository.UpdateHospitalAsync(hospital); // Update existing hospital
                }
                else
                {
                    throw new Exception("Hospital not found for update.");
                }
            }

            return result; // <=== return the saved/updated hospital
        }

        public async Task DeleteHospitalAsync(int id)
        {
            var existingHospital = await _hospitalRepository.GetHospitalByIdAsync(id);
            if (existingHospital != null)
            {
                await _hospitalRepository.DeleteHospitalAsync(id);
            }
            else
            {
                throw new Exception("Hospital not found for deletion.");
            }
        }
    }
}
