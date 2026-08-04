# Do not commit this file if it contains secrets.

aws_region   = "ap-south-1"
project_name = "hospital"
environment  = "prod"
github_repository = "Surya9656/hospital"

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

app_port          = 3000
container_cpu     = 512
container_memory  = 1024
desired_count     = 2

ecr_repository_name = "hospital-app"

container_image = "028282962975.dkr.ecr.ap-south-1.amazonaws.com/hospital-app:latest"

ecs_execution_role_arn = "arn:aws:iam::YOUR_ACCOUNT_ID:role/YOUR_ECS_EXECUTION_ROLE"
ecs_task_role_arn      = "arn:aws:iam::YOUR_ACCOUNT_ID:role/YOUR_ECS_TASK_ROLE"

domain_name     = "your-domain.com"
route53_zone_id = "YOUR_HOSTED_ZONE_ID"

db_host     = "your-rds-endpoint"
db_name     = "hospital_db"
db_user     = "hospital_admin"
db_password = "YOUR_DB_PASSWORD"
db_port     = 5432
