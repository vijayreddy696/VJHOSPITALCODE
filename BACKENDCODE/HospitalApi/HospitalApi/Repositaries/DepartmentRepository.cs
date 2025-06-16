using HospitalApi.Data;
using HospitalApi.Dtos;
using HospitalApi.Models;
using Microsoft.EntityFrameworkCore;

namespace HospitalApi.Repositaries
{

    public interface IDepartmentRepository
    {
        Task<PagedResult<DepartmentDto>> GetDepartmentsWithPaginationAsync(PaginationRequest paginationRequest);
        Task<Department> GetDepartmentByIdAsync(int id);
        Task<List<Department>> GetDepartmentsByIdsAsync(List<int> ids);
        Task AddDepartmentAsync(Department department);
        Task UpdateDepartmentAsync(Department department);
        Task DeleteDepartmentAsync(Department department);
        Task DeleteManyDepartmentsAsync(IEnumerable<Department> departments);

    }
    public class DepartmentRepository : IDepartmentRepository
    {
        private readonly HospitalContext _context;

        public DepartmentRepository(HospitalContext context)
        {
            _context = context;
        }

        public async Task<PagedResult<DepartmentDto>> GetDepartmentsWithPaginationAsync(PaginationRequest paginationRequest)
        {
            IQueryable<Department> query = _context.Departments.AsNoTracking();

            if (paginationRequest.HospitalId > 0)
            {
                query = query.Where(d => d.HospitalId == paginationRequest.HospitalId);
                // Always filter by Status == true
                query = query.Where(d => d.Status == true);
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
            var pagedDepartments = await query
                .Select(d=>new DepartmentDto
                {
                    Id = d.Id,
                    DepartmentHeadName = d.DepartmentHeadName,
                    DepartmentName = d.DepartmentName,
                    Status = d.Status
                }).ToListAsync();

            return new PagedResult<DepartmentDto>
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
            if (request.LastCreatedDate == null)
            {
                return query.OrderByDescending(u => u.CreatedDate).Take(request.PageSize);
            }
            else if (request.LastCreatedDate != null)
            {
                return query.Where(u => request.LastCreatedDate > u.CreatedDate)
                            .OrderByDescending(u => u.CreatedDate)
                            .Take(request.PageSize);
            }
            return null;
        }
        public async Task<Department> GetDepartmentByIdAsync(int id)
        {
            return await _context.Departments.Where(d => d.Id == id).FirstOrDefaultAsync();
        }

        public async Task<List<Department>> GetDepartmentsByIdsAsync(List<int> ids)
        {
            return await _context.Departments
                .Where(u => ids.Contains(u.Id))
                .ToListAsync();
        }

        public async Task AddDepartmentAsync(Department department)
        {
            await _context.Departments.AddAsync(department);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateDepartmentAsync(Department department)
        {
            _context.Departments.Update(department);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteDepartmentAsync(Department department)
        {
            _context.Departments.Remove(department);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteManyDepartmentsAsync(IEnumerable<Department> departments)
        {
            _context.Departments.RemoveRange(departments);
            await _context.SaveChangesAsync();
        }

    }
}
