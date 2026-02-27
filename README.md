# MatchaMoji 🍵

This is one of my project games for **Web Scripting 1 in BCIT**, where I'm learning how to use **JavaScript** and **SCSS** together to build interactive web applications.

## About the Game

MatchaMoji is a fun, matcha-themed memory matching game!

- Flip the cards to find matching pairs before the timer runs out.
- Test your memory and speed with multiple difficulty levels (Chill, Easy, Medium, Hard, and WTH).
- Compete for the highest score, which is calculated based on your accuracy, time left, and chosen difficulty multiplier.

## How to Install & Play

Since this is a client-side web application built with HTML, CSS (compiled from SCSS), and JavaScript, no complex installation or server setup is required.

### 1. Download the Game

Clone the repository or download the project files as a ZIP archive and extract them to your local computer.

### 2. Run the Game

Navigate to the extracted project folder and simply double-click the `index.html` file. It will automatically open and run in your default web browser (such as Google Chrome, Firefox, Safari, or Edge).

### Optional: For Developers (Editing SCSS)

If you want to modify the styling and explore the SCSS code:

1. Open the project folder in a code editor like [Visual Studio Code (VS Code)](https://code.visualstudio.com/).
2. Install the **Live Server** extension to serve the files locally.
3. Install the **Live Sass Compiler** extension to compile any changes you make in the `.scss` files into the `styles/styles.css` output directory automatically.

Enjoy flipping the cards! 🍵

## Deployment (Hosting on SiteGround)

Since this game consists entirely of static files (HTML, CSS, JavaScript, and assets), it is very easy to host it on any web server, including **SiteGround**.

### Steps to Deploy on SiteGround:

1. **Prepare your files**: Ensure you have compiled your SCSS into CSS (so the `styles/styles.css` file is up-to-date) and gather all your project files including `index.html`, the `scripts` folder, the `styles` folder, and the `assets` folder.
2. **Log into SiteGround**: Go to your SiteGround Client Area and navigate to **Site Tools** for the website where you want to host the game.
3. **Open File Manager**: Go to **Site > File Manager**.
4. **Navigate to the public folder**: Open the `public_html` directory (or a specific subfolder inside it if you don't want it on your main homepage, e.g., `public_html/matchamoji`).
5. **Upload the files**: Click the **File Upload** or **Folder Upload** button in the File Manager and upload all of your game's files directly into the chosen folder.
6. **Play the game online**: Visit your domain in the browser (e.g., `https://yourdomain.com/matchamoji`) and the game should load instantly!
