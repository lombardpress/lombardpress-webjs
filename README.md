
[![Netlify Status](https://api.netlify.com/api/v1/badges/49e1db43-023e-450f-b982-5fd24886d4b0/deploy-status)](https://app.netlify.com/sites/reverent-noyce-f13753/deploys)

[![Build Status](https://travis-ci.com/lombardpress/lombardpress-webjs.svg?branch=master)](https://travis-ci.com/lombardpress/lombardpress-webjs)

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

# Developer Notes

This app was initially generated with create react app. (CRA). CRA indicates node-sass as a dependency, but node-sass is depreciated and it seems like the library to use is dart-sass, which seems to be install with simply sass. 

Following this suggestion https://stackoverflow.com/a/64012493/731085 there seems to be a way to create an alias, so that CRA can still refer to node-sass, while really using dart-sass.

The alias can be created as follows: 

`yarn add node-sass@yarn:sass` 

If there is a way to change the configuration and just use sass directly, one likely just needs to delete the node_modules folder and the yarn.lock file and upgrade the CRA related scripts, which would presumably have updated there dependency to sass (dart-sass)