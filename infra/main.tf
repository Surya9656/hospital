module "vpc" {
  source = "./modules/vpc"

  project_name          = var.project_name
  environment           = var.environment
  vpc_cidr              = var.vpc_cidr
  availability_zones    = var.availability_zones
  public_subnet_cidrs   = var.public_subnet_cidrs
  private_subnet_cidrs  = var.private_subnet_cidrs
}

module "security_groups" {
  source = "./modules/security-groups"

  project_name = var.project_name
  environment  = var.environment
  vpc_id       = module.vpc.vpc_id
  app_port     = var.app_port
  db_port      = var.db_port
}

module "ecr" {
  source = "./modules/ecr"

  repository_name = var.ecr_repository_name
}

module "cloudwatch" {
  source = "./modules/cloudwatch"

  project_name = var.project_name
  environment  = var.environment
}

module "alb" {
  source = "./modules/alb"

  project_name       = var.project_name
  environment        = var.environment
  vpc_id             = module.vpc.vpc_id
  public_subnet_ids  = module.vpc.public_subnet_ids
  security_group_id  = module.security_groups.alb_security_group_id
  app_port           = var.app_port
  certificate_arn    = module.acm.certificate_arn
}

module "acm" {
  source = "./modules/acm"

  domain_name       = var.domain_name
  route53_zone_id   = var.route53_zone_id
}

module "ecs" {
  source = "./modules/ecs"

  project_name          = var.project_name
  environment           = var.environment
  aws_region            = var.aws_region

  vpc_id                = module.vpc.vpc_id
  private_subnet_ids    = module.vpc.private_subnet_ids

  security_group_id     = module.security_groups.ecs_security_group_id

  target_group_arn      = module.alb.target_group_arn

  execution_role_arn    = var.ecs_execution_role_arn
  task_role_arn         = var.ecs_task_role_arn

  container_image       = var.container_image
  container_cpu         = var.container_cpu
  container_memory      = var.container_memory
  desired_count         = var.desired_count
  app_port              = var.app_port

  log_group_name        = module.cloudwatch.log_group_name

  db_host               = var.db_host
  db_name               = var.db_name
  db_user               = var.db_user
  db_password           = var.db_password
  db_port               = var.db_port
}

module "route53" {
  source = "./modules/route53"

  domain_name       = var.domain_name
  route53_zone_id   = var.route53_zone_id
  alb_dns_name      = module.alb.alb_dns_name
  alb_zone_id       = module.alb.alb_zone_id
}

module "s3" {
  source = "./modules/s3"

  project_name = var.project_name
  environment  = var.environment
}
