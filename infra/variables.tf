variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "ap-south-1"
}

variable "project_name" {
  description = "Project name"
  type        = string
  default     = "hospital"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "prod"
}

variable "vpc_cidr" {
  description = "VPC CIDR"
  type        = string
  default     = "10.0.0.0/16"
}

variable "availability_zones" {
  description = "Availability zones"
  type        = list(string)
  default = [
    "ap-south-1a",
    "ap-south-1b"
  ]
}

variable "public_subnet_cidrs" {
  description = "Public subnet CIDRs"
  type        = list(string)
  default = [
    "10.0.1.0/24",
    "10.0.2.0/24"
  ]
}

variable "private_subnet_cidrs" {
  description = "Private subnet CIDRs"
  type        = list(string)
  default = [
    "10.0.11.0/24",
    "10.0.12.0/24"
  ]
}

variable "app_port" {
  description = "Application port"
  type        = number
  default     = 3000
}

variable "container_cpu" {
  description = "ECS CPU"
  type        = number
  default     = 512
}

variable "container_memory" {
  description = "ECS memory"
  type        = number
  default     = 1024
}

variable "desired_count" {
  description = "ECS desired task count"
  type        = number
  default     = 2
}

variable "ecr_repository_name" {
  description = "ECR repository name"
  type        = string
  default     = "hospital-app"
}

variable "container_image" {
  description = "Docker image"
  type        = string
}

variable "ecs_execution_role_arn" {
  description = "Existing ECS task execution IAM role ARN"
  type        = string
}

variable "ecs_task_role_arn" {
  description = "Existing ECS task IAM role ARN"
  type        = string
}

variable "domain_name" {
  description = "Application domain"
  type        = string
}

variable "route53_zone_id" {
  description = "Existing Route53 hosted zone ID"
  type        = string
}

variable "db_host" {
  description = "RDS PostgreSQL endpoint"
  type        = string
}

variable "db_name" {
  description = "Database name"
  type        = string
  default     = "hospital_db"
}

variable "db_user" {
  description = "Database username"
  type        = string
  sensitive   = true
}

variable "db_password" {
  description = "Database password"
  type        = string
  sensitive   = true
}

variable "db_port" {
  description = "Database port"
  type        = number
  default     = 5432
}
