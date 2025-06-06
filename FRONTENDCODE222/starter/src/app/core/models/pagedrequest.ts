export interface PagedRequest {
    pageNumber?: number;
    pageSize?: number;
    searchValue?: string;
    lastCreatedDate?: Date;
    fullTextSearch?: boolean;
  }
  