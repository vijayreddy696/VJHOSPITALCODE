using Azure.Core;
using HospitalApi.Data;
using HospitalApi.Dtos;
using HospitalApi.Models;
using Microsoft.EntityFrameworkCore;
using System.Buffers;

namespace HospitalApi.Repositaries
{
    public interface IHospitalRepository
    {
        Task<PagedResult<HospitalDto>> GetHospitalsWithPaginationAsync(PaginationRequest paginationRequest);
        Task<Hospital> GetHospitalByIdAsync(int id);
        Task AddHospitalAsync(Hospital hospital); // changed return type
        Task UpdateHospitalAsync(Hospital hospital); // changed return type
        Task DeleteHospitalAsync(Hospital hospital);
    }
    public class HospitalRepository : IHospitalRepository
    {
        private readonly HospitalContext _context;

        public HospitalRepository(HospitalContext context)
        {
            _context = context;
        }

        public async Task<PagedResult<HospitalDto>> GetHospitalsWithPaginationAsync(PaginationRequest paginationRequest)
        {
            IQueryable<Hospital> query = _context.Hospitals
                .Include(h => h.OwnerDetails) // Eagerly load OwnerDetails
                .AsNoTracking();

            query = query.Where(d => d.Status == true);


            if (!string.IsNullOrEmpty(paginationRequest.SearchValue))
                query = ApplySearchFilter(query, paginationRequest);

            var filteredQuery = query;

            query = ApplyDatePagination(query, paginationRequest);

            var totalCount = await filteredQuery.CountAsync();
            var pagedHospitals = await query
                .Select(h => new HospitalDto
                {
                    Id = h.Id,
                    HospitalName = h.HospitalName,
                    HospitalAddress = h.HospitalAddress,
                    HospitalEmail = h.HospitalEmail,
                    OwnerDetails = h.OwnerDetails == null ? null : new OwnerDto
                    {
                        Id = h.OwnerDetails.Id,
                        FullName = h.OwnerDetails.FullName,
                        Email = h.OwnerDetails.Email
                    }
                })
                .ToListAsync();

            return new PagedResult<HospitalDto>
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
                    EF.Functions.Contains(h.OwnerDetails.FullName, $"\"{request.SearchValue}*\"")
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

        public async Task<Hospital> GetHospitalByIdAsync(int id)
        {
            return await _context.Hospitals
                .Include(h => h.OwnerDetails) // Eagerly load OwnerDetails
                .FirstOrDefaultAsync(h => h.Id == id);
        }




        public async Task AddHospitalAsync(Hospital hospital)
        {
            _context.Hospitals.Add(hospital);
            await _context.SaveChangesAsync();
        }


        public async Task UpdateHospitalAsync(Hospital hospital)
        {
            _context.Hospitals.Update(hospital);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteHospitalAsync(Hospital existinghospital)
        {
            _context.Hospitals.Remove(existinghospital);
            await _context.SaveChangesAsync();
        }


    }
}
