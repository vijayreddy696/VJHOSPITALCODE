using HospitalApi.Helper;
using HospitalApi.Models;
using HospitalApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HospitalApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly ClaimsHelper _claimsHelper;

        public UsersController(IUserService userService, ClaimsHelper claimsHelper)
        {
            _userService = userService;
            _claimsHelper = claimsHelper;
        }

        // POST: api/users/getusers

        [HttpPost("getusers")]
        public async Task<IActionResult> GetUsers([FromBody] PaginationRequest paginationRequest)
        {
            try
            {
                paginationRequest.HospitalId = int.Parse(_claimsHelper.GetHospitalId());

                var users = await _userService.GetUsersWithPaginationAsync(paginationRequest);
                return Ok(users);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error retrieving users: {ex.Message}");
            }
        }


        // GET: api/users/getuserbyid/{hospitalId}/{id}
        [HttpGet("getuserbyid/{id}")]
        public async Task<IActionResult> GetUser(int id)
        {
            try
            {
                var user = await _userService.GetUserByIdAsync(id);
                if (user == null)
                {
                    return NotFound("User not found.");
                }
                return Ok(user);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error retrieving user: {ex.Message}");
            }
        }


        [HttpGet("getuserbyemail/{email}")]
        public async Task<IActionResult> GetUser(string email)
        {
            try
            {
                int HospitalId = int.Parse(_claimsHelper.GetHospitalId());

                User user = await _userService.GetUserByEmailAsync(HospitalId, true,email);
                return Ok(user);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error retrieving user: {ex.Message}");
            }
        }

        // POST: api/users/addorupdateuser
        [HttpPost("addorupdateuser")]
        public async Task<IActionResult> AddOrUpdateUser([FromBody] User user)
        {
            try
            {
                if (user == null)
                {
                    return BadRequest("User data is required.");
                }
                user.HospitalId = int.Parse(_claimsHelper.GetHospitalId());
                if (user.Id == 0)
                {
                    User existingUser = await _userService.GetUserByEmailAsync(user.HospitalId.Value, false, user.Email);
                    if (existingUser != null)
                        return Conflict(existingUser);
                }
                User result = await _userService.AddOrUpdateUserAsync(user);
                if (result == null)
                {
                    return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while saving the user data.");
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error saving user: {ex.Message}");
            }
        }


        // PUT: api/users/activateuserbyid/{id}
        [HttpPut("activateuserbyid/{id}")]
        public async Task<IActionResult> ActivateUser(int id)
        {
            try
            {
                int hospitalId = int.Parse(_claimsHelper.GetHospitalId());

                await _userService.ActivateUserAsync(id);
                return Ok(new { message = "User activated successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error activating user: {ex.Message}");
            }
        }


        // DELETE: api/users/deleteuserbyid/{hospitalId}/{userId}
        [HttpDelete("deleteuserbyid/{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            try
            {
                int HospitalId = int.Parse(_claimsHelper.GetHospitalId());

                await _userService.DeleteUserAsync(id);
                return Ok(new { message = "User deleted successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error deleting user: {ex.Message}");
            }
        }


        [HttpPost("deletemultipleusers")]
        public async Task<IActionResult> DeleteMultipleUsers([FromBody] List<int> userIds)
        {
            try
            {
                int hospitalId = int.Parse(_claimsHelper.GetHospitalId());

                if (userIds == null || !userIds.Any())
                {
                    return BadRequest("No user IDs provided for deletion.");
                }

                await _userService.DeleteMultipleUsersAsync(userIds);
                return Ok(new { message = "Users deleted successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error deleting users: {ex.Message}");
            }
        }

    }
}
