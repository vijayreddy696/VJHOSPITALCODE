using HospitalApi.Models;
using HospitalApi.Repositaries;
using Microsoft.AspNetCore.Identity;

namespace HospitalApi.Services
{
    public interface IUserService
    {
        Task<PagedResult<User>> GetUsersWithPaginationAsync(PaginationRequest paginationRequest);
        Task<User> GetUserByIdAsync(int id);
        Task<User> AddOrUpdateUserAsync(User user);
        Task DeleteUserAsync(int id);
        Task<User?> GetUserByEmailAsync(int hospitalId, string email);

    }

    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IPasswordHasher<User> _passwordHasher; // Use IPasswordHasher for password hashing
        


        public UserService(IUserRepository userRepository, IPasswordHasher<User> passwordHasher)
        {
            _userRepository = userRepository;
            _passwordHasher = passwordHasher;

        }

        public async Task<PagedResult<User>> GetUsersWithPaginationAsync(PaginationRequest paginationRequest)
        {
            try
            {
                return await _userRepository.GetUsersWithPaginationAsync(paginationRequest);
            }
            catch (Exception ex)
            {
                // Log exception if logging is set up
                throw new Exception("An error occurred while retrieving users with pagination.", ex);
            }
        }

        public async Task<User> GetUserByIdAsync(int id)
        {
            try
            {
                return await _userRepository.GetUserByIdAsync(id);
            }
            catch (Exception ex)
            {
                throw new Exception($"An error occurred while retrieving the user with ID {id}.", ex);
            }
        }

        public async Task<User> AddOrUpdateUserAsync(User user)
        {
            try
            {
                if (user == null)
                {
                    throw new ArgumentNullException(nameof(user));
                }

                if (user.Id == 0)
                {
                    user.Password = _passwordHasher.HashPassword(user, user.Password);
                    return await _userRepository.AddUserAsync(user);
                }
                else
                {
                    if (user.HospitalId == null)
                        throw new Exception("Hospital id is required");
                    user.Password = _passwordHasher.HashPassword(user, user.Password);
                    return await _userRepository.UpdateUserAsync(user);
                }
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while adding or updating the user.", ex);
            }
        }

        public async Task DeleteUserAsync(int id)
        {
            try
            {
                var existingUser = await _userRepository.GetUserByIdAsync(id);
                if (existingUser != null)
                {
                    await _userRepository.DeleteUserAsync(id);
                }
                else
                {
                    throw new Exception("User not found for deletion.");
                }
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while deleting the user.", ex);
            }
        }

        public async Task<User> GetUserByEmailAsync(int hospitalId, string email)
        {
            try
            {
                return await _userRepository.GetUserByEmailAsync(hospitalId,email);
            }
            catch (Exception ex)
            {
                throw new Exception($"An error occurred while retrieving the user with email {email}.", ex);
            }
        }
    }
}
