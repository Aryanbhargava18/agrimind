import { useMemo, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Droplets,
  FlaskConical,
  LoaderCircle,
  ShieldCheck,
  Sparkles,
  Sprout,
} from 'lucide-react';

import {
  cropOptions,
  defaultValues,
  regionOptions,
  samplePresets,
  soilOptions,
  weatherOptions,
} from '../lib/constants.js';
import { advisorySchema, stepFields } from '../lib/schema.js';

const steps = ['Location & Crop', 'Weather & Conditions', 'Farm Practices', 'Review & Submit'];

export default function AdvisoryWizard({ defaultForm, isLoading, onSubmit }) {
  const [step, setStep] = useState(0);
  const touchStart = useRef(null);
  const formDefaults = useMemo(() => defaultForm || defaultValues, [defaultForm]);

  const {
    control,
    handleSubmit,
    register,
    reset,
    setValue,
    trigger,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(advisorySchema),
    defaultValues: formDefaults,
    mode: 'onBlur',
  });

  const values = watch();

  async function goNext() {
    const ok = await trigger(stepFields[step]);
    if (ok) setStep((current) => Math.min(current + 1, steps.length - 1));
  }

  function goBack() {
    setStep((current) => Math.max(current - 1, 0));
  }

  function applyPreset(event) {
    const preset = samplePresets.find((item) => item.label === event.target.value);
    if (preset) {
      reset(preset.values);
      setStep(0);
    }
  }

  function handleSwipeEnd(event) {
    if (touchStart.current === null) return;
    const delta = event.changedTouches[0].clientX - touchStart.current;
    if (delta < -70 && step < steps.length - 1) goNext();
    if (delta > 70 && step > 0) goBack();
    touchStart.current = null;
  }

  return (
    <div className="wizard-shell stagger-scope">
      <div className="wizard-top">
        <div>
          <p className="wizard-label">Validated advisory wizard</p>
          <h3>Four focused steps. Zero partial submissions.</h3>
        </div>
        <label className="preset-select">
          Sample preset
          <select onChange={applyPreset} defaultValue="">
            <option value="" disabled>
              Load a scenario
            </option>
            {samplePresets.map((preset) => (
              <option key={preset.label} value={preset.label}>
                {preset.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="progress-bar" role="list" aria-label="Advisory wizard progress">
        {steps.map((label, index) => (
          <button
            key={label}
            type="button"
            className={index <= step ? 'active' : ''}
            onClick={async () => {
              if (index <= step) setStep(index);
              if (index > step) {
                const ok = await trigger(stepFields[step]);
                if (ok) setStep(index);
              }
            }}
          >
            <span>{index + 1}</span>
            <strong>{label}</strong>
          </button>
        ))}
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        onTouchStart={(event) => {
          touchStart.current = event.touches[0].clientX;
        }}
        onTouchEnd={handleSwipeEnd}
      >
        <AnimatePresence mode="wait">
          {step === 0 && (
            <StepFrame key="step-1" title="Location & crop profile">
              <FieldError error={errors.Region} />
              <Controller
                name="Region"
                control={control}
                render={({ field }) => (
                  <div className="visual-grid four">
                    {regionOptions.map((region) => (
                      <button
                        key={region.value}
                        type="button"
                        className={`visual-card bg-gradient-to-br ${region.gradient} ${
                          field.value === region.value ? 'selected' : ''
                        }`}
                        aria-pressed={field.value === region.value}
                        onClick={() => field.onChange(region.value)}
                      >
                        <span className="mini-map">{region.label.slice(0, 1)}</span>
                        <strong>{region.label}</strong>
                        <small>{region.caption}</small>
                      </button>
                    ))}
                  </div>
                )}
              />

              <div className="mt-8">
                <SectionLabel title="Crop picker" error={errors.Crop} />
                <Controller
                  name="Crop"
                  control={control}
                  render={({ field }) => (
                    <div className="visual-grid crops">
                      {cropOptions.map((crop) => {
                        const Icon = crop.icon;
                        return (
                          <button
                            key={crop.value}
                            type="button"
                            className={`crop-card bg-gradient-to-br ${crop.tone} ${
                              field.value === crop.value ? 'selected' : ''
                            }`}
                            aria-pressed={field.value === crop.value}
                            onClick={() => field.onChange(crop.value)}
                          >
                            <Icon size={26} />
                            <strong>{crop.label}</strong>
                          </button>
                        );
                      })}
                    </div>
                  )}
                />
              </div>

              <div className="mt-8">
                <SectionLabel title="Soil type" error={errors.Soil_Type} />
                <Controller
                  name="Soil_Type"
                  control={control}
                  render={({ field }) => (
                    <div className="pill-row">
                      {soilOptions.map((soil) => (
                        <button
                          type="button"
                          key={soil.value}
                          className={field.value === soil.value ? 'pill selected' : 'pill'}
                          aria-pressed={field.value === soil.value}
                          onClick={() => field.onChange(soil.value)}
                        >
                          {soil.label}
                        </button>
                      ))}
                    </div>
                  )}
                />
              </div>
            </StepFrame>
          )}

          {step === 1 && (
            <StepFrame key="step-2" title="Weather & field conditions">
              <SectionLabel title="Weather condition" error={errors.Weather_Condition} />
              <Controller
                name="Weather_Condition"
                control={control}
                render={({ field }) => (
                  <div className="weather-grid">
                    {weatherOptions.map((weather) => {
                      const Icon = weather.icon;
                      return (
                        <button
                          key={weather.value}
                          type="button"
                          className={field.value === weather.value ? 'weather-card selected' : 'weather-card'}
                          aria-pressed={field.value === weather.value}
                          onClick={() => field.onChange(weather.value)}
                        >
                          <Icon size={30} />
                          <strong>{weather.label}</strong>
                        </button>
                      );
                    })}
                  </div>
                )}
              />

              <div className="slider-grid">
                <SliderField
                  label="Rainfall"
                  suffix="mm"
                  min={0}
                  max={1000}
                  name="Rainfall_mm"
                  register={register}
                  value={values.Rainfall_mm}
                  error={errors.Rainfall_mm}
                />
                <SliderField
                  label="Temperature"
                  suffix="C"
                  min={-10}
                  max={60}
                  name="Temperature_Celsius"
                  register={register}
                  value={values.Temperature_Celsius}
                  error={errors.Temperature_Celsius}
                  hot
                />
              </div>

              <div className="stepper-card">
                <div>
                  <span>Days to harvest</span>
                  <strong>{values.Days_to_Harvest} days</strong>
                  <FieldError error={errors.Days_to_Harvest} />
                </div>
                <div className="stepper-controls">
                  <button
                    type="button"
                    aria-label="Decrease days to harvest"
                    onClick={() => setValue('Days_to_Harvest', Math.max(1, Number(values.Days_to_Harvest) - 1))}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    max="365"
                    aria-label="Days to harvest"
                    {...register('Days_to_Harvest', { valueAsNumber: true })}
                  />
                  <button
                    type="button"
                    aria-label="Increase days to harvest"
                    onClick={() => setValue('Days_to_Harvest', Math.min(365, Number(values.Days_to_Harvest) + 1))}
                  >
                    +
                  </button>
                </div>
              </div>
            </StepFrame>
          )}

          {step === 2 && (
            <StepFrame key="step-3" title="Farm practices">
              <div className="practice-grid">
                <ToggleCard
                  name="Fertilizer_Used"
                  control={control}
                  title="Fertilizer used"
                  description="Nutrient management included in this field."
                  icon={FlaskConical}
                />
                <ToggleCard
                  name="Irrigation_Used"
                  control={control}
                  title="Irrigation used"
                  description="Water application is available to the crop."
                  icon={Droplets}
                />
                <ToggleCard
                  name="Pesticide_Used"
                  control={control}
                  title="Pesticide used"
                  description="Optional practice captured for review only."
                  icon={ShieldCheck}
                />
              </div>
            </StepFrame>
          )}

          {step === 3 && (
            <StepFrame key="step-4" title="Review & submit">
              <div className="review-card">
                <div className="review-head">
                  <Sparkles size={22} />
                  <div>
                    <span>Ready to run</span>
                    <strong>{values.Crop} advisory for {values.Region}</strong>
                  </div>
                </div>
                <div className="review-grid">
                  {Object.entries({
                    Region: values.Region,
                    Crop: cropOptions.find((crop) => crop.value === values.Crop)?.label || values.Crop,
                    Soil: soilOptions.find((soil) => soil.value === values.Soil_Type)?.label || values.Soil_Type,
                    Weather: values.Weather_Condition,
                    Rainfall: `${values.Rainfall_mm} mm`,
                    Temperature: `${values.Temperature_Celsius} C`,
                    Harvest: `${values.Days_to_Harvest} days`,
                    Fertilizer: values.Fertilizer_Used ? 'Yes' : 'No',
                    Irrigation: values.Irrigation_Used ? 'Yes' : 'No',
                    Pesticide: values.Pesticide_Used ? 'Yes' : 'No',
                  }).map(([label, value]) => (
                    <div key={label}>
                      <span>{label}</span>
                      <strong>{value}</strong>
                    </div>
                  ))}
                </div>
              </div>
            </StepFrame>
          )}
        </AnimatePresence>

        <div className="wizard-actions">
          <button type="button" className="ghost-button" onClick={goBack} disabled={step === 0}>
            <ChevronLeft size={18} />
            Back
          </button>
          {step < steps.length - 1 ? (
            <button type="button" className="magnetic-button primary-button" onClick={goNext} data-magnetic>
              Next
              <ChevronRight size={18} />
            </button>
          ) : (
            <button type="submit" className="magnetic-button primary-button" disabled={isLoading} data-magnetic>
              {isLoading ? (
                <>
                  <LoaderCircle className="animate-spin" size={19} />
                  Consulting AI...
                </>
              ) : (
                <>
                  <Check size={19} />
                  Run Advisory
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

function StepFrame({ title, children }) {
  return (
    <motion.div
      className="wizard-panel stagger-card"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <h4>{title}</h4>
      {children}
    </motion.div>
  );
}

function SectionLabel({ title, error }) {
  return (
    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
      <p className="input-section-label">{title}</p>
      <FieldError error={error} />
    </div>
  );
}

function FieldError({ error }) {
  if (!error) return null;
  return <p className="field-error">{error.message}</p>;
}

function SliderField({ label, suffix, min, max, name, register, value, error, hot = false }) {
  const progress = ((Number(value) - min) / (max - min)) * 100;
  return (
    <label className="slider-card">
      <div className="flex items-center justify-between gap-4">
        <span>{label}</span>
        <strong>
          {value} {suffix}
        </strong>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={name === 'Temperature_Celsius' ? 0.5 : 10}
        className={hot ? 'range-hot' : ''}
        style={{ '--progress': `${progress}%` }}
        aria-label={label}
        {...register(name, { valueAsNumber: true })}
      />
      <FieldError error={error} />
    </label>
  );
}

function ToggleCard({ name, control, title, description, icon: Icon }) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <button
          type="button"
          className={field.value ? 'toggle-card selected' : 'toggle-card'}
          aria-pressed={field.value}
          onClick={() => field.onChange(!field.value)}
        >
          <span className="toggle-icon">
            <Icon size={25} />
          </span>
          <strong>{title}</strong>
          <small>{description}</small>
          <span className="toggle-state">{field.value ? 'Enabled' : 'Disabled'}</span>
        </button>
      )}
    />
  );
}

