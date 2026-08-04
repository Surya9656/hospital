aws_region  = "ap-south-1"
project_name = "hospital"
environment  = "prod"

vpc_cidr = "10.0.0.0/16"

availability_zones = [
  "ap-south-1a",
  "ap-south-1b"
]

public_subnet_cidrs = [
  "10.0.1.0/24",
  "10.0.2.0/24"
]

private_subnet_cidrs = [
  "10.0.11.0/24",
  "10.0.12.0/24"
]

container_port   = 3000
container_cpu    = 512
container_memory = 1024
desired_count    = 2

ecr_repository_name = "hospital-app"

container_image = "028282962975.dkr.ecr.ap-south-1.amazonaws.com/hospital-app:latest"

db_host = "hospital-postgres.cz8wci0o6cgh.ap-south-1.rds.amazonaws.com"
db_name = "hospital_db"
db_user = "hospital_admin"

db_port = 5432
db_ssl  = "true"

domain_name = "yourdomain.com"

s3_bucket_name = "hospital-prod-images"
