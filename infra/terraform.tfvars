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

container_port  = 3000
container_cpu   = 512
container_memory = 1024
desired_count   = 2

ecr_repository_name = "hospital-app"

container_image = "028282962975.dkr.ecr.ap-south-1.amazonaws.com/hospital-app:latest"

execution_role_arn = "arn:aws:iam::028282962975:role/YOUR-ECS-EXECUTION-ROLE"
task_role_arn      = "arn:aws:iam::028282962975:role/YOUR-ECS-TASK-ROLE"

db_host     = "hospital-postgres.cz8wci0o6cgh.ap-south-1.rds.amazonaws.com"
db_name     = "hospital_db"
db_user     = "hospital_admin"
db_password = "YOUR-RDS-PASSWORD"
db_port     = 5432
db_ssl      = "true"

domain_name   = "yourdomain.com"
hosted_zone_id = "YOUR_ROUTE53_HOSTED_ZONE_ID"

s3_bucket_name = "hospital-prod-images-YOUR-ACCOUNT-ID"
