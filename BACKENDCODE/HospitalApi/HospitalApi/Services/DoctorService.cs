using HospitalApi.Dtos;
using HospitalApi.Models;
using HospitalApi.Repositaries;

namespace HospitalApi.Services
{

    public interface IDoctorService
    {
        Task<Doctor?> GetDoctorByIdAsync(int id);
        Task<List<Doctor>> GetDoctorsByIdsAsync(List<int> ids);
        Task AddOrUpdateDoctorAsync(Doctor doctor);
        Task AddDoctorAsync(Doctor doctor);
        Task UpdateDoctorAsync(Doctor doctor);
        Task DeleteDoctorAsync(int id);
        Task DeleteMultipleDoctorsAsync(List<int> ids);
        Task<PagedResult<DoctorDto>> GetDoctorsWithPaginationAsync(PaginationRequest paginationRequest);
    }

    public class DoctorService : IDoctorService
    {
        private readonly IDoctorRepository _doctorRepository;
        private readonly IUserService _userService;


        public DoctorService(IDoctorRepository doctorRepository, IUserService userService)
        {
            _doctorRepository = doctorRepository;
            _userService = userService;
        }

        public async Task<Doctor?> GetDoctorByIdAsync(int id)
        {
            try
            {
                return await _doctorRepository.GetByIdAsync(id);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error retrieving doctor with ID {id}.", ex);
            }
        }

        public async Task<List<Doctor>> GetDoctorsByIdsAsync(List<int> ids)
        {
            try
            {
                return await _doctorRepository.GetDoctorsByIdsAsync(ids);
            }
            catch (Exception ex)
            {
                throw new Exception("Error retrieving multiple doctors.", ex);
            }
        }


        public async Task AddOrUpdateDoctorAsync(Doctor doctor)
        {
            if (doctor == null)
                throw new ArgumentNullException(nameof(doctor));

            try
            {
                doctor.PersonalDetails.HospitalId = doctor.HospitalId;
                doctor.PersonalDetails.Role = Role.Doctor;
                bool userUpdated = await _userService.AddOrUpdateUserAsync(doctor.PersonalDetails);

                if (!userUpdated)
                    throw new Exception("Failed to add or update user details.");

                if (doctor.Id == 0)
                {
                    await AddDoctorAsync(doctor);
                }
                else
                {
                    await UpdateDoctorAsync(doctor);
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Error adding or updating doctor.", ex);
            }
        }

        public async Task AddDoctorAsync(Doctor doctor)
        {
            try
            {
                if (doctor == null)
                    throw new ArgumentNullException(nameof(doctor));

                await _doctorRepository.AddAsync(doctor);
            }
            catch (Exception ex)
            {
                throw new Exception("Error adding new doctor.", ex);
            }
        }

        public async Task UpdateDoctorAsync(Doctor doctor)
        {
            try
            {
                if (doctor == null)
                    throw new ArgumentNullException(nameof(doctor));

                await _doctorRepository.UpdateAsync(doctor);
            }
            catch (Exception ex)
            {
                throw new Exception("Error updating doctor.", ex);
            }
        }

        public async Task DeleteDoctorAsync(int id)
        {
            try
            {
                var doctor = await _doctorRepository.GetByIdAsync(id);
                if (doctor == null)
                    throw new Exception("Doctor not found.");

                await _doctorRepository.DeleteAsync(doctor);
            }
            catch (Exception ex)
            {
                throw new Exception("Error deleting doctor.", ex);
            }
        }

        public async Task DeleteMultipleDoctorsAsync(List<int> ids)
        {
            try
            {
                var doctors = await _doctorRepository.GetDoctorsByIdsAsync(ids);
                if (doctors == null || !doctors.Any())
                    throw new Exception("No doctors found to delete.");

                await _doctorRepository.DeleteManyDoctorsAsync(doctors);
            }
            catch (Exception ex)
            {
                throw new Exception("Error deleting multiple doctors.", ex);
            }
        }

        public async Task<PagedResult<DoctorDto>> GetDoctorsWithPaginationAsync(PaginationRequest paginationRequest)
        {
            try
            {
                return await _doctorRepository.GetDoctorsWithPaginationAsync(paginationRequest);
            }
            catch (Exception ex)
            {
                throw new Exception("Error retrieving paginated doctors.", ex);
            }
        }
    }
}
