**docker-compose.yml**
  1. postgress image pulled from the docker-hub
  2. environment variable is set, on startup the images reads the environment variable 
     and sets the database name, user and password
  3. on the container postgres data will be on '/var/lib/postgres/data'
  4. all the sql file on migration will be mount to docker-entrypoint-initdb.d


postgres
  1. when we create indexes on the table
    for example: CREATE INDEX idx_job_runs_status ON job_runs(status)
                $ CREATE INDEX idx_job_runs_job_def ON job_runs(job_definition_id, created_at DESC)
  2. it will create seperated index associated with the table job_runs 
  3. Conceptuall it will look like: job_runs
│
├── TABLE
│   ├── id
│   ├── status
│   ├── job_definition_id
│   └── created_at
│
├── INDEX: idx_job_runs_status
│   └── status
│
├── INDEX: idx_job_runs_job_def
│   ├── job_definition_id
│   └── created_at DESC
│
└── INDEX: idx_job_runs_created
    └── created_at DESC

  4. so when we need check for the status it will not run through all the rows instead it will check based on
    the status like status       → where the actual row is
────────────────────────────────────
failed       → row 3
pending      → row 1
pending      → row 5
success      → row 2
success      → row 4

note: it will not use idx_job_runs_status, it will check whether the index searching will be efficient or not, Postgres's query planner decide, where to use it or not

0. Postgres creates seperate index structure
  idx_job_runs_created, idx_job_runs_status are the database object stored by postgresSQL, not the column on the table 

  in psql: we see something like this
      Indexes:
    "job_runs_pkey" PRIMARY KEY, btree (id)
    "idx_job_runs_status" btree (status)
    "idx_job_runs_job_def" btree (job_definition_id, created_at DESC)
    "idx_job_runs_created" btree (created_at DESC)

  
CREATE INDEX automatically create B tree for efficiently search, sort and perfom range quries

YOU
 │
 │ SQL query
 ↓
PostgreSQL
 │
 ↓
Query Planner
 │
 ├── Should I use an index?
 │
 ├── Which index?
 │
 └── Is sequential scan cheaper?
 │
 ↓
Execution
