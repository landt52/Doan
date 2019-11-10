import React from 'react'

export default function Pagination(props) {
    const pageNumbers = [];

    for(let i = 1; i <= Math.ceil(props.totalItems / props.itemsPerPage); i++){
        pageNumbers.push(i);
    }
    
    return (
      <nav className='mt-5'>
        <ul className='pagination justify-content-center'>
          {pageNumbers.map(number => (
            <li key={number} className={['page-item', props.currentPage === number ? 'active' : ''].join(' ')}>
              <a
                href='!#'
                className='page-link'
                onClick={e => {
                  e.preventDefault();
                  props.paginate(number);
                }}
              >
                {number}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    );
}
