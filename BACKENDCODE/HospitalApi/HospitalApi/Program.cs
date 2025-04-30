using HospitalApi.Data;
using HospitalApi.Models;
using HospitalApi.Repositaries;
using HospitalApi.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System.Text;


var builder = WebApplication.CreateSlimBuilder(args);


var jwtSettings = builder.Configuration.GetSection("JWT");
var secretKey = jwtSettings["JWT_SECRET_KEY"];
var issuer = jwtSettings["JWT_ISSUER"];
var audience = jwtSettings["JWT_AUDIENCE"];


builder.Services.AddAuthentication("Bearer")
    .AddJwtBearer("Bearer", options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateIssuerSigningKey = true,
            ValidateLifetime = true,
            ValidIssuer = issuer,
            ValidAudience = audience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey))
        };
    });

builder.Services.AddAuthorization();
// Configure the DB context for SQL Server
builder.Services.AddDbContext<HospitalContext>(options =>
{
    var connectionString = builder.Configuration.GetConnectionString("DevelopmentConnection");
    options.UseSqlServer(connectionString, sqlServerOptions =>
    {
        sqlServerOptions.EnableRetryOnFailure(
            maxRetryCount: 5,                      // Try 5 times
            maxRetryDelay: TimeSpan.FromSeconds(10), // Wait up to 10 sec between retries
            errorNumbersToAdd: null                  // Optional: specific SQL error codes
        );
    });
});

// Add repositories and services
builder.Services.AddScoped<JwtTokenService>();
builder.Services.AddScoped<IHospitalRepository, HospitalRepository>();
builder.Services.AddScoped<IHospitalService, HospitalService>();
builder.Services.AddScoped<IDepartmentRepository, DepartmentRepository>();
builder.Services.AddScoped<IDepartmentService, DepartmentService>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IPasswordHasher<User>, PasswordHasher<User>>();


// Add controllers for API endpoints
builder.Services.AddControllers(options =>
{
    // Apply global authorization to all controllers
    options.Filters.Add(new Microsoft.AspNetCore.Mvc.Authorization.AuthorizeFilter());
}).AddNewtonsoftJson(options =>
    {
        // Customize the options if necessary
        options.SerializerSettings.Formatting = Formatting.Indented; // Example: Pretty print
        options.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver(); // Example: Camel case for JSON
    });

// Add Swagger for API documentation
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Hospital API",
        Version = "v1",
        Description = "API for managing hospital data",
    });
});

var app = builder.Build();

// Enable middleware to serve generated Swagger as a JSON endpoint
if (app.Environment.IsDevelopment())
{   
    app.UseSwagger(); // Enable the Swagger JSON endpoint
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Hospital API v1");
        c.RoutePrefix = "swagger"; // Swagger UI will be served at the '/swagger' path
    });
}
app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();
// Set up routing for the API controllers

// Map controllers to their respective endpoints
app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();  // Ensure this maps the controller endpoints
});

// Run the application
app.Run();
