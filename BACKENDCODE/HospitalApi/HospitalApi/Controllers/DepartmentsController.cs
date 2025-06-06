using HospitalApi.Helper;
using HospitalApi.Models;
using HospitalApi.Services;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace HospitalApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DepartmentsController : ControllerBase
    {
        private readonly IDepartmentService _departmentService;
        private readonly ClaimsHelper _claimsHelper;


        public DepartmentsController(IDepartmentService departmentService, ClaimsHelper claimsHelper)
        {
            _departmentService = departmentService;
            _claimsHelper = claimsHelper;
        }

        // GET: api/departments
        [HttpPost("getdepartments")]
        public async Task<IActionResult> GetDepartments([FromBody] PaginationRequest paginationRequest)
        {
            try
            {
                paginationRequest.HospitalId = int.Parse(_claimsHelper.GetHospitalId());
                PagedResult<Department> departments = await _departmentService.GetDepartmentsWithPaginationAsync(paginationRequest);
                return Ok(departments);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error retrieving departments: {ex.Message}");
            }
        }

        // GET: api/departments/5
        [HttpGet("getdepartmentbyid/{id}")]
        public async Task<IActionResult> GetDepartment(int id)
        {
            try
            {
                var department = await _departmentService.GetDepartmentByIdAsync(id);
                if (department == null)
                {
                    return NotFound("Department not found.");
                }
                return Ok(department);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error retrieving department: {ex.Message}");
            }
        }

        // POST: api/departments
        [HttpPost("addorupdatedepartment")]
        public async Task<IActionResult> AddOrUpdateDepartment([FromBody] Department department)
        {
            try
            {
                if (department == null)
                {
                    return BadRequest("Department data is required.");
                }

                department.HospitalId = int.Parse(_claimsHelper.GetHospitalId());

                Department result = await _departmentService.AddOrUpdateDepartmentAsync(department);
                if (result == null)
                {
                    return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while saving the department data.");
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error saving department: {ex.Message}");
            }
        }

        // DELETE: api/departments
        [HttpDelete("deletedepartmentbyid/{departmentId}")]
        public async Task<IActionResult> DeleteDepartment(int departmentId)
        {
            try
            {
                await _departmentService.DeleteDepartmentAsync(departmentId);
                return Ok(new { message = "Department deleted successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error deleting department: {ex.Message}");
            }
        }

        [HttpPost("deletemultipledepartments")]
        public async Task<IActionResult> DeleteMultipleDepartments([FromBody] List<int> departmentIds)
        {
            try
            {
                int hospitalId = int.Parse(_claimsHelper.GetHospitalId());

                if (departmentIds == null || !departmentIds.Any())
                {
                    return BadRequest("No department IDs provided for deletion.");
                }

                await _departmentService.DeleteMultipleDepartmentsAsync(departmentIds);
                return Ok(new { message = "Departments deleted successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error deleting departments: {ex.Message}");
            }
        }
    }
}
