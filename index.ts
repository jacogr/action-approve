// SPDX-License-Identifier: Apache-2.0

import { context, getOctokit } from '@actions/github';
import { getInput, setFailed } from '@actions/core';

type Context = typeof context;

interface Label {
	name: string;
}

interface User {
	login: string;
}

// extend the context with the known PR fields
// (that we are using)
type ContextWithPR = Context & {
	payload: {
		pull_request: {
			labels: Label[];
			user: User;
		}
	}
}

// check that the context is indeed for a PR
function hasPR (context: Context): context is ContextWithPR {
	return !!context.payload.pull_request;
}

async function main () {
	// get the variable defined in the action
	const checkAuthors = getInput('authors').split(',');
	const checkLabels = getInput('labels').split(',');
	const octokit = getOctokit(getInput('token'));

	// bail if we are not called as part of a PR
	if (!hasPR(context)) {
		throw new Error('action needs to be run as part of a pull request');
	}

	// extract label names, they would be easier to map on below
	const labels = context.payload.pull_request.labels.map(({ name }) => name);

	if (
		// one of the authors needs to be the PR author
		checkAuthors.includes(context.payload.pull_request.user.login) &&
		// one of the labels needs to match the defined labels
		checkLabels.some((l) => labels.includes(l))
	) {
		// approve (we may want to leave comments in the future as well)
		await octokit.rest.pulls.createReview({
			...context.repo,
			pull_number: context.payload.pull_request.number,
			event: 'APPROVE'
		});
	}
};

main().catch(({ message }) => setFailed(message));
