import { getServiceName } from './githubUtils';

const res = async () => {
  try {
    const res = await getServiceName();
    console.log(res)
    return res;
  } catch (err) {
    console.error(err);
  }
};
let serviceName = res()
console.log(serviceName);
console.log("finish");
