using HospitalApi.Models;
using HospitalApi.Services;
using System.IdentityModel.Tokens.Jwt;





namespace HospitalApi.Middlewares
{
    public class TokenRefreshMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly IConfiguration _configuration;

        public TokenRefreshMiddleware(RequestDelegate next, IConfiguration configuration)
        {
            _next = next;
            _configuration = configuration;
        }

        public async Task InvokeAsync(HttpContext context, JwtTokenService jwtTokenService)
        {
            var authHeader = context.Request.Headers["Authorization"].ToString();

            if (!string.IsNullOrEmpty(authHeader) && authHeader.StartsWith("Bearer "))
            {
                var token = authHeader.Substring("Bearer ".Length).Trim();

                var handler = new JwtSecurityTokenHandler();
                JwtSecurityToken jwtToken;

                try
                {
                    jwtToken = handler.ReadJwtToken(token);
                }
                catch
                {
                    // Invalid token format
                    context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                    await context.Response.WriteAsync("Invalid token.");
                    return;
                }

                var expClaim = jwtToken.Payload.Exp;
                if (expClaim == null)
                {
                    context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                    await context.Response.WriteAsync("Invalid token: missing expiry.");
                    return;
                }

                var expiryTime = DateTimeOffset.FromUnixTimeSeconds((long)expClaim);
                var now = DateTimeOffset.UtcNow;
                var timeLeft = expiryTime - now;

               /* if (timeLeft.TotalSeconds <= 0)
                {
                    // Token expired - reject
                    context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                    await context.Response.WriteAsync("Token expired.");
                    return;
                }*/
                 if (timeLeft.TotalMinutes < 1)
                {
                    // Less than 1 minute left - issue new token

                    // Extract user info from claims for new token generation
                    var userIdClaim = jwtToken.Claims.FirstOrDefault(c => c.Type == "id")?.Value;
                    var roleClaim = jwtToken.Claims.FirstOrDefault(c => c.Type == "role")?.Value;
                    var emailClaim = jwtToken.Claims.FirstOrDefault(c => c.Type == "email")?.Value;
                    var fullNameClaim = jwtToken.Claims.FirstOrDefault(c => c.Type == "fullName")?.Value;
                    var hospitalIdClaim = jwtToken.Claims.FirstOrDefault(c => c.Type == "hospitalId")?.Value;

                    if (userIdClaim != null && roleClaim != null && emailClaim != null && fullNameClaim != null && hospitalIdClaim != null)
                    {
                        // Recreate user object for token generation
                        var user = new User
                        {
                            Id = int.Parse(userIdClaim),
                            Role = Enum.TryParse<Role>(roleClaim, out var parsedRole) ? parsedRole : Role.All,
                            Email = emailClaim,
                            FullName = fullNameClaim,
                            HospitalId = int.Parse(hospitalIdClaim)
                        };

                        var newToken = jwtTokenService.GenerateToken(user);

                        // Add new token to response headers so frontend can update stored token
                        context.Response.OnStarting(() =>
                        {
                            context.Response.Headers.Add("X-Refresh-Token", newToken);
                            return Task.CompletedTask;
                        });
                    }
                }
            }

            // Continue request pipeline
            await _next(context);
        }
    }
}
