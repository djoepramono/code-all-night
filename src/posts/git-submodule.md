---
path: "/posts/git-submodule"
title: "GIT Filter Branch"
date: "2019-10-07"
author: "Djoe Pramono"
---

Ever committed a folder that shouldn't be a GIT? e.g. `node_modules`, `lib`, `vendor`, etc.
For my case with Jekyll, I committed `_posts` folder, which really should be put as `git submodule` instead.
This is my journey in fixing them.

Basically there are two basic concepts in this:

1. Take `_posts` folder out of the current repository
2. Add a git submodule under `_posts`

## --subdirectory-filter

```shell
git filter-branch --subdirectory-filter _posts
```

This deletes all files, except for the filtered directory,
while preserving the history of it. In most cases it should be enough for step 1.

Unfortunately for me the above command doesn't really get what I want which is a clean history containing only my posts commits.
This is because Minimal Mistake's historically committed posts into `_posts` folder, thus the history is kind of noisy.

Next ...

## --tree-filter

```shell
git filter-branch --tree-filter 'rm -rf _posts' --prune-empty HEAD
```

| Breakdown | Explanation |
|-------------------|--------------|
| `--tree-filter`   | rewrite the tree and its content. **Note that** `.gitignore` **doesn't have an effect here** |
| `rm -rf _posts/*` | used in conjuction with `--tree-filter` to basically remove the command |
| `--prune-empty`   | removes empty commits which may be created. *Though, I think this is quite negligible on my case*
| `HEAD`            | this is the `rev-list`. Basically this limits the amount of commits which will be rewritten. *To be honest, I'm still not quite sure regarding this* |

However this changes all of the commits id, which pretty much means it would be hard to
converse with branches which has the same history as the old branch. In this case, I might want to implement future
Minimal Mistake's commit, thus I don't take this approach

Next ...

## git rm and git submodule add

Thus my only option left is by doing an old fashion `git rm`

### 1. Extract the `_posts` data out

```shell
cd <my_jekyll_directory>
cp _posts/* <backup_directory>
```

### 2. Create an empty repository in git

For example: [https://github.com/djoepramono/jekyll-posts](https://github.com/djoepramono/jekyll-posts>) and fill the repository with the content of the backup directory.

**Why? Because in recent git, `git add submodule` would automatically checkout master branch as well**

```shell
cd <backup_directory>
git init
git remote add origin https://github.com/djoepramono/jekyll-posts
git push origin master
```

### 3. Clean up `_posts` data

```shell
cd <my_jekyll_directory>
git rm _posts/*              # Delete posts that is already committed to GIT
rm _posts/*                  # Delete posts that is not yet committed to GIT
```

### 4. Add git submodule

```shell
# Add git submodule which has to be a public repo with https
git submodule add https://github.com/djoepramono/jekyll-posts _posts

# commit the automatically staged files for the git submodules
# i.e. .gitmodules and _posts
git commit -m 'add submodule'
```

This creates  `.gitmodules` when success.

### 5.  [OPTIONAL] Surpress gitsubmodule status

Change the newly created `.gitsubmodules` as follows

```
[submodule "_posts"]
  path = _posts
  url = https://github.com/djoepramono/jekyll-posts
  ignore = dirty
```

Why? Because otherwise when you do `git status` there will always be something like

```shell
$ git status
On branch master
Your branch is up-to-date with 'origin/master'.
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git checkout -- <file>..." to discard changes in working directory)
  (commit or discard the untracked or modified content in submodules)

  modified:   _posts (untracked content)
```

### 6. Last but not least, copy the _posts content back

```shell
cp <backup_directory>/* _posts
```
And voila! It should work, even Sublime Jekyll Plugin is still functioning normally
