# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

## Docker Compose database

Compose uses the local MongoDB container by default. To use MongoDB Atlas, create a
root-level `.env` file containing the Atlas connection string:

```env
DATABASE_URL=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/blog
JWT_SECRET=<random-secret>
```

Generate the signing secret with `openssl rand -hex 32` and keep it private.

In Atlas, allow connections from the Codespaces environment's outbound IP in
Network Access, then restart the backend:

```sh
docker compose up -d --force-recreate blog-backend
```

Do not commit the `.env` file.

For the GitHub Actions deployment, add `JWT_SECRET` as a secret to the
`production` GitHub Actions environment. The backend deployment reads this
secret to sign login tokens. Configure `DATABASE_URL` on the `blog-backend`
Cloud Run service as well; the deployment preserves existing Cloud Run
environment variables.

The deployment makes both Cloud Run services publicly invokable because the
browser calls the backend directly. The backend still applies its application
authentication where required. The deployment identity must be allowed to
disable the Cloud Run Invoker IAM check. Grant the identity used by
`GOOGLECLOUD_SERVICE_ACCOUNT` the Cloud Run Admin role (`roles/run.admin`) on
the Google Cloud project, or a custom role that includes
`run.services.setIamPolicy` and the permissions needed to deploy. If an
organization policy requires the Invoker IAM check, a project administrator
must change the policy or the application must use an authenticated
backend/proxy instead.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
