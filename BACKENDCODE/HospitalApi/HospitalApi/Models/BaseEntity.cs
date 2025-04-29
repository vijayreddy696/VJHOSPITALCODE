namespace HospitalApi.Models
{
    public class BaseEntity
    {
        public DateTime CreatedDate { get; set; }
        public DateTime ModifiedDate { get; set; }
    }

    public class PagedResult<T>
    {
        public int TotalCount { get; set; }
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public IEnumerable<T> Items { get; set; }
    }

    public class PaginationRequest
    {
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public string? SearchValue { get; set; }
        public DateTime? FirstModifiedDate { get; set; }
        public DateTime? LastModifiedDate { get; set; }
        public bool FullTextSearch { get; set; } = false;
        public int? HospitalId { get; set; }
    }


}
