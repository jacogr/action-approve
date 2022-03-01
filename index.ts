// SPDX-License-Identifier: Apache-2.0

import type { components } from '@octokit/openapi-types';

import { context, getOctokit } from '@actions/github';
import { getInput, setFailed } from '@actions/core';

type PR = components['schemas']['pull-request-simple'];

// check that the context is indeed for a PR
function isPR (pr: unknown): pr is PR {
	return !!pr;
}

// split a variable into parts and trim along the way
function getInputs (type: 'authors' | 'labels'): string[] {
	return getInput(type)
		.split(',')
		.map((s) => s.trim());
}

async function main () {
	// bail if we are not called as part of a PR
	const pr = context.payload.pull_request;

	if (!isPR(pr)) {
		throw new Error('action needs to be run as part of a pull request');
	}

	// get the variables defined in the action
	const authors = getInputs('authors');
	const labels = getInputs('labels');

	if (
		// one of the authors needs to be the PR author
		pr.user && authors.includes(pr.user.login) &&
		// one of the labels needs to match the defined labels
		pr.labels.some(({ name }) => labels.includes(name || ''))
	) {
		// approve (we may want to leave comments in the future as well)
		await getOctokit(getInput('token')).rest.pulls.createReview({
			...context.repo,
			pull_number: pr.number,
			event: 'APPROVE'
		});
	}
};

main().catch(({ message }) => setFailed(message));
