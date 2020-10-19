# mobius-bom-app

This project is a simple BOM (Bill of materials) application where users can:
* view a BOM list
* update items of the BOM

The application is live at:

#### https://mobius-bom-app.herokuapp.com

You should see something like this:

<kbd>
  <img src="/images/bom-app-screenshot.png" alt-text="Screenshot of the BOM app" width=600>
</kbd>

Tech:
* React for the frontend UI
* Mirage JS for the mock API

Note: the project uses a mock API which loads the initial data from a JSON file, then uses session storage to persist state. This means that data will persist between page reloads but will be reset when opening the application in a new browser tab.

### Running the development server
To run the application in your local environment, clone the repo and install dependencies:

```
npm install
```

Then, start the local development server:
```
npm start
```
