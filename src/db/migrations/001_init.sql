CREATE TABLE job_definition (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            VARCHAR(255) UNIQUE NOT NULL,
  description     TEXT,

  -- handler maps to the actual code/scripts which executes a function 
  -- scheduler doesn't what any job will do, it just call this handler
  handler         VARCHAR(20) NOT NULL,

  -- it holds JSONB it's a postgres data type which holds JSON 
  -- default_config contains jobs config
  -- example: on a newsletter, different newsletter links and delivery channel
  --          where those newletter will be delivered on
  default_config  JSONB DEFAULT '{}',

  max_retries      INT DEFAULT 3,
  retry_strategy   VARCHAR(20) DEFAULT 'exponential',
  retry_delay_ms    INT DEFAULT 5000, -- delay between retries
  timeout_seconds   INT DEFAULT 3000,
 
  -- to check if the job is enable or disable, which 
  -- helps not to delete the job, just keeping it at pause
  enabled           BOOLEAN DEFAULT TRUE,

  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);


CREATE TABLE schedules(
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_definition_id UUID NOT NULL REFERENCES job_definition(id) ON DELETE CASCADE,

  -- cron expression 7  * * * *
  cron_expression   VARCHAR(100) NOT NULL,
  timezone          VARCHAR(50) DEFAULT 'UTC',
  enabled           BOOLEAN DEFAULT TRUE,

  -- when will be the next run at, it's optimization column
  next_run_at       TIMESTAMPTZ NOT NULL,
  last_triggered_at TIMESTAMPTZ,

  -- even if the job's delivery channel is fixed at job_definition
  -- but there maybe need on some schedules where the delivery channel
  -- or the link maybe different from the default_config, so the payload_overide
  -- is needed
  payload_override  JSONB DEFAULT '{}',
  created_at        TIMESTAMPTZ DEFAULT now(),
  updated_at        TIMESTAMPTZ DEFAULT now()
);

-- it only index rows where enabled = TRUE 
-- the scheudler services hits the query index directly 
-- and find all the enabled schedules
CREATE INDEX idx_schedules_next_run ON schedules(next_run_at) WHERE enabled = TRUE;


CREATE TABLE job_runs(
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_definition_id UUID NOT NULL REFERENCES job_definition(id),
  schedule_id       UUID REFERENCES schedules(id),

  -- manual trigger or trigger by schedule or dependencies trigger
  triggered_by      VARCHAR(20) NOT NULL DEFAULT 'schedule'
                    CHECK(triggered_by IN ('schedule', 'api', 'dependencies')),

  status            VARCHAR(20) NOT NULL DEFAULT 'PENDING'
                    CHECK(status IN ('PENDGIN', 'QUEUED', 'RUNNING', 'SUCCEEDED', 'FAILED', 'RETRYING', 'DEAD')),
  -- the actual config/payload for the run
  -- computed at the creation time by merging 
  -- job_definition.default_config and schedule.payload_override
  payload           JSONB DEFAULT '{}',

  result            JSONB,
  error             TEXT,
  error_stack       TEXT,

  attempt           INT DEFAULT 1,
  max_attempts      INT NOT NULL,
  worker_id         VARCHAR(100),

  -- it's the visibility timeout, when a worker picks up the job it sets
  -- locked_until = NOW() + timeout_seconds, until then it will lock
  -- if the job finish the job it's cleared out
  locked_until      TIMESTAMPTZ,

  -- when was this job schedule was supposed to run
  scheduled_at      TIMESTAMPTZ,
  -- when the worker actually begin executing
  started_at        TIMESTAMPTZ,
  completed_at      TIMESTAMPTZ,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_job_runs_status ON job_runs(status);
CREATE INDEX idx_job_runs_job_def ON job_runs(job_definition_id, created_at DESC);
CREATE INDEX idx_job_runs_created ON job_runs(created_at DESC);
