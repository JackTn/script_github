import { Octokit } from '@octokit/core';
import { dePaginate } from './utils';

const owner = 'test-repo-billy';
const repo = 'azure-rest-api-specs';
const branch = 'main';
const path = 'specification/common-types';
const github_token = '';

const octokit = new Octokit({
  auth: github_token,
});

export const getRef = async () => {
  const res = await octokit.request('GET /repos/{owner}/{repo}/git/ref/{ref}', {
    owner,
    repo,
    ref: `heads/${branch}`,
  });
  return res.data.object.sha;
};

export const getTree = async (tree_sha: string) => {
  const res = await octokit.request(
    'GET /repos/{owner}/{repo}/git/trees/{tree_sha}',
    {
      owner,
      repo,
      tree_sha,
    }
  );
  return res.data.tree;
};

export const ListBranches = async () => {
  const depaginatedFunction = dePaginate('GET /repos/{owner}/{repo}/branches');
  const { data } = await depaginatedFunction({
    owner,
    repo,
  });
  console.log(data.length);
  return data;
};

export const ListPullRequests = async () => {
  const depaginatedFunction = dePaginate('GET /repos/{owner}/{repo}/pulls');
  const { data } = await depaginatedFunction({
    owner,
    repo,
  });
  console.log(data.length);
  return data;
};

export const getBranch = async () => {
  const { data } = await octokit.request(
    'GET /repos/{owner}/{repo}/branches/{branch}',
    {
      owner,
      repo,
      branch,
    }
  );
  console.log(data);
  return data;
};

export const getServiceName = async () => {
  const tree_sha_dir = await getRef();
  const tree = await getTree(tree_sha_dir);
  const specificationTree = tree.filter(
    (e) => e!.path!.startsWith('specification') && e!.type! === 'tree'
  );
  const tree_sha_specification = specificationTree[0]!.sha!;
  const serviceNameTree = await getTree(tree_sha_specification);
  const serviceNameList = serviceNameTree.reduce(
    (total: any[], cur) => [...total, cur.path],
    []
  );
  return serviceNameList;
};

// content
export const getRepoContent = async () => {
    const { data } = await octokit.request(
      'GET /repos/{owner}/{repo}/contents/{path}',
      {
        owner,
        repo,
        path: 'package.json',
        ref: `heads/${branch}`,
      }
    );
    console.log(data);
    return data;
};