using HospitalApi.Data;
using HospitalApi.Models;
using Microsoft.EntityFrameworkCore;

namespace HospitalApi.Repositaries
{

    public interface ISpecializationRepository
    {
        Task<Specialization?> GetByIdAsync(int id);
        Task<List<Specialization>> GetByDepartmentIdAsync(int departmentId);
        Task<List<Specialization>> GetSpecializationsByIdsAsync(List<int> ids);
        Task AddAsync(Specialization specialization);
        Task UpdateAsync(Specialization specialization);
        Task DeleteAsync(Specialization specialization);
        Task DeleteManyDepartmentsAsync(IEnumerable<Specialization> specializations);
        Task<PagedResult<Specialization>> GetSpecializationsWithPaginationAsync(PaginationRequest paginationRequest);

    }
    public class SpecializationRepository : ISpecializationRepository
    {
        private readonly HospitalContext _context;

        public SpecializationRepository(HospitalContext context)
        {
            _context = context;
        }


        public async Task<PagedResult<Specialization>> GetSpecializationsWithPaginationAsync(PaginationRequest paginationRequest)
        {
            IQueryable<Specialization> query = _context.Specialization
                .Include(s => s.Department) // To fetch Department data
                .AsNoTracking();

            if (paginationRequest.HospitalId > 0)
            {
                query = query.Where(s => s.HospitalId == paginationRequest.HospitalId);
            }

            else
            {
                throw new ArgumentException("HospitalId is required.");
            }

            if (!string.IsNullOrEmpty(paginationRequest.SearchValue))
            {
                query = ApplySpecializationSearchFilter(query, paginationRequest);
            }

            var filteredQuery = query; // Save for count before pagination

            query = ApplyDatePagination(query, paginationRequest);

            var totalCount = await filteredQuery.CountAsync();
            //var pagedSpecializations = await query.ToListAsync();

            var pagedSpecializations = await query
            .Select(s => new Specialization
            {
                Id = s.Id,
                SpecializationName = s.SpecializationName,
                CreatedDate = s.CreatedDate,
                HospitalId = s.HospitalId,
                DepartmentId = s.DepartmentId,
                Department = new Department
                {
                    Id = s.Department.Id,
                    DepartmentName = s.Department.DepartmentName
                }
            }).ToListAsync();

            return new PagedResult<Specialization>
            {
                TotalCount = totalCount,
                PageNumber = paginationRequest.PageNumber,
                PageSize = paginationRequest.PageSize,
                Items = pagedSpecializations
            };
        }

        private IQueryable<Specialization> ApplySpecializationSearchFilter(IQueryable<Specialization> query, PaginationRequest request)
        {
                return query.Where(s =>
                    EF.Functions.Contains(s.SpecializationName, $"\"{request.SearchValue}*\"") 
                );
        }

        private IQueryable<Specialization> ApplyDatePagination(IQueryable<Specialization> query, PaginationRequest request)
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


        public async Task<Specialization?> GetByIdAsync(int id)
        {
            return await _context.Specialization
                .Include(s => s.Department)
                .FirstOrDefaultAsync(s => s.Id == id);
        }

        public async Task<List<Specialization>> GetByDepartmentIdAsync(int departmentId)
        {
            return await _context.Specialization
                .Where(s => s.DepartmentId == departmentId).Include(s=>s.Department)
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<List<Specialization>> GetSpecializationsByIdsAsync(List<int> ids)
        {
            return await _context.Specialization
                .Where(u => ids.Contains(u.Id))
                .ToListAsync();
        }
        public async Task DeleteManyDepartmentsAsync(IEnumerable<Specialization> specializations)
        {
            _context.Specialization.RemoveRange(specializations);
            await _context.SaveChangesAsync();
        }

        public async Task AddAsync(Specialization specialization)
        {

            _context.Specialization.Add(specialization);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Specialization specialization)
        {
            _context.Specialization.Update(specialization);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Specialization specialization)
        {
            _context.Specialization.Remove(specialization);
            await _context.SaveChangesAsync();
        }
    }
}
