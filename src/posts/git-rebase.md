---
path: "/posts/git-rebase"
title: "GIT Rebase"
date: "2016-09-07"
author: "Djoe Pramono"
---

In order to rewrite history you need to use `git rebase -i <commit_id>`.

This is useful for the following scenario
- deleting useless commit log
- putting your commits on top of other branch (e.g. if someone else updated `master`
while you are working on your branch), so that it is more readable
- undoing certain commits (even those in the past)

### Note

- This essentially will replay the commits in order, so if you want you can change the order of the commits.
- `<commit_id>`here means the starting commit for the rebase. You can also do `HEAD~n` where n is a number
- Please note that you cannot `squash`,`fixup`, or `drop` without previous commit

In case of error (can't be rebased), you can always do `git rebase --abort`

[This](https://git-scm.com/book/en/v1/Git-Tools-Rewriting-History) is the best (and up-to-date) guide so far.

If you rebase/rewrite the history you might need to put `--force` to push to your remote

Lastly, please **DO NOT** rebase public branch (e.g. `master`)

On the other hand if you need to pull a rebased upstream repository, this is a good shortcut

```shell
$ git fetch upstream master
$ git merge --keep upstream/master
```

# Revert

If you don't want to lose the history, instead you can do `git revert --no-commit <commit_id_1> <commit_id_2>`

This is followed by `git revert --continue`. This will revert certain commit just fine and on top of that it add another commit for the revert itself

Or if you want to abort then `git revert --abort`