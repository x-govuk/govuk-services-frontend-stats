const govukEleventyPlugin = require('@x-govuk/govuk-eleventy-plugin')

module.exports = function(eleventyConfig) {

  // Register the plugin
  eleventyConfig.addPlugin(govukEleventyPlugin, {
    brandColour: '#28a',
    fontFamily: 'system-ui, sans-serif',
    icons: {
      mask: 'https://raw.githubusercontent.com/x-govuk/logo/main/images/x-govuk-mask-icon.svg?raw=true',
      shortcut: 'https://raw.githubusercontent.com/x-govuk/logo/main/images/x-govuk-favicon.ico',
      touch: 'https://raw.githubusercontent.com/x-govuk/logo/main/images/x-govuk-apple-touch-icon.png'
    },
    url: process.env.GITHUB_ACTIONS
      ? 'https://x-govuk.github.io/govuk-rspec-helpers/'
      : '/',
    header: {
      organisationLogo: 'x-govuk',
      organisationName: 'X-GOVUK'
    },
    footer: {
      contentLicence: {
        html: 'Licensed under the <a class="govuk-footer__link" href="https://github.com/x-govuk/govuk-prototype-components/blob/main/LICENSE.txt">MIT Licence</a>, except where otherwise stated'
      },
      copyright: {
        text: '© X-GOVUK'
      }
    }
  })

  // Passthrough
  eleventyConfig.addPassthroughCopy('./assets')

  return {
    dataTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
    markdownTemplateEngine: 'njk',
    dir: {
      // Use layouts from the plugin
      layouts: 'node_modules/@x-govuk/govuk-eleventy-plugin/layouts'
    },
    pathPrefix: process.env.GITHUB_ACTIONS
      ? '/govuk-services-frontend-stats/'
      : '/'
  }
};
