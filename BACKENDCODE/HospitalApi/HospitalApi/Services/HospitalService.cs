using HospitalApi.Models;
using HospitalApi.Repositaries;

namespace HospitalApi.Services
{
    public interface IHospitalService
    {
        Task<PagedResult<Hospital>> GetHospitalsWithPaginationAsync(PaginationRequest paginationRequest);
        Task<Hospital> GetHospitalByIdAsync(int id);
        Task<Hospital> AddOrUpdateHospitalAsync(Hospital hospital);
        Task ActivateorDeactivateHospitalAsync(int id, bool toactivate);
        Task HardDeleteHospitalAsync(int id);
    }

    public class HospitalService : IHospitalService
    {
        private readonly IHospitalRepository _hospitalRepository;
        private readonly IUserService _userService;

        public HospitalService(IUserService userService, IHospitalRepository hospitalRepository)
        {
            _userService = userService;
            _hospitalRepository = hospitalRepository;
        }

        public async Task<PagedResult<Hospital>> GetHospitalsWithPaginationAsync(PaginationRequest paginationRequest)
        {
            try
            {
                return await _hospitalRepository.GetHospitalsWithPaginationAsync(paginationRequest);
            }
            catch (Exception ex)
            {
                throw new Exception("Failed to retrieve hospitals with pagination.", ex);
            }
        }

        public async Task<Hospital> GetHospitalByIdAsync(int id)
        {
            try
            {
                return await _hospitalRepository.GetHospitalByIdAsync(id);
            }
            catch (Exception ex)
            {
                throw new Exception($"Failed to retrieve hospital with ID {id}.", ex);
            }
        }

        public async Task<Hospital> AddOrUpdateHospitalAsync(Hospital hospital)
        {
            if (hospital == null) throw new ArgumentNullException(nameof(hospital));

            try
            {
                if (hospital.Id == 0)
                    return await AddHospitalAsync(hospital);
                else
                    return await UpdateHospitalAsync(hospital);
            }
            catch (Exception ex)
            {
                throw new Exception("Failed to add or update hospital.", ex);
            }
        }

        public async Task ActivateorDeactivateHospitalAsync(int id,bool toactivate)
        {
            try
            {
                Hospital existingHospital = await _hospitalRepository.GetHospitalByIdAsync(id);
                if (existingHospital != null && existingHospital.OwnerDetails != null)
                {
                    existingHospital.Status = toactivate;
                    await _hospitalRepository.UpdateHospitalAsync(existingHospital);
                }
                else
                {
                    throw new Exception("Hospital not found for deletion.");
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Failed to delete hospital with ID {id}.", ex);
            }
        }

       
        public async Task HardDeleteHospitalAsync(int id)
        {
            try
            {
                Hospital existingHospital = await _hospitalRepository.GetHospitalByIdAsync(id);
                if (existingHospital != null)
                {
                    await _userService.HardDeleteUserByAsync(existingHospital.OwnerDetails);
                    await _hospitalRepository.DeleteHospitalAsync(existingHospital);
                }
                else
                {
                    throw new Exception("Hospital not found for deletion.");
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Failed to delete hospital with ID {id}.", ex);
            }
        }

        private async Task<Hospital> AddHospitalAsync(Hospital hospital)
        {
            try
            {
                User owner = hospital.OwnerDetails;
                if (owner == null) throw new Exception("Owner details required");

                await _userService.AddOrUpdateUserAsync(owner);

                hospital.OwnerId = owner.Id;
                hospital.OwnerDetails = null;
                await _hospitalRepository.AddHospitalAsync(hospital);

                owner.HospitalId = hospital.Id;
                await _userService.AddOrUpdateUserAsync(owner);

                return hospital;
            }
            catch (Exception ex)
            {
                throw new Exception("Failed to add new hospital.", ex);
            }
        }

        private async Task<Hospital> UpdateHospitalAsync(Hospital hospital)
        {
            try
            {
                if (hospital.OwnerDetails != null)
                {
                    hospital.OwnerDetails.HospitalId = hospital.Id;
                    await _userService.AddOrUpdateUserAsync(hospital.OwnerDetails);
                }

                await _hospitalRepository.UpdateHospitalAsync(hospital);
                return hospital;
            }
            catch (Exception ex)
            {
                throw new Exception($"Failed to update hospital with ID {hospital.Id}.", ex);
            }
        }
    }
}
