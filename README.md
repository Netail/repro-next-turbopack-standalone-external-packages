# repro-next-turbopack-standalone-external-packages

1. Have Docker installed & running
2. Run `sh repro.sh` & wait for the build + docker image to finish
3. Run the `test-app:0.1.0` docker image
4. Check logs and see the following:

    ```sh
    Failed to prepare server Error: An error occurred while loading instrumentation hook: Failed to load external module @opentelemetry/instrumentation-6d4cbf8d0d66c550: Error: Cannot find module '@opentelemetry/instrumentation-6d4cbf8d0d66c550'

    Require stack:

    - /apps/test-app/.next/server/chunks/[root-of-the-server]__05q_138._.js

    - /apps/test-app/.next/server/chunks/[turbopack]_runtime.js

    - /apps/test-app/.next/server/instrumentation.js

    - /node_modules/.pnpm/next@16.2.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/lib/router-utils/instrumentation-globals.external.js

    - /node_modules/.pnpm/next@16.2.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/next-server.js

    - /node_modules/.pnpm/next@16.2.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/next.js

    - /apps/test-app/server.js

        at Context.externalRequire [as x] (.next/server/chunks/[turbopack]_runtime.js:624:15)

        at module evaluation (.next/server/chunks/[root-of-the-server]__05q_138._.js:17:628412)

        at instantiateModule (.next/server/chunks/[turbopack]_runtime.js:853:9)

        at getOrInstantiateModuleFromParent (.next/server/chunks/[turbopack]_runtime.js:877:12)

        at Context.esmImport [as i] (.next/server/chunks/[turbopack]_runtime.js:281:20)

        at module evaluation (.next/server/chunks/[root-of-the-server]__05q_138._.js:18:26550)

        at instantiateModule (.next/server/chunks/[turbopack]_runtime.js:853:9)

        at getOrInstantiateModuleFromParent (.next/server/chunks/[turbopack]_runtime.js:877:12)

        at Context.esmImport [as i] (.next/server/chunks/[turbopack]_runtime.js:281:20)

        at <unknown> (.next/server/chunks/out_apps_test-app_103y3tv._.js:1:255)
    ```

Seems like some modules are not resolved, but they do seem to be present in the output.
So maybe I had to copy that new extra node_modules into the docker image:

1. Uncomment line 10 in the apps/test-app Dockerfile & re-run previous steps
2. Observe same result
