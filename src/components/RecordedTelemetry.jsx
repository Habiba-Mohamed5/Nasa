import { useEffect, useId, useState } from 'react';
import { assetPath } from '../utils/assetPath';

const METRICS = [
  ['heart_rate', 'Heart rate'],
  ['pulse_rate', 'Pulse rate'],
  ['respiratory_rate', 'Respiratory rate'],
  ['spo2', 'SpO₂'],
];
const DROPOUT_START_S = 20;
const DROPOUT_END_S = 30;
const HEART_RATE_CHANGE_BPM = 2;

function isInDropout(sample) {
  return sample && sample.elapsed_s >= DROPOUT_START_S && sample.elapsed_s < DROPOUT_END_S;
}

export default function RecordedTelemetry() {
  const inputId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const [record, setRecord] = useState(null);
  const [hasError, setHasError] = useState(false);
  const [sampleIndex, setSampleIndex] = useState(0);
  const [simulateDropout, setSimulateDropout] = useState(false);

  useEffect(() => {
    if (!isOpen || record) return;
    const controller = new AbortController();
    setHasError(false);

    async function loadRecording() {
      try {
        const response = await fetch(assetPath('telemetry/bidmc-recorded.json'), {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error('Recording unavailable');
        const data = await response.json();
        if (data.schema_version !== '1.0.0' || data.data_source !== 'RECORDED' ||
            !data.samples?.length) {
          throw new Error('Unexpected recording');
        }
        if (!controller.signal.aborted) setRecord(data);
      } catch {
        if (!controller.signal.aborted) setHasError(true);
      }
    }

    loadRecording();
    return () => controller.abort();
  }, [isOpen, record]);

  const sample = record?.samples[sampleIndex];
  const previousSample = record?.samples[sampleIndex - 1];
  const dropout = simulateDropout && isInDropout(sample);
  const heartRate = sample?.values.heart_rate;
  const previousHeartRate = previousSample?.values.heart_rate;
  // Compare consecutive observed samples only, including after a simulated gap.
  const canCompareHeartRate = sample && previousSample &&
    sample.elapsed_s - previousSample.elapsed_s === 1 &&
    Number.isFinite(heartRate) && Number.isFinite(previousHeartRate) &&
    !(simulateDropout && (dropout || isInDropout(previousSample)));
  const heartRateChange = canCompareHeartRate ? heartRate - previousHeartRate : null;
  const showHeartRateChange = heartRateChange !== null &&
    Math.abs(heartRateChange) >= HEART_RATE_CHANGE_BPM;
  const missingCount = sample
    ? METRICS.filter(([metric]) => !Number.isFinite(sample.values[metric])).length
    : 0;
  const status = dropout ? 'Signal unavailable · Simulated dropout'
    : missingCount === METRICS.length ? 'Signal unavailable · All recorded readings are missing'
    : missingCount > 0 ? 'Some recorded readings are missing' : '';

  return (
    <details
      onToggle={(event) => setIsOpen(event.currentTarget.open)}
      className="rounded-2xl border border-[#7AD7EA]/25 bg-[#132238]/90 p-4"
    >
      <summary className="cursor-pointer text-sm font-bold text-[#F4F7FC]">
        Recorded telemetry <span className="ml-1 text-[10px] font-mono-tech text-[#7AD7EA]">RECORDED</span>
      </summary>
      <div className="mt-3 space-y-3">
        <p className="text-xs text-[#C7D2E3]">
          Hospital ICU readings from Earth. This recording is independent of the crew simulation.
        </p>
        {sample ? (
          <>
            <label className="flex min-h-[44px] items-center gap-2 text-xs text-[#C7D2E3]">
              <input
                type="checkbox"
                checked={simulateDropout}
                onChange={(event) => setSimulateDropout(event.target.checked)}
                className="accent-[#7AD7EA]"
              />
              Simulate signal dropout (20–30 s)
            </label>
            {simulateDropout && (
              <p className="text-xs font-bold text-[#7AD7EA]">SIMULATED · Dropout replay</p>
            )}
            <label htmlFor={inputId} className="block text-xs text-[#C7D2E3]">
              Sample time · {sample.elapsed_s} s from recording start
            </label>
            <input
              id={inputId}
              type="range"
              min={0}
              max={record.samples.length - 1}
              step={1}
              value={sampleIndex}
              aria-valuetext={`${sample.elapsed_s} seconds from recording start`}
              onChange={(event) => setSampleIndex(Number(event.target.value))}
              className="w-full accent-[#7AD7EA]"
            />
            <div role="status" className="text-xs font-bold text-amber-300">{status}</div>
            <div role="status" aria-label="Heart rate change" className="text-xs text-[#C7D2E3]">
              {showHeartRateChange && (
                <>
                  <strong>Heart rate changed {heartRateChange > 0 ? '+' : ''}{heartRateChange} beats/min in 1 s.</strong>
                  {' Demo threshold: 2 beats/min. For recording review only.'}
                </>
              )}
            </div>
            <dl className="grid grid-cols-2 gap-2">
              {METRICS.map(([metric, label]) => (
                <div key={metric} className="rounded-lg bg-[#0D1728] p-2">
                  <dt className="text-xs text-[#C7D2E3]">{label}</dt>
                  <dd className="text-sm font-mono-tech text-[#F4F7FC]">
                    {dropout || !Number.isFinite(sample.values[metric])
                      ? 'Missing'
                      : `${sample.values[metric]} ${record.units[metric]}`}
                  </dd>
                </div>
              ))}
            </dl>
          </>
        ) : (
          <p role="status" className="text-xs text-[#C7D2E3]">
            {hasError ? 'Recording unavailable. Reopen this panel to retry.' : 'Loading recording…'}
          </p>
        )}
        <p className="text-xs text-[#C7D2E3]">
          <a className="underline" href="https://physionet.org/content/bidmc/1.0.0/">
            Pimentel et al. · PhysioNet BIDMC v1.0.0
          </a>
          {record && ` · ${record.stream_id}`}
          {' · '}
          <a className="underline" href="https://opendatacommons.org/licenses/by/1-0/">ODC-BY 1.0</a>
        </p>
      </div>
    </details>
  );
}
