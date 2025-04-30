using HospitalApi.Data;
using HospitalApi.Models;
using Microsoft.EntityFrameworkCore;

namespace HospitalApi.Repositaries
{
    public interface IUserRepository
    {
        Task<PagedResult<User>> GetUsersWithPaginationAsync(PaginationRequest paginationRequest);
        Task<User> GetUserByIdAsync(int id);
        Task<User> AddUserAsync(User user);
        Task<User> UpdateUserAsync(User user);
        Task DeleteUserAsync(int userId);
        Task<User?> GetUserByEmailAsync(int hospitalId , string email);

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
                // If no full-text search, fall back to simple matching for FullName and Email
                return query.Where(u =>
                    EF.Functions.Contains(u.FullName, $"\"{request.SearchValue}*\"") ||
                    EF.Functions.Contains(u.Email, $"\"{request.SearchValue}*\"")
                );
            }
        }

        private IQueryable<User> ApplyDatePagination(IQueryable<User> query, PaginationRequest request)
        {
            if (request.LastModifiedDate == null && request.FirstModifiedDate == null)
            {
                return query.OrderByDescending(u => u.ModifiedDate).Take(request.PageSize);
            }
            else if (request.LastModifiedDate != null)
            {
                return query.Where(u => u.ModifiedDate < request.LastModifiedDate)
                            .OrderByDescending(u => u.ModifiedDate)
                            .Take(request.PageSize);
            }
            else if (request.FirstModifiedDate != null)
            {
                return query.Where(u => u.ModifiedDate > request.FirstModifiedDate)
                            .OrderBy(u => u.ModifiedDate).Take(request.PageSize)
                            .OrderByDescending(u => u.ModifiedDate);
            }
            return null;
        }

        public async Task<User> GetUserByIdAsync(int id)
        {
            return await _context.Users.Where(u => u.Id == id).FirstOrDefaultAsync();
        }

        public async Task<User> AddUserAsync(User user)
        {
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();
            return user; // Return the user with generated Id
        }

        public async Task<User> UpdateUserAsync(User user)
        {
            _context.Users.Update(user);
            await _context.SaveChangesAsync();
            return user; // Return the updated user
        }

        public async Task DeleteUserAsync(int id)
        {
            var user = await _context.Users
                                      .FirstOrDefaultAsync(u => u.Id == id);

            if (user != null)
            {
                _context.Users.Remove(user);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<User?> GetUserByEmailAsync(int hospitalId, string email)
        {
            return await _context.Users.Where(u => u.HospitalId == hospitalId && u.Email == email).FirstOrDefaultAsync();
        }


    }
}
