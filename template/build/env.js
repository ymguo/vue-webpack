// Grab NODE_ENV and VUE_APP_* environment variables and prepare them to be
// injected into the application via DefinePlugin in Webpack configuration.
const VUE_APP = /^VUE_APP_/i;
function getClientEnvironment(publicUrl) {
  const raw = Object.keys(process.env)
    .filter(key => VUE_APP.test(key))
    .reduce(
      (env, key) => {
        env[key] = process.env[key];
        return env;
      },
      {
        // Useful for determining whether we’re running in production mode.
        NODE_ENV: process.env.NODE_ENV || 'development',
        // Useful for resolving the correct path to static assets in `public`.
        // For example, <img src={process.env.PUBLIC_URL + '/img/logo.png'} />.
        // This should only be used as an escape hatch. Normally you would put
        // images into the `src` and `import` them in code to get their paths.
        // 一般来说，PUBLIC_URL是cdn服务器的地址
        PUBLIC_URL: publicUrl,
      }
    );
  // Stringify all values so we can feed into Webpack DefinePlugin
  const stringified = {
    'process.env': Object.keys(raw).reduce(
      (env, key) => {
        env[key] = JSON.stringify(raw[key]);
        return env;
      },
      {}
    ),
  };
  return { raw, stringified };
}
module.exports = getClientEnvironment;