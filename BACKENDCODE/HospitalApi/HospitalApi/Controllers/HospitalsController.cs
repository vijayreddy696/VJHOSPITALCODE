using HospitalApi.Models;
using HospitalApi.Services;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace HospitalApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HospitalsController : ControllerBase
    {

        private readonly IHospitalService _hospitalService;

        public HospitalsController(IHospitalService hospitalService)
        {
            _hospitalService = hospitalService;
        }
        // GET: api/hospitals
        [HttpGet("gethospitals")]
        public async Task<IActionResult> GetHospitals()
        {
            var hospitals = await _hospitalService.GetAllHospitalsAsync();
            return Ok(hospitals);
        }

        // GET: api/hospitals/5
        [HttpGet("gethospitalbyid/{id}")]
        public async Task<IActionResult> GetHospital(int id)
        {
            var hospital = await _hospitalService.GetHospitalByIdAsync(id);
            if (hospital == null)
            {
                return NotFound();
            }
            return Ok(hospital);
        }
        // POST api/<HospitalsController>
        // POST: api/hospitals
        [HttpPost("addorupdatehospital")]
        public async Task<IActionResult> AddOrUpdateHospital([FromBody] Hospital hospital)
        {
            if (hospital == null)
            {
                return BadRequest();
            }

            try
            {
                Hospital result = await _hospitalService.AddOrUpdateHospitalAsync(hospital);
                if (result == null)
                {
                    return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while saving the hospital data.");
                }

                return Ok(result); // Always return 200 OK with the data
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // DELETE: api/hospitals/5
        [HttpDelete("deletehospitalbyid/{id}")]
        public async Task<IActionResult> DeleteHospital(int id)
        {
            try
            {
                await _hospitalService.DeleteHospitalAsync(id);
                return NoContent(); // 204 No Content for successful deletion
            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }
        }

        // PUT api/<HospitalsController>/5

    }
}
