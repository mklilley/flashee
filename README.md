# [Flashee](https://flashee.lilley.io/) - The free and simple flash card app

<a href="https://flashee.lilley.io/" target="_blank"><img src="https://flashee.lilley.io/img/logo.441e7873.svg"></a>

<a href="https://www.buymeacoffee.com/mklilley" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" height = "60" ></a>

## The story

I built a basic version of Flashee in the Christmas holidays of 2018. The idea was to help me remember physics facts. Since then, I've enjoyed using it every day as part of my casual physics morning routine 🤓 . I thought other people might also find it useful so I decided to clean it up and make it available to everyone for free.

## How I made Flashee

Here is a rough guide to how I got here.

### Front end

The Flashee front end is built using [Vue.js version 2](https://vuejs.org/v2/guide/). I used the [Vue CLI version 4.4.6](https://cli.vuejs.org/) to create the project:

- `npm install -g @vue/cli`
- `vue create flashee`

Then, only at the end, did I decided I wanted to turn the app into a [Progressive Web App (PWA)](https://web.dev/progressive-web-apps/):

- `vue add pwa`

I consulted the [Vue PWA documentation](https://cli.vuejs.org/core-plugins/pwa.html#configuration) to help me with the config and used the [Vue PWA asset generator](https://github.com/jcalixte/vue-pwa-asset-generator) to generate all the necessary icons.

I used [vue-katex](https://github.com/lucpotage/vue-katex) for equation rendering and I used [vue-recaptcha](https://github.com/DanSnow/vue-recaptcha) to protect my feedback form from spam.

### Back end

The app doesn't require a backend to function - the flash card data is stored on the devices [localStorage](https://blog.logrocket.com/the-complete-guide-to-using-localstorage-in-javascript-apps-ba44edb53a36/). I did, however, create an online storage option in case the localStorage gets wiped (this can sometimes happen on mobile devices). I am using an an open-source json storage system ([jsonbox](https://jsonbox.io/)) for the online storage. I [slightly adapted it](https://github.com/mklilley/jsonbox/) and deployed it on my server using the [instructions](https://github.com/mklilley/jsonbox#how-to-run-locally) that jsonbox provides.

I use [Formspree](https://formspree.io/) to process the feedback form and route responses to my personal email address.

## Making Flashee better

I'd love it if we could make Flashee better together. Please feel free to [create an issue](https://github.com/mklilley/flashee/issues) to make suggestions. If you enjoy playing with code then you can also go ahead and create a local version on your computer. Here is how to do this:

### Front end

- Fork this repo
- Clone your version of this repo
- Run `npm install`
- Run `npm run serve` - this runs a local copy of Flashee that updates live when it detects any code changes you make.
- Change files inside of the `src` folder
  - `App.vue` is (rightly or wrongly) where almost of the action happens - i.e. the content, styles and app logic.
  - `services/storage.js` handles data storage locally and calls `services/jsonbox.js` for remote storage.
  - `services/jsonbox.js` contains jsonbox specific code. To use a different jsonbox provider, change variables `API_BASE` and `API_BASE_META`.
- Commit your changes
- Push your changes
- Make a pull request to merge the changes back into my repo

### Back end

You don't need to create your own backend if you just want to tweak the look and feel of the app. If you want to go a bit deeper then you can create your own jsonbox. You have two options

- Use the [original jsonbox](https://github.com/vasanthv/jsonbox)
- Use [my fork of jsonbox](https://github.com/mklilley/jsonbox)

I made [some small changes](https://github.com/vasanthv/jsonbox/compare/master...mklilley:master) to the original jsonbox whose purpose is mainly to make the data less ephemeral.

Details of how to set up a jsonbox can be found in the respective repositories.

## Disclaimer

I code for fun in my spare time so this is not a professional app/service. Please don't use this app to store sensitive information - it's not been stress tested for data security bugs. Data lives on your device and you can export it to a text file at any time. There is also a cloud storage option. There is no backup of the online storage - so if your data is lost due to some technical issues then it is lost forever. I'll do my best to keep the app/service running indefinitely, but if it starts getting abused then I might have to shut it down.
