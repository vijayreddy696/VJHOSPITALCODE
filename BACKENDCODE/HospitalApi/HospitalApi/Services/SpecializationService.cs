using HospitalApi.Models;
using HospitalApi.Repositaries;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HospitalApi.Services
{
    public interface ISpecializationService
    {
        Task<PagedResult<Specialization>> GetSpecializationsAsync(PaginationRequest request);
        Task<Specialization?> GetByIdAsync(int id);
        Task<List<Specialization>> GetSpecializationsByDepartmentIdAsync(int departmentId);
        Task<Specialization> AddOrUpdateSpecializationAsync(Specialization specialization);
        Task DeleteManySpecializationsAsync(List<int> specializationIds);
        Task DeleteAsync(int id);
    }

    public class SpecializationService : ISpecializationService
    {
        private readonly ISpecializationRepository _specializationRepository;

        public SpecializationService(ISpecializationRepository specializationRepository)
        {
            _specializationRepository = specializationRepository;
        }

        public async Task<PagedResult<Specialization>> GetSpecializationsAsync(PaginationRequest request)
        {
            try
            {
                return await _specializationRepository.GetSpecializationsWithPaginationAsync(request);
            }
            catch (Exception ex)
            {
                throw new Exception("Error retrieving specializations", ex);
            }
        }

        public async Task<Specialization?> GetByIdAsync(int id)
        {
            try
            {
                return await _specializationRepository.GetByIdAsync(id);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error retrieving specialization with ID {id}", ex);
            }
        }

        public async Task<List<Specialization>> GetSpecializationsByDepartmentIdAsync(int departmentId)
        {
            try
            {
                return await _specializationRepository.GetByDepartmentIdAsync(departmentId);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error retrieving specializations for Department ID {departmentId}", ex);
            }
        }

        public async Task<Specialization> AddOrUpdateSpecializationAsync(Specialization specialization)
        {
            try
            {
                if (specialization.Id == 0)
                    await _specializationRepository.AddAsync(specialization);
                else
                    await _specializationRepository.UpdateAsync(specialization);

                return specialization;
            }
            catch (Exception ex)
            {
                throw new Exception("Error adding or updating specialization", ex);
            }
        }

        public async Task DeleteAsync(int id)
        {
            try
            {
                var specialization = await _specializationRepository.GetByIdAsync(id);
                if (specialization == null)
                    throw new ArgumentException("Specialization not found");

                await _specializationRepository.DeleteAsync(specialization);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error deleting specialization with ID {id}", ex);
            }
        }

        public async Task DeleteManySpecializationsAsync(List<int> specializationIds)
        {
            try
            {
                IEnumerable<Specialization> specializations = await _specializationRepository.GetSpecializationsByIdsAsync(specializationIds);
                if (specializations == null || !specializations.Any())
                {
                    throw new Exception("No departments found for the provided IDs.");
                }
                await _specializationRepository.DeleteManyDepartmentsAsync(specializations);
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while deleting multiple departments.", ex);
            }
        }
    }
}
   