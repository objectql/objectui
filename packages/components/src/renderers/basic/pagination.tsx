/**
 * ObjectUI
 * Copyright (c) 2024-present ObjectStack Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ComponentRegistry } from '@object-ui/core';
import type { PaginationSchema } from '@object-ui/types';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '../../ui/pagination';

ComponentRegistry.register('pagination', 
  ({ schema, ...props }: { schema: PaginationSchema; [key: string]: any }) => {
    const { 
        'data-obj-id': dataObjId, 
        'data-obj-type': dataObjType,
        style,
        ...paginationProps
    } = props;
    
    const currentPage = schema.currentPage || schema.page || 1;
    const totalPages = schema.totalPages || 1;
    const showEllipsis = totalPages > 7;
    
    const getPageNumbers = () => {
      if (totalPages <= 7) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
      }
      
      if (currentPage <= 3) {
        return [1, 2, 3, 4, 5, -1, totalPages];
      }
      
      if (currentPage >= totalPages - 2) {
        return [1, -1, totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
      }
      
      return [1, -1, currentPage - 1, currentPage, currentPage + 1, -1, totalPages];
    };
    
    return (
      <Pagination 
        className={schema.className} 
        {...paginationProps}
        {...{ 'data-obj-id': dataObjId, 'data-obj-type': dataObjType, style }}
      >
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          {getPageNumbers().map((page, idx) => (
            <PaginationItem key={idx}>
              {page === -1 ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink href="#" isActive={page === currentPage}>
                  {page}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  },
  {
    namespace: 'ui',
    label: 'Pagination',
    inputs: [
      { name: 'currentPage', type: 'number', label: 'Current Page', defaultValue: 1 },
      { name: 'totalPages', type: 'number', label: 'Total Pages', defaultValue: 10 },
      { name: 'className', type: 'string', label: 'CSS Class' }
    ],
    defaultProps: {
      currentPage: 1,
      totalPages: 10
    }
  }
);
