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

        public DepartmentsController(IDepartmentService departmentService)
        {
            _departmentService = departmentService;
        }

        // GET: api/departments
        [HttpPost("getdepartments")]
        public async Task<IActionResult> GetDepartments([FromBody] PaginationRequest paginationRequest)
        {
            try
            {
                var departments = await _departmentService.GetDepartmentsWithPaginationAsync(paginationRequest);
                return Ok(departments);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error retrieving departments: {ex.Message}");
            }
        }

        // GET: api/departments/5
        [HttpGet("getdepartmentbyid/{hospitalId}/{id}")]
        public async Task<IActionResult> GetDepartment(int hospitalId, int id)
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
        [HttpDelete("deletedepartmentbyid/{hospitalId}/{departmentId}")]
        public async Task<IActionResult> DeleteDepartment(int hospitalId, int departmentId)
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
    }
}
