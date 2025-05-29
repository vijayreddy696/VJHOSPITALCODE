using HospitalApi.Data;
using HospitalApi.Models;
using Microsoft.EntityFrameworkCore;

namespace HospitalApi.Repositaries
{
    public interface IUserRepository
    {
        Task<PagedResult<User>> GetUsersWithPaginationAsync(PaginationRequest paginationRequest);
        Task<User> GetUserByIdAsync(int id);
        Task AddUserAsync(User user);
        Task UpdateUserAsync(User user);
        Task UpdateManyUsersAsync(IEnumerable<User> users);
        Task<List<User>> GetUsersByIdsAsync(List<int> ids);
        Task<User?> GetUserByEmailAsync(int hospitalId , bool status, string email);

        Task HardDeleteUserAsync(User user);


    }

    public class UserRepository : IUserRepository
    {
        private readonly HospitalContext _context;

        public UserRepository(HospitalContext context)
        {
            _context = context;
        }

        public async Task<PagedResult<User>> GetUsersWithPaginationAsync(PaginationRequest paginationRequest)
        {
            IQueryable<User> query = _context.Users.AsNoTracking();

            if (paginationRequest.HospitalId > 0)
            {
                query = query.Where(u => u.HospitalId == paginationRequest.HospitalId);
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
            var pagedUsers = await query.ToListAsync();

            return new PagedResult<User>
            {
                TotalCount = totalCount,
                PageNumber = paginationRequest.PageNumber,
                PageSize = paginationRequest.PageSize,
                Items = pagedUsers
            };
        }

        private IQueryable<User> ApplySearchFilter(IQueryable<User> query, PaginationRequest request)
        {
            if (request.FullTextSearch)
            {
                // Use CONTAINS for more flexible and faster substring searching
                return query.Where(u =>
                    EF.Functions.Contains(u.FullName, $"\"{request.SearchValue}*\"") ||
                    EF.Functions.Contains(u.Email, $"\"{request.SearchValue}*\"") ||
                    EF.Functions.Contains(u.PhoneNumber, $"\"{request.SearchValue}*\"") 
                );
            }
            else
            {
                // If  full-text search only fro fullname , fall back to simple matching for FullName and Email
                return query.Where(u =>
                    EF.Functions.Contains(u.FullName, $"\"{request.SearchValue}*\"") ||
                    EF.Functions.Contains(u.Email, $"\"{request.SearchValue}*\"")
                );
            }
        }

        private IQueryable<User> ApplyDatePagination(IQueryable<User> query, PaginationRequest request)
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

        public async Task<User> GetUserByIdAsync(int id)
        {
            return await _context.Users.Where(u => u.Id == id).FirstOrDefaultAsync();
        }

        public async Task AddUserAsync(User user)
        {
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateUserAsync(User user)
        {
            _context.Users.Update(user);
            await _context.SaveChangesAsync();
        }

        public async Task HardDeleteUserAsync(User user)
        {
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateManyUsersAsync(IEnumerable<User> users)
        {
            _context.Users.UpdateRange(users);
            await _context.SaveChangesAsync();
        }


        public async Task<List<User>> GetUsersByIdsAsync(List<int> ids)
        {
            return await _context.Users
                .Where(u => ids.Contains(u.Id))
                .ToListAsync();
        }


        public async Task<User?> GetUserByEmailAsync(int hospitalId, bool status, string email)
        {
            return await _context.Users.Where(u => u.HospitalId == hospitalId && u.Status == status && u.Email == email).FirstOrDefaultAsync();
        }

       


    }
}
