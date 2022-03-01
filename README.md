## action-approve

Approve GitHub actions based on labels and authors.

Example config -

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

To only run on labelled PRs, the following adjustment to the on logic can be made -

```
on:
  pull_request:
    types: [labeled]
```

Required fields are -

- `authors` - a comma-seperated list of authors this applies to
- `labels` - a comma-seperated list of labels this applies to
- `token` - a secret GitHub token (with applicable repo rights)
