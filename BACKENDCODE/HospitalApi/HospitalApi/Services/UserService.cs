using HospitalApi.Models;
using HospitalApi.Repositaries;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace HospitalApi.Services
{
    public interface IUserService
    {
        Task<PagedResult<User>> GetUsersWithPaginationAsync(PaginationRequest paginationRequest);
        Task<User> GetUserByIdAsync(int id);
        Task<User> AddOrUpdateUserAsync(User user);
        Task<User?> GetUserByEmailAsync(int hospitalId, bool status, string email);
        Task DeleteMultipleUsersAsync(List<int> userIds);
        Task ActivateOrDeactivateUserAsync(int id, bool toactivate);
        Task HardDeleteUserByAsync(User user);

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

        public async Task HardDeleteUserByAsync(User user)
        {
            try
            {
                 await _userRepository.HardDeleteUserAsync(user);
            }
            catch (Exception ex)
            {
                throw new Exception($"An error occurred while retrieving the user with ID {user.Id}.", ex);
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
                user.Password = _passwordHasher.HashPassword(user, user.Password);

                if (user.Id == 0)
                {
                        await _userRepository.AddUserAsync(user);
                    return user;
                }
                else
                {
                    
                    await _userRepository.UpdateUserAsync(user);
                    return user;
                }
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while adding or updating the user.", ex);
            }
        }

        public async Task ActivateOrDeactivateUserAsync(int id,bool toactivate)
        {
            try
            {
                User existingUser = await _userRepository.GetUserByIdAsync(id);
                if (existingUser != null)
                {
                    existingUser.Status = toactivate;
                    await _userRepository.UpdateUserAsync(existingUser);
                }
                else
                {
                    throw new Exception("User not found for activation or deactivation.");
                }
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while activating or deactivating the user.", ex);
            }
        }


        public async Task UpdateManyUsersAsync(IEnumerable<User> users)
        {
            try
            {
                await _userRepository.UpdateManyUsersAsync(users);
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while updating the users.", ex);
            }
        }


       
        public async Task DeleteMultipleUsersAsync(List<int> userIds)
        {
            try
            {
                var users = await _userRepository.GetUsersByIdsAsync(userIds);
                if (users == null || !users.Any())
                {
                    throw new Exception("No users found for the provided IDs.");
                }
                foreach (var user in users)
                {
                    user.Status = false; // Soft delete
                }
                await _userRepository.UpdateManyUsersAsync(users);
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while deleting multiple users.", ex);
            }
        }

        public async Task<User> GetUserByEmailAsync(int hospitalId,bool status, string email)
        {
            try
            {
                return await _userRepository.GetUserByEmailAsync(hospitalId,status, email);
            }
            catch (Exception ex)
            {
                throw new Exception($"An error occurred while retrieving the user with email {email}.", ex);
            }
        }
    }
}
