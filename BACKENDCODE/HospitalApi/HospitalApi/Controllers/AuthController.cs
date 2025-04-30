using HospitalApi.Models;
using HospitalApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace HospitalApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly JwtTokenService _jwtTokenService;
        private readonly IUserService _userService;
        private readonly IPasswordHasher<User> _passwordHasher; // Use IPasswordHasher for password hashing

        public AuthController(JwtTokenService jwtTokenService, IUserService userService, IPasswordHasher<User> passwordHasher)
        {
            _jwtTokenService = jwtTokenService;
            _userService = userService;
            _passwordHasher = passwordHasher;
        }
        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Password))
            {
                return BadRequest(new { message = "Invalid login request." });
            }

            User user = await _userService.GetUserByEmailAsync(request.HospitalId, request.Email);
            if (user == null)
            {
                return Unauthorized(new { message = "User not found." });
            }

            // Password verification using IPasswordHasher
            var passwordVerificationResult = _passwordHasher.VerifyHashedPassword(user,user.Password, request.Password);

            if (passwordVerificationResult == PasswordVerificationResult.Failed)
            {
                return Unauthorized(new { message = "Invalid credentials." });
            }

            // Token Generation with additional user information (claims, expiry, etc.)
            var token = _jwtTokenService.GenerateToken(user); // Add email as claim
            return Ok(new { token });
        }
    }

    public class LoginRequest
    {
        public int HospitalId { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
    }

    // Example User class for password hashing
   
}
