import { Octokit } from "@octokit/core";

const owner = "azure"
const repo = "azure-rest-api-specs"
const branch = "main"
const github_token = ""

const octokit = new Octokit({
    auth: github_token
})

export const getRef = async () => {
    const res = await octokit.request('GET /repos/{owner}/{repo}/git/ref/{ref}', {
        owner,
        repo,
        ref: `heads/${branch}`
    })
    return res.data.object.sha
}

export const getTree = async (tree_sha: string) => {
    const res = await octokit.request('GET /repos/{owner}/{repo}/git/trees/{tree_sha}', {
        owner,
        repo,
        tree_sha
    })
    return res.data.tree
}

export const getServiceName = async () => {
    const tree_sha_dir = await getRef()
    const tree = await getTree(tree_sha_dir)
    const specificationTree = tree.filter(e => e!.path!.startsWith("specification") && e!.type! === "tree")
    const tree_sha_specification = specificationTree[0] !.sha!
        const serviceNameTree = await getTree(tree_sha_specification)
    const serviceNameList = serviceNameTree.reduce((total: any[], cur) => [...total, cur.path], [])
    return serviceNameList
}
