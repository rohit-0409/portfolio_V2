# regi portfolio

A responsive, one-page Roblox developer portfolio. It is plain HTML, CSS, and JavaScript, so there is no package install or build step.

## Personalize the site

Most edits go in portfolio-data.js:

1. Update the name, intro, years, about text, skills, and contact links in profile.
2. Add each game to the projects array. Add screenshots to assets/ and point the image field to the file.
3. Add a video to the videos array with its title, description, and YouTube URL or video ID.
4. Edit the systems array to match the work you offer.
5. Add real client quotes to reviews. The Reviews section appears automatically when at least one review is added.

Save and push your changes to the main branch. GitHub Actions will publish the site. The deployment setup is in .github/workflows/pages.yml.

## Project fields

Each project can include title, category, description, visits, favourites, image, imageAlt, gameUrl, videoUrl, accent, and tags. The image is optional; without one, the site creates a graphic placeholder. Use an accent of blue, violet, or orange.

Each review can include quote, name, and project.

Each video can include title, description, and youtubeUrl. Paste a YouTube watch link, short link, Shorts link, embed link, or 11-character video ID.

## Files

- portfolio-data.js — editable portfolio content.
- index.html — section structure and navigation.
- styles.css — theme, layout, and responsive styles.
- site.js — renders the content and handles mobile navigation.
- .github/workflows/pages.yml — deploys the root of the repository to GitHub Pages.

