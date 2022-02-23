## action-approve

Approve GithUb actions based on labels and authors. Config -

```
name: Auto-approve pull request

on: pull_request

jobs:
  auto-approve:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - uses: jacogr/action-approve@master
      with:
	    authors: jacogr
	    labels: autoapprove
        token: ${{ secrets.GITHUB_TOKEN }}
```
