#### Guide ####
## Yarn https://classic.yarnpkg.com/en/docs/creating-a-project
* Run `yarn help COMMAND` for more information on specific commands - https://yarnpkg.com/en/docs/cli/
``yarn init`` Create new package.json - https://classic.yarnpkg.com/en/docs/cli/init/#toc-yarn-init
``yarn global add sass postcss-cli browser-sync`` -2020/2/26 https://classic.yarnpkg.com/en/docs/cli/add

0. ``yarn install`` Install all packages from package.json
---------------------------
```gulp vendors``` Output tailwind css, copy vendors files to src & dist, inject css & js to html
```gulp watch```
1. Just run: ```yarn start``` or  ```gulp start``` It means to run  ```gulp vendors``` then ```gulp watch```
2. Finally just run: ```yarn build``` It means to run ```gulp build```