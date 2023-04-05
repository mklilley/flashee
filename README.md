# [Flashee](https://flashee.lilley.io/) - The free and simple flash card app

<a href="https://flashee.lilley.io/" target="_blank"><img src="https://flashee.lilley.io/img/logo.441e7873.svg"></a>

<a href="https://www.buymeacoffee.com/mklilley" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" height = "60" ></a>

## The story

I built a basic version of Flashee in the Christmas holidays of 2018. The idea was to help me remember physics facts. Since then, I've enjoyed using it every day as part of my casual physics morning routine 🤓 . I thought other people might also find it useful so I decided to clean it up and make it available to everyone for free.

## How I made Flashee

I originally built Flashee using [Vue.js version 2](https://v2.vuejs.org/) and you can check out how I did that by going to the [vue2 branch](https://github.com/mklilley/flashee/tree/vue2) of this repository.

In early 2023, I decided to rebuild the app using React. I'd recently finished teaching at a coding bootcamp and wanted to consolidate my React knowledge into a real project.

### Front end

> TODO

### Back end

The app doesn't require a backend to function - the flash card data is stored on the devices [localStorage](https://blog.logrocket.com/the-complete-guide-to-using-localstorage-in-javascript-apps-ba44edb53a36/). I did, however, create an online storage option in case the localStorage gets wiped (this can sometimes happen on mobile devices). I am using an an open-source json storage system ([jsonbox](https://jsonbox.io/)) for the online storage. I [slightly adapted it](https://github.com/mklilley/jsonbox/) and deployed it on my server using the [instructions](https://github.com/mklilley/jsonbox#how-to-run-locally) that jsonbox provides.

I use [Formspree](https://formspree.io/) to process the feedback form and route responses to my personal email address.

## Making Flashee better

I'd love it if we could make Flashee better together. Please feel free to [create an issue](https://github.com/mklilley/flashee/issues) to make suggestions. If you enjoy playing with code then you can also go ahead and create a local version on your computer. Here is how to do this:

## Disclaimer

I code for fun in my spare time so this is not a professional app/service. Please don't use this app to store sensitive information - it's not been stress tested for data security bugs. Data lives on your device and you can export it to a text file at any time. There is also an online storage option. There is no backup of the online storage - so if your data is lost due to some technical issues then it is lost forever. I'll do my best to keep the app/service running indefinitely, but if it starts getting abused then I might have to shut it down.