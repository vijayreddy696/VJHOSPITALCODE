using Azure.Core;
using HospitalApi.Data;
using HospitalApi.Models;
using Microsoft.EntityFrameworkCore;
using System.Buffers;

namespace HospitalApi.Repositaries
{
    public interface IHospitalRepository
    {
        Task<PagedResult<Hospital>> GetHospitalsWithPaginationAsync(PaginationRequest paginationRequest);
        Task<Hospital> GetHospitalByIdAsync(int id);
        Task<Hospital> AddHospitalAsync(Hospital hospital); // changed return type
        Task<Hospital> UpdateHospitalAsync(Hospital hospital); // changed return type
        Task DeleteHospitalAsync(int id);
    }
    public class HospitalRepository : IHospitalRepository
    {
        private readonly HospitalContext _context;

        public HospitalRepository(HospitalContext context)
        {
            _context = context;
        }

        public async Task<PagedResult<Hospital>> GetHospitalsWithPaginationAsync(PaginationRequest paginationRequest)
        {
            IQueryable<Hospital> query = _context.Hospitals.AsNoTracking();

            if (!string.IsNullOrEmpty(paginationRequest.SearchValue))
                query = ApplySearchFilter(query, paginationRequest);

            var filteredQuery = query; // Save for count

            query = ApplyDatePagination(query, paginationRequest);

            var totalCount = await filteredQuery.CountAsync();
            var pagedHospitals = await query.ToListAsync();

            return new PagedResult<Hospital>
            {
                TotalCount = totalCount,
                PageNumber = paginationRequest.PageNumber,
                PageSize = paginationRequest.PageSize,
                Items = pagedHospitals
            };
        }

        private IQueryable<Hospital> ApplySearchFilter(IQueryable<Hospital> query, PaginationRequest request)
        {
            if (request.FullTextSearch)
            {
                // Use CONTAINS for more flexible and faster substring searching
                return query.Where(h =>
                    EF.Functions.Contains(h.HospitalName, $"\"{request.SearchValue}*\"") ||
                    EF.Functions.Contains(h.HospitalEmail, $"\"{request.SearchValue}*\"") ||
                    EF.Functions.Contains(h.OwnerEmail, $"\"{request.SearchValue}*\"") ||
                    EF.Functions.Contains(h.Location, $"\"{request.SearchValue}*\"") ||
                    EF.Functions.Contains(h.OwnerName, $"\"{request.SearchValue}*\"")
                );
            }
            else
            {
                // If no full-text search, fall back to simple matching for HospitalName
                return query.Where(h => EF.Functions.Contains(h.HospitalName, $"\"{request.SearchValue}*\""));
            }
        }


        private IQueryable<Hospital> ApplyDatePagination(IQueryable<Hospital> query, PaginationRequest request)
        {
            if (request.LastModifiedDate == null && request.FirstModifiedDate == null)
            {
                return query.OrderByDescending(h => h.ModifiedDate).Take(request.PageSize);
            }
            else if (request.LastModifiedDate != null)
            {
                return query.Where(h => h.ModifiedDate < request.LastModifiedDate)
                            .OrderByDescending(h => h.ModifiedDate)
                            .Take(request.PageSize);
            }
            else if (request.FirstModifiedDate != null)
            {
                return query.Where(h => h.ModifiedDate > request.FirstModifiedDate).
                    OrderBy(h => h.ModifiedDate).Take(request.PageSize)
                            .OrderByDescending(h => h.ModifiedDate);
            }
            return null;
        }


        public async Task<Hospital> GetHospitalByIdAsync(int id)
        {
            return await _context.Hospitals.FindAsync(id);
        }

        public async Task<Hospital> AddHospitalAsync(Hospital hospital)
        {
            await _context.Hospitals.AddAsync(hospital);
            await _context.SaveChangesAsync();
            return hospital; // Return the hospital with generated Id
        }

        public async Task<Hospital> UpdateHospitalAsync(Hospital hospital)
        {
            _context.Hospitals.Update(hospital);
            await _context.SaveChangesAsync();
            return hospital; // Return the updated hospital
        }

        public async Task DeleteHospitalAsync(int id)
        {
            var hospital = await _context.Hospitals.FindAsync(id);
            if (hospital != null)
            {
                _context.Hospitals.Remove(hospital);
                await _context.SaveChangesAsync();
            }
        }
    }
}
