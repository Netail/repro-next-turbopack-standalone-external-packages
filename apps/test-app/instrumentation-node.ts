import opentelemetry, { context, type Span } from '@opentelemetry/api';
import { AsyncLocalStorageContextManager } from '@opentelemetry/context-async-hooks';
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { HostMetrics } from '@opentelemetry/host-metrics';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { RuntimeNodeInstrumentation } from '@opentelemetry/instrumentation-runtime-node';
import { UndiciInstrumentation } from '@opentelemetry/instrumentation-undici';
import {
    detectResources,
    envDetector,
    hostDetector,
    processDetector,
    resourceFromAttributes,
} from '@opentelemetry/resources';
import { MeterProvider } from '@opentelemetry/sdk-metrics';
import {
    BatchSpanProcessor,
    NodeTracerProvider,
    type SpanExporter,
    type SpanProcessor,
} from '@opentelemetry/sdk-trace-node';
import { ATTR_SERVICE_NAME, ATTR_SERVICE_VERSION } from '@opentelemetry/semantic-conventions';

context.setGlobalContextManager(new AsyncLocalStorageContextManager());

const metricsExporter = new PrometheusExporter({
    port: 9464,
});
const tracesExporter = new OTLPTraceExporter({
    url:
        process.env.OTEL_COLLECTOR_GRPC_URL ??
        'https://otlp-grpc-technl.cerebro.nonprd.k8s.ah.technology:443',
});

const detectedResources = detectResources({
    detectors: [envDetector, processDetector, hostDetector],
});

const customResources = resourceFromAttributes({
    [ATTR_SERVICE_NAME]: process.env.NEXT_PUBLIC_CLIENT || 'unknown',
    [ATTR_SERVICE_VERSION]: process.env.NEXT_PUBLIC_VERSION || 'unknown',
});
const resources = customResources.merge(detectedResources);

const meterProvider = new MeterProvider({
    resource: resources,
    readers: [metricsExporter],
});

opentelemetry.metrics.setGlobalMeterProvider(meterProvider);

const hostMetrics = new HostMetrics({
    name: `${process.env.NEXT_PUBLIC_CLIENT}-metrics`,
    meterProvider,
});

export const startInstrumentation = () => {
    const tracerProvider = new NodeTracerProvider({
        resource: resources,
        spanProcessors: [
            new BatchSpanProcessor(tracesExporter as SpanExporter, {
                // The maximum queue size. After the size is reached spans are dropped.
                maxQueueSize: 100,
                // The maximum batch size of every export. It must be smaller or equal to maxQueueSize.
                maxExportBatchSize: 10,
                // The interval between two consecutive exports
                scheduledDelayMillis: 500,
                // How long the export can run before it is cancelled
                exportTimeoutMillis: 30000,
            }),
        ],
    });

    registerInstrumentations({
        tracerProvider,
        meterProvider,
        instrumentations: [
            new HttpInstrumentation(),
            new UndiciInstrumentation(),
            new RuntimeNodeInstrumentation(),
        ],
    });

    tracerProvider.register();
    hostMetrics.start();
};
