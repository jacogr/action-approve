const github = require('@actions/github');
const core = require('@actions/core');

async function main () {
	const checkAuthors = core.getInput('authors').split(',');
	const checkLabels = core.getInput('labels').split(',');
	const octokit = github.getOctokit(core.getInput('token'));
	const labels = github.context.payload.pull_request.labels.map(({ name }) => name);

	if (
		checkAuthors.some((a) => github.context.payload.pull_request.user.login === a) &&
		checkLabels.some((l) => labels.includes(l))
	) {
		await octokit.rest.pulls.createReview({
			...github.context.repo,
			pull_number: github.context.payload.pull_request.number,
			event: 'APPROVE'
		});
	}
};

main().catch(({ message }) => core.setFailed(message));
