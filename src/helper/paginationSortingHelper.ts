type Ioptions = {
    limit?: string ,
    page?: string,
    sortBy?:string,
    orderBy?:string
}

const paginationSortingHelpers = (options:Ioptions)=>{
      console.log(options);
          
    const limit = Number(options.limit ?? 10);
    const page = Number(options.page ?? 1)
    
    const sortBy = options.sortBy as string;
    const orderBy =  options.orderBy as string;

    const skip = (page-1) * limit;

    return {
        limit,
        skip,
        sortBy,
        orderBy,
        page
    }
}
export default paginationSortingHelpers