variable "aws_region" {
  type        = string
  description = "AWS region"
}

variable "project_name" {
  type        = string
  description = "Project name"
}

variable "environment" {
  type        = string
  description = "Environment name"
}

variable "vpc_cidr" {
  type        = string
  description = "VPC CIDR block"
}

variable "availability_zones" {
  type        = list(string)
  description = "Availability zones"
}

variable "public_subnet_cidrs" {
  type        = list(string)
  description = "Public subnet CIDRs"
}

variable "private_subnet_cidrs" {
  type        = list(string)
  description = "Private subnet CIDRs"
}

variable "container_port" {
  type        = number
  description = "Application port"
}

variable "container_cpu" {
  type        = number
  description = "ECS CPU units"
}

variable "container_memory" {
  type        = number
  description = "ECS memory"
}

variable "desired_count" {
  type        = number
  description = "ECS desired task count"
}

variable "ecr_repository_name" {
  type        = string
  description = "ECR repository name"
}

variable "container_image" {
  type        = string
  description = "ECS container image"
}

variable "execution_role_arn" {
  type        = string
  description = "Existing ECS execution role ARN"
}

variable "task_role_arn" {
  type        = string
  description = "Existing ECS task role ARN"
}

variable "db_host" {
  type        = string
  description = "RDS endpoint"
}

variable "db_name" {
  type        = string
  description = "Database name"
}

variable "db_user" {
  type        = string
  description = "Database username"
}

variable "db_password" {
  type        = string
  sensitive   = true
  description = "Database password"
}

variable "db_port" {
  type        = number
  default     = 5432
}

variable "db_ssl" {
  type        = string
  default     = "true"
}

variable "domain_name" {
  type        = string
  description = "Application domain"
}

variable "hosted_zone_id" {
  type        = string
  description = "Route53 hosted zone ID"
}

variable "s3_bucket_name" {
  type        = string
  description = "S3 bucket name"
}
