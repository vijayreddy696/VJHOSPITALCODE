using HospitalApi.Data;
using HospitalApi.Models;
using Microsoft.EntityFrameworkCore;

namespace HospitalApi.Repositaries
{

    public interface IDepartmentRepository
    {
        Task<PagedResult<Department>> GetDepartmentsWithPaginationAsync(PaginationRequest paginationRequest);
        Task<Department> GetDepartmentByIdAsync(int id);

        Task<Department> AddDepartmentAsync(Department department);
        Task<Department> UpdateDepartmentAsync(Department department);
        Task DeleteDepartmentAsync(int departmentId);

    }
    public class DepartmentRepository : IDepartmentRepository
    {
        private readonly HospitalContext _context;

        public DepartmentRepository(HospitalContext context)
        {
            _context = context;
        }

        public async Task<PagedResult<Department>> GetDepartmentsWithPaginationAsync(PaginationRequest paginationRequest)
        {
            IQueryable<Department> query = _context.Departments.AsNoTracking();

            if (paginationRequest.HospitalId > 0)
            {
                query = query.Where(d => d.HospitalId == paginationRequest.HospitalId);
            }
            else
            {
                // Optionally handle the case where HospitalId is not provided or is invalid
                throw new ArgumentException("HospitalId is required.");
            }

            if (!string.IsNullOrEmpty(paginationRequest.SearchValue))
                query = ApplySearchFilter(query, paginationRequest);

            var filteredQuery = query; // Save for count

            query = ApplyDatePagination(query, paginationRequest);

            var totalCount = await filteredQuery.CountAsync();
            var pagedDepartments = await query.ToListAsync();

            return new PagedResult<Department>
            {
                TotalCount = totalCount,
                PageNumber = paginationRequest.PageNumber,
                PageSize = paginationRequest.PageSize,
                Items = pagedDepartments
            };
        }

        private IQueryable<Department> ApplySearchFilter(IQueryable<Department> query, PaginationRequest request)
        {
            if (request.FullTextSearch)
            {
                // Use CONTAINS for more flexible and faster substring searching
                return query.Where(d =>
                    EF.Functions.Contains(d.DepartmentName, $"\"{request.SearchValue}*\"") ||
                    EF.Functions.Contains(d.Description, $"\"{request.SearchValue}*\"") ||
                    EF.Functions.Contains(d.DepartmentHeadName, $"\"{request.SearchValue}*\"") ||
                    EF.Functions.Contains(d.DepartmentHeadEmail, $"\"{request.SearchValue}*\"")
                );
            }
            else
            {
                // If no full-text search, fall back to simple matching for DepartmentName
                return query.Where(d => EF.Functions.Contains(d.DepartmentName, $"\"{request.SearchValue}*\""));
            }
        }

        private IQueryable<Department> ApplyDatePagination(IQueryable<Department> query, PaginationRequest request)
        {
            if (request.LastModifiedDate == null && request.FirstModifiedDate == null)
            {
                return query.OrderByDescending(d => d.ModifiedDate).Take(request.PageSize);
            }
            else if (request.LastModifiedDate != null)
            {
                return query.Where(d => d.ModifiedDate < request.LastModifiedDate)
                            .OrderByDescending(d => d.ModifiedDate)
                            .Take(request.PageSize);
            }
            else if (request.FirstModifiedDate != null)
            {
                return query.Where(d => d.ModifiedDate > request.FirstModifiedDate)
                            .OrderBy(d => d.ModifiedDate).Take(request.PageSize)
                            .OrderByDescending(d => d.ModifiedDate);
            }
            return null;
        }

        public async Task<Department> GetDepartmentByIdAsync(int id)
        {
            return await _context.Departments.Where(d => d.Id == id).FirstOrDefaultAsync();
        }

        public async Task<Department> AddDepartmentAsync(Department department)
        {
            await _context.Departments.AddAsync(department);
            await _context.SaveChangesAsync();
            return department; // Return the department with generated Id
        }

        public async Task<Department> UpdateDepartmentAsync(Department department)
        {
            _context.Departments.Update(department);
            await _context.SaveChangesAsync();
            return department; // Return the updated department
        }

        public async Task DeleteDepartmentAsync(int departmentId)
        {
            var department = await _context.Departments
                                           .FirstOrDefaultAsync(d => d.Id == departmentId);

            if (department != null)
            {
                _context.Departments.Remove(department);
                await _context.SaveChangesAsync();
            }
        }

    }
}
