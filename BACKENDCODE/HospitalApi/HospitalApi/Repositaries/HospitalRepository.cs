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
            IQueryable<Hospital> query = _context.Hospitals
                .Include(h => h.OwnerDetails) // Eagerly load OwnerDetails
                .AsNoTracking();

            query = query.Where(d => d.Status == true);


            if (!string.IsNullOrEmpty(paginationRequest.SearchValue))
                query = ApplySearchFilter(query, paginationRequest);

            var filteredQuery = query;

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
                    EF.Functions.Contains(h.HospitalEmail, $"\"{request.SearchValue}*\"")
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
            if (request.LastCreatedDate == null && request.FirstCreatedDate == null)
            {
                return query.OrderByDescending(u => u.CreatedDate).Take(request.PageSize);
            }
            else if (request.LastCreatedDate != null)
            {
                return query.Where(u => u.CreatedDate < request.LastCreatedDate)
                            .OrderByDescending(u => u.CreatedDate)
                            .Take(request.PageSize);
            }
            else if (request.FirstCreatedDate != null)
            {
                return query.Where(u => u.CreatedDate > request.FirstCreatedDate)
                            .OrderBy(u => u.CreatedDate).Take(request.PageSize)
                            .OrderByDescending(u => u.CreatedDate);
            }
            return null;
        }

        public async Task<Hospital> GetHospitalByIdAsync(int id)
        {
            return await _context.Hospitals
                .Include(h => h.OwnerDetails) // Eagerly load OwnerDetails
                .FirstOrDefaultAsync(h => h.Id == id);
        }




        public async Task<Hospital> AddHospitalAsync(Hospital hospital)
        {
            // 1. Add owner without HospitalId (we’ll set it later)
            User owner = hospital.OwnerDetails;
            _context.Users.Add(owner);
            await _context.SaveChangesAsync(); // Get owner.Id

            // 2. Add hospital and link OwnerId
            hospital.OwnerId = owner.Id;
            hospital.OwnerDetails = null; // Prevent EF circular tracking issue
            _context.Hospitals.Add(hospital);
            await _context.SaveChangesAsync(); // Get hospital.Id

            // 3. Now update owner with HospitalId
            owner.HospitalId = hospital.Id;
            _context.Users.Update(owner);
            await _context.SaveChangesAsync();

            return hospital;
        }


        public async Task<Hospital> UpdateHospitalAsync(Hospital hospital)
        {
            _context.Hospitals.Update(hospital);
            _context.Users.Update(hospital.OwnerDetails);
            await _context.SaveChangesAsync();
            return hospital; // Return the updated hospital
        }

        public async Task DeleteHospitalAsync(int id)
        {
            Hospital hospital = await _context.Hospitals.FindAsync(id);
            if (hospital != null)
            {
                hospital.Status = false;
                _context.Hospitals.Update(hospital);
                await _context.SaveChangesAsync();
            }
        }
    }
}
