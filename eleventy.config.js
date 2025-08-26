import { govukEleventyPlugin } from "@x-govuk/govuk-eleventy-plugin";

export default function (eleventyConfig) {
  // Register the plugin
  eleventyConfig.addPlugin(govukEleventyPlugin, {
    footer: {
      contentLicence: {
        html: 'Licensed under the <a class="govuk-footer__link" href="https://github.com/x-govuk/govuk-prototype-components/blob/main/LICENSE.txt">MIT Licence</a>, except where otherwise stated',
      },
      copyright: {
        text: "© X-GOVUK",
      },
    },
    header: {
      homepageUrl: "https://x-govuk.github.io",
    },
    icons: {
      mask: "https://raw.githubusercontent.com/x-govuk/logo/main/images/x-govuk-icon-mask.svg?raw=true",
      shortcut:
        "https://raw.githubusercontent.com/x-govuk/logo/main/images/favicon.ico",
      touch:
        "https://raw.githubusercontent.com/x-govuk/logo/main/images/x-govuk-icon-180.png",
    },
    opengraphImageUrl:
      "https://raw.githubusercontent.com/x-govuk/logo/main/images/x-govuk-opengraph-image.png",
    stylesheets: ["/assets/application.css"],
    themeColor: "#2288aa",
    titleSuffix: "X-GOVUK",
    url: process.env.GITHUB_ACTIONS
      ? "https://x-govuk.github.io/govuk-services-frontend-stats/"
      : "/",
  });

  // Passthrough
  eleventyConfig.addPassthroughCopy("./assets");

  // Enable X-GOVUK brand
  eleventyConfig.addNunjucksGlobal("xGovuk", true);

  return {
    dataTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    pathPrefix: process.env.GITHUB_ACTIONS
      ? "/govuk-services-frontend-stats/"
      : "/",
  };
}
