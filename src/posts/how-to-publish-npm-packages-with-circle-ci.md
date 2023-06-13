---
path: "/posts/how-to-publish-npm-packages-with-circleci"
title: "How to Publish NPM Package with CircleCI"
date: "2020-01-16"
author: "Djoe Pramono"
tags: ["circleci", "devops", "continuous-integration", "javascript", "typescript"]
---

I had been hearing good things about [CircleCI](https://circleci.com/) for a while and I was itching to give it a try. Coincidentally, I published an NPM package not too long ago called [Falidator](https://www.npmjs.com/package/@codeallnight/falidator), a module to validate TypeScript objects in [a more functional way](https://medium.com/@djoepramono/how-to-validate-javascript-object-better-with-typescript-e43314d97f9c). So I thought, this is it, let's set up CircleCI for it.

So far the experience has been great and their [guide](https://circleci.com/blog/publishing-npm-packages-using-circleci-2-0/) is pretty good. Unfortunately some topics were not covered there, and as I set it up, more and more questions popped up along the way. Thus I decided to write a yet another guide/blog about publishing an NPM package with CircleCI. If you are just interested in seeing the final config, feel free to jump straight to the conclusion.

# 1. Default Sample Config and The First Few Changes

The first few steps are nothing unusual
- Create a CircleCI account
- Authorise CircleCI to access the Github account,
- Go to dashboard.
- Click on `Add new project`,
- Select the NPM package repository,
- Select Node in the dropdown and we will be greeted with a sample barebone config.

```yaml
version: 2
jobs:
  build:
    docker:
      - image: circleci/node:7.10

    working_directory: ~/repo

    steps:
      - checkout

      - restore_cache:
          keys:
            - v1-dependencies-{{ checksum "package.json" }}
            - v1-dependencies-

      - run: yarn install

      - save_cache:
          paths:
            - node_modules
          key: v1-dependencies-{{ checksum "package.json" }}

      - run: yarn test
```

This config needs to be copied to `.circleci/config.yml` and once committed, we can click `Start Building`, but before that let's make some changes first.

The docker image is quite old. Thankfully CircleCI has a wide range of docker images available for us to use. Most of the time, changing the version to the desired value is enough. But to be certain, we can check [here](https://circleci.com/docs/2.0/circleci-images/#nodejs) or [here](https://circleci.com/docs/2.0/docker-image-tags.json) for more complete set.

Leave the `working_directory` as is. This is where the code will be checked out and where the CI process will take place. Since I use `npm` instead of `yarn`, I change the `run` configs to `npm install` and `npm run test` respectively.

# 2. Utilising CircleCI Cache
How about `restore_cache` and `save_cache`? As we know, installing npm modules can take a while, especially if we have tons of them. The idea here is to save the state after we install them and re-use that state in the next run. The cache is stored for up to 30 days. It's good enough especially if we have multiple builds in a day with minimal changes to the dependencies.

## What happen behind saving and restoring cache
Let's talk about the `save_cache` first. The config above basically says, save the state of `node_modules` folder after `npm install` and give it a key based on the checksum of `package.json`. This means if our `package.json` doesn't change the checksum value would stay the same.

During `restore_cache`, CircleCI would try to get the latest cache that match the key(s). In our settings, we are matching against 2 keys: `v1-dependencies-{{ checksum "package.json" }}` and `v1-dependencies-`.
- if none match the first key, the cache will then be matched against the second key.
- if multiple caches are found, the newest one is used, regardless if it's an exact match or partial match.

At first I was not sure if I should match the cache against multiple keys or just one key. I was afraid that the cache would cause more headache and not worth the time saved. But then, I realised `npm install` will be run anyway regardless of the cache. It just means that if the cache is older, it may need to install more modules, whatever the cache doesn't have yet.

## Immutable cache and how npm install works
Cache in CircleCI are immutable. This means if we want to save a new cache we need to give it a different key. So I was wondering if putting the checksum of `package-lock.json` instead of `package.json` is a better idea. Well, let's have a look on how `npm install` works. From what I know in npm version 6.12, these behaviours exists.
- `npm install` install modules based on package.json and *not* package-lock.json
- `npm install` does not install the latest version available but rather it matches the version specified in package.json
- If package.json and package-lock.json are out of sync, during `npm install`, npm will attempt to correct package-lock.json based on package.json
- To check the installed and available versions of node modules, run `npm outdated`
- To update all of our node modules based on our package.json, run `npm update`. If we just want to update one module, run `npm install <module-name>`. Running either of this function will adjust our package.json and package-lock.json if a new version is found.
- Symbols in `package.json` actually have a meaning. `^` means the module can be updated (*not installed*) to the latest minor version that satisfy the [semantic versioning](https://semver.org/). While `~` means the module can be updated to the latest patch version that satisfy the semantic versioning.

Based on these behaviours, it makes more sense to use the checksum of package.json instead of package-lock.json as package.json seems to be **the** source of everything node module. But hey check the npm version that you are using, and make sure you are using the latest node version if possible.

## Busting CircleCI cache
What's the `v1` in the config for? It's actually to bust the cache. Say we want to start fresh without any of the previous cache, we can change the name of cache key from `v1` to `v2` and there we have it, a clean slate as the key won't match.

At one point I was thinking can I put `v1` into environment variable e.g. `CACHE_VERSION`? After all it seems that [it can be configured](https://circleci.com/docs/2.0/configuration-reference/#environment) like so:

```yaml
    environment:
      CACHE_VERSION: 1
    ...
    steps:
      - restore_cache:
          keys:
            # CACHE_VERSION environment variable can only be set in the web UI settings
            - v{{ .CACHE_VERSION }}-dependencies-{{ checksum "package.json" }}
            # fallback match
            - v{{ .CACHE_VERSION }}-dependencies-
      - save_cache:
          paths:
            - node_modules
          key: v{{ .CACHE_VERSION }}-dependencies-{{ checksum "package.json" }}
```

Turns out we cannot do it this way. Once run, the above config returns the following error

```bash
error computing cache key: template: cacheKey:1:4: executing "cacheKey" at <.CACHE_VERSION>:
can't evaluate field CACHE_VERSION in type cache.TemplateValues
```

The job itself runs just fine, but no cache is used. I gave it another try, this time I put set environment variable in the [context](https://circleci.com/docs/2.0/contexts/#creating-and-using-a-context). Alas it's still not working. From [here](https://discuss.circleci.com/t/cannot-use-circle-yml-environment-variables-in-cache-keys/10994), I found out that it's not possible to use environment variable for the cache config. So I gave up and reverted everything to what it was without a variable.

# 3. Jobs and Workflow

## Jobs
All right so far we know what a job is. It's basically a series of steps to be run consecutively by CircleCI e.g. checking out code, testing, linting etc. This is the config that I end up having.

```yaml
jobs:
  test_and_lint:
    <<: *defaults
    steps:
      - checkout
      - restore_cache:
          keys:
            - v1-dependencies-{{ checksum "package.json" }}
            - v1-dependencies- # fallback match
      - run:
          name: Install dependencies
          command: npm install
      - save_cache:
          paths:
            - node_modules
          key: v1-dependencies-{{ checksum "package.json" }}
      - run: npm run test
      - run: npm run lint
      - persist_to_workspace:
          root: ~/repo
          paths: .
  build:
    <<: *defaults
    steps:
      - attach_workspace:
          at: ~/repo
      - run:
          name: Build package
          command: npm run build
      - persist_to_workspace:
          root: ~/repo
          paths: .
  publish:
    <<: *defaults
    steps:
      - attach_workspace:
          at: ~/repo
      - run:
          name: Authenticate with registry
          command: echo "//registry.npmjs.org/:_authToken=$NPM_TOKEN" > ~/repo/.npmrc
      - run:
          name: Publish package
          command: npm publish
```

You might wonder why we don't run `npm run test` and `npm run lint` in one go like so `npm run test & npm run lint`. This is because by splitting them into two separate steps, we could get more output printed in the CircleCi UI.

What is `<<: *defaults`? It's basically a shortcut to repeat configs. For example we need to keep repeating the docker image and working directory for each job. That's why we put it in the `defaults`

```yaml
defaults: &defaults
  working_directory: ~/repo
  docker:
    - image: circleci/node:12.13
```

## Workflows

Workflow is how one or more jobs are laid out to work together. With workflow, you can set the jobs to be executed in certain order, stopped for `approval`, or run only if a certain condition are met. For example, we can set a workflow like below to run `test_and_lint` then run `build` and `publish` only if it's master branch.

```yaml
workflows:
  version: 2
  test:
    jobs:
      - test_and_lint
      - build:
          filters:
            branches:
              only: master
          requires:
            - test_and_lint
      - hold:
          type: approval
          requires:
            - build
      - publish:
          requires:
            - hold
```

This in turn enables branch protection. When I raise a pull request from my branch to master, there will be a CI check running. We can confirm this by going to the Github repository, `Settings` --> `Branches` --> `Branch Protection Rules` --> `Require status checks to pass before merging`

# 4. NPM Token, Tagging and Publishing

## NPM Token

Before we can publish, we need to have an NPM token ready. The token is created in https://www.npmjs.com, we need to
- Create an account and login
- Click on the avatar
- Go to `Auth Token` --> `Create New Token`
- Copy the token into the clipboard
- Go back to Circle CI and pick the correct pipeline
- Go to `Settings` --> `Build Settings` --> `Environment Variables`
- Create a new  environment variable `NPM_TOKEN` and paste the token in

By now you probably have noticed that in the previous topic, we have a step like so

```yaml
        - run:
          name: Authenticate with registry
          command: echo "//registry.npmjs.org/:_authToken=$NPM_TOKEN" > ~/repo/.npmrc
```

That's basically adding the token to the home directory, a requirement before we can run `npm publish`. It baffles me as using environment variables is fine here but not when setting up cache keys.

## Tagging

Another requirement before we can run `npm publish` is that we need to version the package. The version needs to be incremented each time as well. This is tricky because it can be patch, minor, or major version. I was hoping that I could enter the new version during the `approval` step, but alas I don't think it's possible. Thus I decided that the versioning shall happen locally on my dev machine and I'll push the tag up to GitHub and the workflow will pick up from there

So locally on my dev machine

```bash
npm version patch -m "bump to 0.0.7"
git push origin <new_tag>
```

Meanwhile on the CircleCI, these needs to be setup

```yaml
workflows:
  version: 2
  generic:
    jobs:
      - test_and_lint: # implicitly all jobs always run on branches, unless filtered.
          filters:
            tags: # required since `build` has tag filters AND requires `test_and_lint`.
              only: /^v.*/
      - build:
          filters:
            # required since `publish` has tag filters AND requires `build`
            tags:
              only: /^v.*/
            # required since we don't want to build on branches, just tags
            branches:
              ignore: /.*/
          requires:
            - test_and_lint
      - publish:
          filters:
            tags:
              only: /^v.*/
            branches:
              ignore: /.*/
          requires:
            - build
```

What's with all of these filters? These are needed because these fundamental behaviours in CircleCI
- By default, jobs are running on all branches.
- By default, jobs are **not** running on all tags.

Sounds simple, but combined with the execution order config, we end up with a rather nasty set of filters.

Alternatively, since CircleCI allows us to have more than one workflow, we can set it up like below. We just need to make sure that only one workflow runs at any given time.

```yaml
workflows:
  version: 2
  on_branch:
    jobs:
      - test_and_lint
  on_tags:
    jobs:
      - test_and_lint:
          filters:
            tags:
              only: /^v.*/
            branches:
              ignore: /.*/
      - build:
          filters:
            tags:
              only: /^v.*/
          requires:
            - test_and_lint
      - publish:
          filters:
            tags:
              only: /^v.*/
          requires:
            - build

```

Unfortunately as you can see, we still cannot get away from the filters due to how CircleCI works with tags. So which one is better? I slightly prefer the latter, but honestly I don't really like either of them. If any of you have a better solution, please let me know. For more reading, you can refer to [here](https://circleci.com/docs/2.0/workflows/#executing-workflows-for-a-git-tag)

# 5. Conclusion

That concludes my experience publishing an NPM package with CircleCI. Some pros:
- Easy to setup and decent initial config
- Plenty of documentations
- Everything is configured through the config file with minimal web UI interaction

But of course there are some things that could be improved
- Inconsistent experience dealing with environment variables in `command`, `cache`, and `context`
- Workflows can be streamlined better. `tags` and `branches` can be made to use similar config pattern
- When you login to their website, you randomly get the new or old UI. There's a menu to go back to old UI from new UI. But unfortunately there's no way to go from old UI to new UI.

Overall CircleCI is a pretty good. The downsides are there, but they are not critical. CircleCI is easy to use and perfect for a small open source project like mine. If you'd like to see the full config, it's available in the GitHub [repo](https://github.com/wecodeallnight/falidator/blob/master/.circleci/config.yml). And that's it, thank you for reading and feedbacks are welcomed :)