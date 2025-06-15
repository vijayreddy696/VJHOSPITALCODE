using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HospitalApi.Data;
using HospitalApi.Models;

using HospitalApi.Helper;
using HospitalApi.Models;
using HospitalApi.Services;
using Microsoft.AspNetCore.Mvc;

namespace HospitalApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QualificationsController : ControllerBase
    {
        private readonly IQualificationService _qualificationService;
        private readonly ClaimsHelper _claimsHelper;

        public QualificationsController(IQualificationService qualificationService, ClaimsHelper claimsHelper)
        {
            _qualificationService = qualificationService;
            _claimsHelper = claimsHelper;
        }

        // POST: api/qualifications/getqualifications
        [HttpPost("getqualifications")]
        public async Task<IActionResult> GetQualifications([FromBody] PaginationRequest paginationRequest)
        {
            try
            {
                paginationRequest.HospitalId = int.Parse(_claimsHelper.GetHospitalId());
                var qualifications = await _qualificationService.GetQualificationsWithPaginationAsync(paginationRequest);
                return Ok(qualifications);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error retrieving qualifications: {ex.Message}");
            }
        }

        // GET: api/qualifications/getqualificationbyid/5
        [HttpGet("getqualificationbyid/{id}")]
        public async Task<IActionResult> GetQualificationById(int id)
        {
            try
            {
                var qualification = await _qualificationService.GetQualificationByIdAsync(id);
                if (qualification == null)
                {
                    return NotFound("Qualification not found.");
                }
                return Ok(qualification);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error retrieving qualification: {ex.Message}");
            }
        }

        // POST: api/qualifications/addorupdatequalification
        [HttpPost("addorupdatequalification")]
        public async Task<IActionResult> AddOrUpdateQualification([FromBody] Qualification qualification)
        {
            try
            {
                if (qualification == null)
                {
                    return BadRequest("Qualification data is required.");
                }

                qualification.HospitalId = int.Parse(_claimsHelper.GetHospitalId());
                var result = await _qualificationService.AddOrUpdateQualificationAsync(qualification);

                if (result == null)
                {
                    return StatusCode(StatusCodes.Status500InternalServerError, "Error saving qualification.");
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error saving qualification: {ex.Message}");
            }
        }

        // DELETE: api/qualifications/deletequalificationbyid/5
        [HttpDelete("deletequalificationbyid/{qualificationId}")]
        public async Task<IActionResult> DeleteQualification(int qualificationId)
        {
            try
            {
                await _qualificationService.DeleteQualificationAsync(qualificationId);
                return Ok(new { message = "Qualification deleted successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error deleting qualification: {ex.Message}");
            }
        }

        // POST: api/qualifications/deletemultiplequalifications
        [HttpPost("deletemultiplequalifications")]
        public async Task<IActionResult> DeleteMultipleQualifications([FromBody] List<int> qualificationIds)
        {
            try
            {
                if (qualificationIds == null || !qualificationIds.Any())
                {
                    return BadRequest("No qualification IDs provided for deletion.");
                }

                await _qualificationService.DeleteMultipleQualificationsAsync(qualificationIds);
                return Ok(new { message = "Qualifications deleted successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error deleting qualifications: {ex.Message}");
            }
        }
    }
}
