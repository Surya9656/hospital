variable "aws_region" {
  description = "AWS region"
  type        = string
}

variable "project_name" {
  description = "Project name"
  type        = string
}

variable "environment" {
  description = "Environment name"
  type        = string
}

variable "vpc_cidr" {
  description = "VPC CIDR"
  type        = string
}

variable "public_subnet_cidrs" {
  description = "Public subnet CIDRs"
  type        = list(string)
}

variable "private_subnet_cidrs" {
  description = "Private subnet CIDRs"
  type        = list(string)
}

variable "availability_zones" {
  description = "Availability zones"
  type        = list(string)
}

variable "container_port" {
  description = "Application container port"
  type        = number
}

variable "container_cpu" {
  description = "ECS CPU"
  type        = number
}

variable "container_memory" {
  description = "ECS memory"
  type        = number
}

variable "desired_count" {
  description = "Desired ECS task count"
  type        = number
}

variable "ecr_repository_name" {
  description = "ECR repository name"
  type        = string
}

variable "container_image" {
  description = "Docker image URI"
  type        = string
}

variable "execution_role_arn" {
  description = "Existing ECS task execution IAM role ARN"
  type        = string
}

variable "task_role_arn" {
  description = "Existing ECS task IAM role ARN"
  type        = string
}

variable "db_host" {
  description = "Existing RDS endpoint"
  type        = string
}

variable "db_name" {
  description = "Database name"
  type        = string
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

variable "db_ssl" {
  description = "Enable database SSL"
  type        = string
  default     = "true"
}

variable "domain_name" {
  description = "Application domain name"
  type        = string
}

variable "hosted_zone_id" {
  description = "Route53 hosted zone ID"
  type        = string
}

variable "s3_bucket_name" {
  description = "S3 bucket for application images"
  type        = string
}
