export interface PagedRequest {
    pageNumber?: number;
    pageSize?: number;
    searchValue?: string;
    firstCreatedDate?: Date; // Use string for DateTime when sending to backend
    lastCreatedDate?: Date;
    fullTextSearch?: boolean;
  }
  