using HospitalApi.Models;
using HospitalApi.Repositaries;

namespace HospitalApi.Services
{
    public interface IQualificationService
    {
        Task<PagedResult<Qualification>> GetQualificationsWithPaginationAsync(PaginationRequest paginationRequest);
        Task<Qualification> GetQualificationByIdAsync(int id);
        Task<Qualification> AddOrUpdateQualificationAsync(Qualification qualification);
        Task DeleteQualificationAsync(int qualificationId);
        Task DeleteMultipleQualificationsAsync(List<int> qualificationIds);
    }
    public class QualificationService : IQualificationService
    {
        private readonly IQualificationRepository _qualificationRepository;

        public QualificationService(IQualificationRepository qualificationRepository)
        {
            _qualificationRepository = qualificationRepository;
        }

        public async Task<PagedResult<Qualification>> GetQualificationsWithPaginationAsync(PaginationRequest paginationRequest)
        {
            try
            {
                return await _qualificationRepository.GetQualificationsWithPaginationAsync(paginationRequest);
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while retrieving qualifications with pagination.", ex);
            }
        }

        public async Task<Qualification> GetQualificationByIdAsync(int id)
        {
            try
            {
                var qualification = await _qualificationRepository.GetQualificationByIdAsync(id);
                if (qualification == null)
                    throw new Exception($"Qualification with ID {id} not found.");
                return qualification;
            }
            catch (Exception ex)
            {
                throw new Exception($"An error occurred while retrieving the qualification with ID {id}.", ex);
            }
        }

        public async Task<Qualification> AddOrUpdateQualificationAsync(Qualification qualification)
        {
            try
            {
                if (qualification == null)
                    throw new ArgumentNullException(nameof(qualification));

                if (qualification.Id == 0)
                {
                    await _qualificationRepository.AddQualificationAsync(qualification);
                }
                else
                {
                    if (qualification.HospitalId == null)
                        throw new Exception("Hospital ID is required for updating a qualification.");

                    await _qualificationRepository.UpdateQualificationAsync(qualification);
                }

                return qualification;
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while adding or updating the qualification.", ex);
            }
        }

        public async Task DeleteQualificationAsync(int qualificationId)
        {
            try
            {
                var existingQualification = await _qualificationRepository.GetQualificationByIdAsync(qualificationId);
                if (existingQualification == null)
                    throw new Exception("Qualification not found for deletion.");

                await _qualificationRepository.DeleteQualificationAsync(existingQualification);
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while deleting the qualification.", ex);
            }
        }

        public async Task DeleteMultipleQualificationsAsync(List<int> qualificationIds)
        {
            try
            {
                var qualifications = await _qualificationRepository.GetQualificationsByIdsAsync(qualificationIds);
                if (qualifications == null || !qualifications.Any())
                    throw new Exception("No qualifications found for the provided IDs.");

                await _qualificationRepository.DeleteManyQualificationsAsync(qualifications);
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while deleting multiple qualifications.", ex);
            }
        }
    }
}
