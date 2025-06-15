using HospitalApi.Data;
using HospitalApi.Models;
using Microsoft.EntityFrameworkCore;

namespace HospitalApi.Repositaries
{
    public interface IQualificationRepository
    {
        Task<PagedResult<Qualification>> GetQualificationsWithPaginationAsync(PaginationRequest paginationRequest);
        Task<Qualification?> GetQualificationByIdAsync(int id);
        Task<List<Qualification>> GetQualificationsByIdsAsync(List<int> ids);
        Task AddQualificationAsync(Qualification qualification);
        Task UpdateQualificationAsync(Qualification qualification);
        Task DeleteQualificationAsync(Qualification qualification);
        Task DeleteManyQualificationsAsync(IEnumerable<Qualification> qualifications);
    }
    public class QualificationRepository : IQualificationRepository
    {
        private readonly HospitalContext _context;

        public QualificationRepository(HospitalContext context)
        {
            _context = context;
        }

        public async Task<PagedResult<Qualification>> GetQualificationsWithPaginationAsync(PaginationRequest paginationRequest)
        {
            IQueryable<Qualification> query = _context.Qualifications.AsNoTracking();

            if (paginationRequest.HospitalId > 0)
            {
                query = query.Where(q => q.HospitalId == paginationRequest.HospitalId);
            }
            else
            {
                throw new ArgumentException("HospitalId is required.");
            }

            if (!string.IsNullOrEmpty(paginationRequest.SearchValue))
                query = ApplySearchFilter(query, paginationRequest);
        

            var filteredQuery = query;
            query = ApplyDatePagination(query, paginationRequest);

            var totalCount = await filteredQuery.CountAsync();
            var pagedQualifications = await query.ToListAsync();

            return new PagedResult<Qualification>
            {
                TotalCount = totalCount,
                PageNumber = paginationRequest.PageNumber,
                PageSize = paginationRequest.PageSize,
                Items = pagedQualifications
            };
        }

        private IQueryable<Qualification> ApplySearchFilter(IQueryable<Qualification> query, PaginationRequest paginationRequest)
        {

            if (paginationRequest.FullTextSearch)
            {
                return query.Where(q =>
                    EF.Functions.Contains(q.Code, $"\"{paginationRequest.SearchValue}*\"") ||
                    EF.Functions.Contains(q.FullForm, $"\"{paginationRequest.SearchValue}*\""));
            }
            else
            {
                return query.Where(q => EF.Functions.Contains(q.Code, $"\"{paginationRequest.SearchValue}*\""));
            }
        }

        private IQueryable<Qualification> ApplyDatePagination(IQueryable<Qualification> query, PaginationRequest request)
        {
            if(request.LastCreatedDate == null)
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

        public async Task<Qualification?> GetQualificationByIdAsync(int id)
        {
            return await _context.Qualifications.FirstOrDefaultAsync(q => q.Id == id);
        }

        public async Task<List<Qualification>> GetQualificationsByIdsAsync(List<int> ids)
        {
            return await _context.Qualifications
                .Where(q => ids.Contains(q.Id))
                .ToListAsync();
        }

        public async Task AddQualificationAsync(Qualification qualification)
        {
            await _context.Qualifications.AddAsync(qualification);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateQualificationAsync(Qualification qualification)
        {
            _context.Qualifications.Update(qualification);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteQualificationAsync(Qualification qualification)
        {
            _context.Qualifications.Remove(qualification);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteManyQualificationsAsync(IEnumerable<Qualification> qualifications)
        {
            _context.Qualifications.RemoveRange(qualifications);
            await _context.SaveChangesAsync();
        }
    }
}
