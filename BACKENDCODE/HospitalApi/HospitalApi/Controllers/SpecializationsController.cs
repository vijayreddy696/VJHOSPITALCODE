using HospitalApi.Helper;
using HospitalApi.Models;
using HospitalApi.Services;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace HospitalApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SpecializationsController : ControllerBase
    {
        private readonly ISpecializationService _specializationService;
        private readonly ClaimsHelper _claimsHelper;


        public SpecializationsController(ISpecializationService specializationService, ClaimsHelper claimsHelper)
        {
            _specializationService = specializationService;
            _claimsHelper = claimsHelper;
        }

        // GET: api/Specialization?pageNumber=1&pageSize=10
        [HttpPost("getspecializations")]
        public async Task<IActionResult> GetSpecializations(PaginationRequest paginationRequest)
        {
            paginationRequest.HospitalId = int.Parse(_claimsHelper.GetHospitalId());
            PagedResult<Specialization> pagedResult = await _specializationService.GetSpecializationsAsync(paginationRequest);
            return Ok(pagedResult);
        }

        [HttpPost("addorupdatespecialization")]
        public async Task<IActionResult> AddOrUpdateSpecialization([FromBody] Specialization specialization)
        {
            try
            {
                if (specialization == null)
                {
                    return BadRequest("Specialization data is required.");
                }

                // Add HospitalId from claims if needed (assuming specialization has HospitalId)
                specialization.HospitalId = int.Parse(_claimsHelper.GetHospitalId());


                Specialization result = await _specializationService.AddOrUpdateSpecializationAsync(specialization);

                if (result == null)
                {
                    return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while saving the specialization data.");
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error saving specialization: {ex.Message}");
            }
        }


        // GET: api/Specialization/{id}
        [HttpGet("getspecializationbyid/{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            Specialization specialization = await _specializationService.GetByIdAsync(id);
            if (specialization == null)
                return NotFound();

            return Ok(specialization);
        }

        [HttpGet("getspecializationbydepartmentid/{departmentId}")]
        public async Task<IActionResult> GetSpecializationsByDepartmentId(int departmentId)
        {
            var specializations = await _specializationService.GetSpecializationsByDepartmentIdAsync(departmentId);
            return Ok(specializations);
        }

        // POST: api/Specialization
       


        // DELETE: api/Specialization/{id}
        [HttpDelete("deletespecializationbyid/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            Specialization existing = await _specializationService.GetByIdAsync(id);
            if (existing == null)
                return NotFound();

            await _specializationService.DeleteAsync(id);
            return NoContent();
        }

        [HttpPost("deletemultiplespecializations")]
        public async Task<IActionResult> DeleteMultiplespecializations([FromBody] List<int> specializationIds)
        {
            try
            {
                int hospitalId = int.Parse(_claimsHelper.GetHospitalId());

                if (specializationIds == null || !specializationIds.Any())
                {
                    return BadRequest("No department IDs provided for deletion.");
                }

                await _specializationService.DeleteManySpecializationsAsync(specializationIds);
                return Ok(new { message = "Departments deleted successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error deleting departments: {ex.Message}");
            }
        }
    }
}
