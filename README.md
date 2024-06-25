# osumon! 
Pokemon-ify your osu! account. 
This is just a demo project to show how you can make your website suck, and then how to fix it :D

# Todo
- Confirm Sentry is all good and working
- Make the codebase slow
- Have people use it
- Fix UI to enable sharing and make the cards have more styles


## Calls I'm making
- One to get token
- One to get user Id from username
  - Could make a call for plays, name, rank, one for each part of the profile (as I did in my discord bot)
  - Doesn't really make sense to call each play one by one that's just dumb

- Lets say we need some specific information about the map that is not available in the play


## Collecting Sentry Data
- Maybe when I serve the website, I have a +server.ts on the main page that will randomly redirect to one of the routes