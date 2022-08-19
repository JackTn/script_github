import parseLinkHeader  from 'parse-link-header';
import * as _ from 'lodash';
import { Octokit } from 'octokit';

const octokit = new Octokit({
  auth: `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`,
});

export const dePaginate = (GithubFn:any) => async (params:any) => {
    // default to 100 which is githubs max results per page
    const perPage = (params && params.per_page) || 100;
    // get first page result because it gives number of pages as well
    const firstPageResult = await octokit.request(GithubFn,{
      ...params,
      per_page: perPage,
    });
  
    const parsedLink = parseLinkHeader(firstPageResult.headers.link); // eg https://api.github.com/repositories/39093389/forks?per_page=1000&page=9
    // extract last page number from url
    const lastPageNumber =
      parsedLink && parsedLink.last && Number(parsedLink.last.page);
  
    // if there is no last page or the first page is the last page we don't need
    // to do any more requests
    if (!lastPageNumber || lastPageNumber === 1) {
      return firstPageResult;
    }
    const test = _.range(2, lastPageNumber + 1)
    // request all other pages at the same time
    const restOfPagesResults = await  Promise.all(
        _.range(2, lastPageNumber + 1).map((page:any) =>
        octokit.request(GithubFn, { ...params, per_page: perPage, page })
      )
    );
  
    const resultData = restOfPagesResults.reduce(
      (data:any, result:any) => [...data, ...result.data],
      [...firstPageResult.data]
    );
  
    return {
      ...restOfPagesResults[restOfPagesResults.length - 1],
      ...{ data: resultData },
    };
  };
  