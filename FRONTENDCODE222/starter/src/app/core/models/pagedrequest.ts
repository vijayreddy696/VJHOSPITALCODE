export interface PagedRequest {
    pageNumber?: number;
    pageSize?: number;
    searchValue?: string;
    firstModifiedDate?: Date; // Use string for DateTime when sending to backend
    lastModifiedDate?: Date;
    fullTextSearch?: boolean;
  }
  