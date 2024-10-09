# MyNetworkApp

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.0.7.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Local Azure development

### Installation

- `npm install -g @azure/static-web-apps-cli`
- `npm install -g azure-functions-core-tools`

### Run

Emulate locally Azure Static Web Apps use `npm run emulate` or `swa start http://localhost:4200 --api-location ./api`

To only run Azure function go to the `/api` folder and run `func start`

### Create Azure Function

- `func init api --worker-runtime node`
- `func new --name my_api --template "HTTP trigger"`
