using HospitalApi.Data;
using HospitalApi.Repositaries;
using HospitalApi.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;


var builder = WebApplication.CreateSlimBuilder(args);

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
builder.Services.AddScoped<IHospitalRepository, HospitalRepository>();
builder.Services.AddScoped<IHospitalService, HospitalService>();
builder.Services.AddScoped<IDepartmentRepository, DepartmentRepository>();
builder.Services.AddScoped<IDepartmentService, DepartmentService>();
// Add controllers for API endpoints
builder.Services.AddControllers()
    .AddNewtonsoftJson(options =>
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

// Set up routing for the API controllers
app.UseRouting();

// Map controllers to their respective endpoints
app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();  // Ensure this maps the controller endpoints
});

// Run the application
app.Run();
