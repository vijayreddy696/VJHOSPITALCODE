using HospitalApi.Helper;
using HospitalApi.Models;
using HospitalApi.Services;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HospitalApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DoctorsController : ControllerBase
    {
        private readonly IDoctorService _doctorService;
        private readonly ClaimsHelper _claimsHelper;

        public DoctorsController(IDoctorService doctorService, ClaimsHelper claimsHelper)
        {
            _doctorService = doctorService;
            _claimsHelper = claimsHelper;
        }

        [HttpPost("getdoctors")]
        public async Task<IActionResult> GetDoctors([FromBody] PaginationRequest paginationRequest)
        {
            paginationRequest.HospitalId = int.Parse(_claimsHelper.GetHospitalId());

            var pagedDoctors = await _doctorService.GetDoctorsWithPaginationAsync(paginationRequest);
            return Ok(pagedDoctors);
        }

        [HttpGet("getdoctorbyid/{id}")]
        public async Task<IActionResult> GetDoctorById(int id)
        {
            var doctor = await _doctorService.GetDoctorByIdAsync(id);
            if (doctor == null)
                return NotFound();

            return Ok(doctor);
        }

        [HttpPost("addorupdatedoctor")]
        public async Task<IActionResult> AddOrUpdateDoctor([FromBody] Doctor doctor)
        {
            try
            {
                if (doctor == null)
                {
                    return BadRequest("Doctor data is required.");
                }

                // Set hospital ID from claims
                doctor.HospitalId = int.Parse(_claimsHelper.GetHospitalId());

                    await _doctorService.AddOrUpdateDoctorAsync(doctor);

                return Ok(new { message = "Doctor saved successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error saving doctor: {ex.Message}");
            }
        }


        [HttpDelete("deletedoctorbyid/{id}")]
        public async Task<IActionResult> DeleteDoctor(int id)
        {
            var existing = await _doctorService.GetDoctorByIdAsync(id);
            if (existing == null)
                return NotFound();

            await _doctorService.DeleteDoctorAsync(id);
            return NoContent();
        }

        [HttpPost("deletemultipledoctors")]
        public async Task<IActionResult> DeleteMultipleDoctors([FromBody] List<int> doctorIds)
        {
            if (doctorIds == null || !doctorIds.Any())
                return BadRequest("No doctor IDs provided for deletion.");

            await _doctorService.DeleteMultipleDoctorsAsync(doctorIds);
            return Ok(new { message = "Doctors deleted successfully." });
        }
    }
}
