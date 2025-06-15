using HospitalApi.Data;
using HospitalApi.Dtos;
using HospitalApi.Models;
using Microsoft.EntityFrameworkCore;

namespace HospitalApi.Repositaries
{
    public interface IDoctorRepository
    {
        Task<Doctor?> GetByIdAsync(int id);
        Task<List<Doctor>> GetDoctorsByIdsAsync(List<int> ids);
        Task AddAsync(Doctor doctor);
        Task UpdateAsync(Doctor doctor);
        Task DeleteAsync(Doctor doctor);
        Task DeleteManyDoctorsAsync(IEnumerable<Doctor> doctors);
        Task<PagedResult<DoctorDto>> GetDoctorsWithPaginationAsync(PaginationRequest paginationRequest);
    }
    public class DoctorRepository : IDoctorRepository
    {
        private readonly HospitalContext _context;

        public DoctorRepository(HospitalContext context)
        {
            _context = context;
        }

        public async Task<PagedResult<DoctorDto>> GetDoctorsWithPaginationAsync(PaginationRequest paginationRequest)
        {
            IQueryable<Doctor> query = _context.Doctor.AsNoTracking();

            if (paginationRequest.HospitalId > 0)
            {
                query = query.Where(d => d.HospitalId == paginationRequest.HospitalId);
            }
            else
            {
                throw new ArgumentException("HospitalId is required.");
            }

            if (!string.IsNullOrEmpty(paginationRequest.SearchValue))
            {
                query = ApplyDoctorSearchFilter(query, paginationRequest);
            }

            var filteredQuery = query;
            query = ApplyDatePagination(query, paginationRequest);

            var totalCount = await filteredQuery.CountAsync();
            IEnumerable<DoctorDto> pagedDoctors = await query.Select(d => new DoctorDto
      {
          Id = d.Id,
          FullName = d.FullName,
          Email = d.Email,
          PhoneNumber = d.PhoneNumber,
          Gender = d.Gender,
          HospitalId = d.HospitalId??0,
          QualificationId = d.QualificationId,
          SpecializationId = d.SpecializationId,
          CreatedDate = d.CreatedDate,
          Experience = d.Experience??0,
          IsActive = d.IsActive,
          Qualification = d.Qualification != null ? new QualificationDto
          {
              Id = d.Qualification.Id,
              Code = d.Qualification.Code
          } : null,
          Specialization = d.Specialization != null ? new SpecializationDto
          {
              Id = d.Specialization.Id,
              SpecializationName = d.Specialization.SpecializationName,
              DepartmentId = d.Specialization.DepartmentId??0,
              Department = d.Specialization.Department != null ? new DepartmentDto
              {
                  Id = d.Specialization.Department.Id,
                  DepartmentName = d.Specialization.Department.DepartmentName
              } : null
          } : null
      })
      .ToListAsync();

            return new PagedResult<DoctorDto>
            {
                TotalCount = totalCount,
                PageNumber = paginationRequest.PageNumber,
                PageSize = paginationRequest.PageSize,
                Items = pagedDoctors
            };
        }

        private IQueryable<Doctor> ApplyDoctorSearchFilter(IQueryable<Doctor> query, PaginationRequest request)
        {
            return query.Where(d =>
                EF.Functions.Contains(d.FullName, $"\"{request.SearchValue}*\"")
            );
        }

        private IQueryable<Doctor> ApplyDatePagination(IQueryable<Doctor> query, PaginationRequest request)
        {
            if (request.LastCreatedDate == null)
            {
                return query.OrderByDescending(u => u.CreatedDate).Take(request.PageSize);
            }
            else if (request.LastCreatedDate != null)
            {
                return query.Where(u => request.LastCreatedDate > u.CreatedDate)
                            .OrderByDescending(u => u.CreatedDate)
                            .Take(request.PageSize);
            }
            return null;
        }

        public async Task<Doctor?> GetByIdAsync(int id)
        {
            return await _context.Doctor
                .Include(d => d.Qualification)
                .Include(d => d.Specialization)
                .ThenInclude(s => s.Department)
                .FirstOrDefaultAsync(d => d.Id == id);
        }

        public async Task<List<Doctor>> GetDoctorsByIdsAsync(List<int> ids)
        {
            return await _context.Doctor
                .Where(d => ids.Contains(d.Id))
                .ToListAsync();
        }

        public async Task AddAsync(Doctor doctor)
        {
            _context.Doctor.Add(doctor);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Doctor doctor)
        {
            _context.Doctor.Update(doctor);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Doctor doctor)
        {
            _context.Doctor.Remove(doctor);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteManyDoctorsAsync(IEnumerable<Doctor> doctors)
        {
            _context.Doctor.RemoveRange(doctors);
            await _context.SaveChangesAsync();
        }
    }
}
