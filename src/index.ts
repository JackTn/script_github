import { getRepoContent } from './githubUtils';

const res = async () => {
  try {
    const res = await getRepoContent();
    return res;
  } catch (err) {
    console.error(err);
  }
};
res();
console.log("finish");
