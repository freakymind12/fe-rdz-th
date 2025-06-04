# 🖥 RDZ-TH Frontend

Frontend dashboard **IoT Project RDZ-TH Web Apps** for device control and reporting temperature and humidity. This project created using [**NodeJS**](https://nodejs.org/en) , [**Vue 3**](https://vuejs.org/), [**Pinia**](https://pinia.vuejs.org/), [**Ant Design Vue**](https://antdv.com/)

---

## Features

- 📧 **Report** : Table based view for report RDZ-TH device data
- 📄 **PDF Download** : Report table download with `.pdf` extension for report RDZ-TH device
- 📶 **Realtime Monitoring** : Realtime Dashboard Monitoring for RDZ-TH device
- ⚙ **Master Data** : Manage RDZ-TH device data for grouping and assign PIC (for receiver daily reporting by email)

## Project Structure

```bash
fe-rdz-th
┣ .vscode
┃  ┗ extensions.json
┣ public
┃  ┗ favicon.ico
┣ src
┃ ┣ assets                  # asset folder for image or global styling
┃ ┣ axios                   # axios config
┃ ┣ components              # global components
┃ ┣ composable              # composable function
┃ ┣ layout                  # layout views
┃ ┣ router                  # routing address for app
┃ ┣ stores                  # store management
┃ ┣ views                   # component views
┃ ┃ ┣ dashboard              # dashboard views
┃ ┃ ┣ master                 # master views
┃ ┃ ┣ pages                  # pages views
┃ ┃ ┗ report                 # report views
┃ ┣ App.vue                 # root component app
┗ ┗ main.js                 # entry point to start a Vue application
```

---

## Getting Started

### Clone Repository

```bash
git clone https://github.com/HRSID-Development/fe-rdz-th.git
cd fe-rdz-th
```

### Install dependencies

```bash
npm install
```

### Setup Environtment Variable

See `.env.example` for template making your environtment variable on file `.env`

### Compile and Hot-Reload for Development

```bash
npm run dev
```

### Compile and Minify for Production and Preview

```bash
npm run build
npm run preview
```

### Run with docker-compose

```bash
docker compose up -d
```

---

## Requirements

- NodeJS v20 or latest

## Authors

- [@riankurniawan](https://github.com/freakymind12)
