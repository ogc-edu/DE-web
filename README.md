# Differential Evolution Research Dashboard

A React single-page application to configure, run, and visualize the performance of Differential
Evolution (DE) algorithm variants across benchmark fitness functions.

## Features

1. **Simulation** — configure and submit DE runs (benchmark functions × mutation schemes ×
   crossover operators × selection methods) for cloud computation on AWS EC2, with live progress.
2. **Data visualization** — compare model performance against benchmark functions in charts
   (line/bar) and browse simulation history/results.
3. **Data import** — upload existing result data via a `.txt` format instead of running a live
   simulation.
4. **Profile & account management** — view/update profile, change password, upload an avatar.
5. **Admin oversight** (admin role only) — user management, queue status, all simulations.
6. **Author portfolio page** — a page for the project author.

## DE Models Compared

The dashboard compares up to 80 different Differential Evolution models by combining 10 mutation
schemes, 4 crossover operators, and 2 selection methods, across 10 benchmark fitness functions.

## Installation

1. **Clone the repository** and install dependencies:

   ```bash
   git clone <this-repo-url>
   cd DE-dashboard-frontend
   npm install
   ```

2. **Configure the backend URL** — copy `.env.example` to `.env` and set `REACT_APP_API_URL`
   (or the `REACT_APP_BACKEND_PROTOCOL`/`_HOST`/`_PORT` pieces), pointing at a running instance of
   the [`DE-website-backend`](../DE-website-backend) API. Every page except login/register needs
   the backend running to do anything useful.

3. **Start the development server**:

   ```bash
   npm start   # http://localhost:3001
   ```

## Technologies Used

- **React** (Create React App) — frontend framework
- **React Router** — client-side routing
- **Chart.js** — data visualization
- **Tailwind CSS + shadcn/ui (Radix)** — styling and UI primitives
- **axios** — HTTP client
- **AWS** — the backend/worker this app talks to run on AWS (SQS, DynamoDB, S3, EC2)

See `CLAUDE.md` and `docs/ARCHITECTURE.md` for the full architecture, routing conventions, and
state-management details.
