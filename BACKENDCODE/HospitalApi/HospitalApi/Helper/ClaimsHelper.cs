namespace HospitalApi.Helper
{
    public class ClaimsHelper
    {

        private readonly IHttpContextAccessor _httpContextAccessor;

        public ClaimsHelper(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public string GetHospitalId()
        {
            var user = _httpContextAccessor.HttpContext?.User;
            return user?.Claims?.FirstOrDefault(c => c.Type == "hospitalId")?.Value;
        }
    }
}
