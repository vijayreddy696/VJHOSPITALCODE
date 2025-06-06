using HospitalApi.Models;
using HospitalApi.Repositaries;

namespace HospitalApi.Services
{

    public interface IDepartmentService
    {
        Task<PagedResult<Department>> GetDepartmentsWithPaginationAsync(PaginationRequest paginationRequest);
        Task<Department> GetDepartmentByIdAsync(int id);
        Task<Department> AddOrUpdateDepartmentAsync(Department department);
        Task DeleteDepartmentAsync(int departmentId);
        Task DeleteMultipleDepartmentsAsync(List<int> departmentIds);

    }
    public class DepartmentService : IDepartmentService
    {
        private readonly IDepartmentRepository _departmentRepository;
        public DepartmentService(IDepartmentRepository departmentRepository)
        {
            _departmentRepository = departmentRepository;
        }

        public async Task<PagedResult<Department>> GetDepartmentsWithPaginationAsync(PaginationRequest paginationRequest)
        {
            try
            {
                return await _departmentRepository.GetDepartmentsWithPaginationAsync(paginationRequest);
            }
            catch (Exception ex)
            {
                // Log exception if logging is set up
                throw new Exception("An error occurred while retrieving departments with pagination.", ex);
            }
        }

        public async Task<Department> GetDepartmentByIdAsync(int id)
        {
            try
            {
                return await _departmentRepository.GetDepartmentByIdAsync(id);
            }
            catch (Exception ex)
            {
                throw new Exception($"An error occurred while retrieving the department with ID {id}.", ex);
            }
        }

        public async Task<Department> AddOrUpdateDepartmentAsync(Department department)
        {
            try
            {
                if (department == null)
                {
                    throw new ArgumentNullException(nameof(department));
                }

                if (department.Id == 0)
                {
                     await _departmentRepository.AddDepartmentAsync(department);
                    return department;
                }
                else
                {
                    if (department.HospitalId == null)
                        throw new Exception("Hospital id is required");

                        await _departmentRepository.UpdateDepartmentAsync(department);
                    return department;
                    
                }
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while adding or updating the department.", ex);
            }
        }

        public async Task DeleteDepartmentAsync(int departmentId)
        {
            try
            {
                Department existingDepartment = await _departmentRepository.GetDepartmentByIdAsync(departmentId);
                if (existingDepartment != null)
                {
                    await _departmentRepository.DeleteDepartmentAsync(existingDepartment);
                }
                else
                {
                    throw new Exception("Department not found for deletion.");
                }
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while deleting the department.", ex);
            }
        }

        public async Task DeleteMultipleDepartmentsAsync(List<int> departmentIds)
        {
            try
            {
                IEnumerable<Department> departments = await _departmentRepository.GetDepartmentsByIdsAsync(departmentIds);
                if (departments == null || !departments.Any())
                {
                    throw new Exception("No departments found for the provided IDs.");
                }
                await _departmentRepository.DeleteManyDepartmentsAsync(departments);
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while deleting multiple departments.", ex);
            }
        }
    }
}
