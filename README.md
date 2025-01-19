# [Flashee](https://flashee.lilley.io/) - The free and simple flash card app

<a href="https://flashee.lilley.io/" target="_blank"><img src="https://flashee.lilley.io/assets/logo-98b8a6c9.svg"></a>

<a href="https://www.buymeacoffee.com/mklilley" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" height = "60" ></a>

## The story

I built a basic version of Flashee in the Christmas holidays of 2018. The idea was to help me remember physics facts. Since then, I've enjoyed using it every day as part of my casual physics morning routine 🤓 . I thought other people might also find it useful so I decided to clean it up and make it available to everyone for free.

## How I made Flashee

I originally built Flashee using [Vue.js version 2](https://v2.vuejs.org/) and you can check out how I did that by going to the [vue2 branch](https://github.com/mklilley/flashee/tree/vue2) of this repository.

In early 2023, I decided to rebuild the app using React. I'd recently finished teaching at a coding bootcamp and wanted to consolidate my React knowledge into a real project.

The refactoring was very start stop (mostly stop), so it took me almost 2 years to finish the job 😅! Although it took a long time, I'm very happy it did it; updates are going to be MUCH easier than the Vue version that had everything in one file 😱.

### Front end

The Flashee front end is built with [React 18](https://react.dev/blog/2022/03/29/react-v18). For global state management, I used [Recoil](https://recoiljs.org/). I used [Vite 4](https://vite.dev/blog/announcing-vite4) as the build tool.

The most notable change to the app functionality from the Vue days is the addition of the [MathLive](https://cortexjs.io/mathlive/) keyboard to make it MUCH easier to create equations (previously you had to manaully type the LaTeX 😫).

To make the app into a [Progressive Web App (PWA)](https://web.dev/progressive-web-apps/) I used the [PWA Vite Plugin](https://vite-pwa-org.netlify.app/). I used the default options for this plugin meant:
- I didn't have to write any service worker code myself
- When I make updates to the app, the user will be prompted to reload the app

The prompting is handled via a `ReloadPrompt` component that I created mostly by copying the example from the [Prompt for update](https://vite-pwa-org.netlify.app/frameworks/react.html#prompt-for-update) section of the plugin website.

Because I'd generated the PWA icons when making the Vue version of the app, I didn't need to use an asset generator. However, if I was starting from scratch, I would have have used the [assets generator from the PWA Vite Plugin](https://vite-pwa-org.netlify.app/assets-generator/).

[By default](https://vite-pwa-org.netlify.app/guide/static-assets.html#static-assets-handling), only the icons specified in the manifest option in `vite.config.js` are included in the PWA precache. I needed to add `includeAssets:['assets/**/*']` to include all files within the `/pulic/assets` directory.


### Back end

The app doesn't require a backend to function - the flash card data is stored on the devices [localStorage](https://blog.logrocket.com/the-complete-guide-to-using-localstorage-in-javascript-apps-ba44edb53a36/). I did, however, create an online storage option in case the localStorage gets wiped (this can sometimes happen on mobile devices). I am using an an open-source json storage system ([jsonbox](https://jsonbox.io/)) for the online storage. I [adapted it](https://github.com/mklilley/jsonbox/) and deployed it on my server using the [instructions](https://github.com/mklilley/jsonbox#how-to-run-locally) that jsonbox provides.

I use [Formspree](https://formspree.io/) to process the feedback form and route responses to my personal email address.

## Making Flashee better

I'd love it if we could make Flashee better together. Please feel free to [create an issue](https://github.com/mklilley/flashee/issues) to make suggestions. If you enjoy playing with code then you can also go ahead and create a local version on your computer. Here is how to do this:

## Disclaimer

I code for fun in my spare time so this is not a professional app/service. Please don't use this app to store sensitive information - it's not been stress tested for data security bugs. Data lives on your device and you can export it to a text file at any time. There is also an online storage option. There is no backup of the online storage - so if your data is lost due to some technical issues then it is lost forever. I'll do my best to keep the app/service running indefinitely, but if it starts getting abused then I might have to shut it down.
