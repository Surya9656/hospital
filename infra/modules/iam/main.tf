# ============================================================
# IAM MODULE
# ============================================================

# ------------------------------------------------------------
# GitHub Actions OIDC Provider
# ------------------------------------------------------------

data "tls_certificate" "github" {
  url = "https://token.actions.githubusercontent.com"
}

resource "aws_iam_openid_connect_provider" "github" {
  url = "https://token.actions.githubusercontent.com"

  client_id_list = [
    "sts.amazonaws.com"
  ]

  thumbprint_list = [
    data.tls_certificate.github.certificates[0].sha1_fingerprint
  ]

  tags = {
    Name        = "${var.project_name}-github-oidc"
    Project     = var.project_name
    Environment = var.environment
  }
}

# ------------------------------------------------------------
# GitHub Actions Trust Policy
# ------------------------------------------------------------

data "aws_iam_policy_document" "github_actions_assume_role" {

  statement {
    effect = "Allow"

    principals {
      type = "Federated"

      identifiers = [
        aws_iam_openid_connect_provider.github.arn
      ]
    }

    actions = [
      "sts:AssumeRoleWithWebIdentity"
    ]

    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:aud"

      values = [
        "sts.amazonaws.com"
      ]
    }

    condition {
      test     = "StringLike"
      variable = "token.actions.githubusercontent.com:sub"

      values = [
        "repo:${var.github_repository}:ref:refs/heads/main"
      ]
    }
  }
}

# ------------------------------------------------------------
# GitHub Actions Terraform Role
# ------------------------------------------------------------

resource "aws_iam_role" "github_actions" {
  name = "${var.project_name}-${var.environment}-github-actions-role"

  assume_role_policy = data.aws_iam_policy_document.github_actions_assume_role.json

  description = "IAM role assumed by GitHub Actions using OIDC for Terraform automation"

  tags = {
    Name        = "${var.project_name}-${var.environment}-github-actions-role"
    Project     = var.project_name
    Environment = var.environment
  }
}

# ------------------------------------------------------------
# Terraform Infrastructure Policy
#
# This policy gives Terraform permissions to manage:
# VPC
# ECS
# ECR
# ALB
# RDS
# ACM
# Route53
# S3
# CloudWatch
# IAM
# ------------------------------------------------------------

data "aws_iam_policy_document" "terraform_infrastructure" {

  statement {
    sid    = "TerraformFullInfrastructureAccess"
    effect = "Allow"

    actions = [
      "ec2:*",
      "ecs:*",
      "ecr:*",
      "elasticloadbalancing:*",
      "rds:*",
      "acm:*",
      "route53:*",
      "s3:*",
      "logs:*",
      "cloudwatch:*",
      "iam:*",
      "autoscaling:*",
      "application-autoscaling:*",
      "servicediscovery:*",
      "secretsmanager:*"
    ]

    resources = ["*"]
  }

  statement {
    sid    = "TerraformGetCallerIdentity"
    effect = "Allow"

    actions = [
      "sts:GetCallerIdentity"
    ]

    resources = ["*"]
  }
}

resource "aws_iam_policy" "terraform_infrastructure" {
  name = "${var.project_name}-${var.environment}-terraform-infrastructure-policy"

  description = "Permissions for Terraform to manage Hospital AWS infrastructure"

  policy = data.aws_iam_policy_document.terraform_infrastructure.json

  tags = {
    Name        = "${var.project_name}-${var.environment}-terraform-infrastructure-policy"
    Project     = var.project_name
    Environment = var.environment
  }
}

resource "aws_iam_role_policy_attachment" "terraform_infrastructure" {
  role = aws_iam_role.github_actions.name

  policy_arn = aws_iam_policy.terraform_infrastructure.arn
}

# ============================================================
# ECS TASK EXECUTION ROLE
# ============================================================

data "aws_iam_policy_document" "ecs_task_execution_assume_role" {

  statement {
    effect = "Allow"

    principals {
      type = "Service"

      identifiers = [
        "ecs-tasks.amazonaws.com"
      ]
    }

    actions = [
      "sts:AssumeRole"
    ]
  }
}

resource "aws_iam_role" "ecs_task_execution" {

  name = "${var.project_name}-${var.environment}-ecs-task-execution-role"

  assume_role_policy = data.aws_iam_policy_document.ecs_task_execution_assume_role.json

  tags = {
    Name        = "${var.project_name}-${var.environment}-ecs-task-execution-role"
    Project     = var.project_name
    Environment = var.environment
  }
}

resource "aws_iam_role_policy_attachment" "ecs_task_execution" {

  role = aws_iam_role.ecs_task_execution.name

  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

# ============================================================
# ECS TASK ROLE
# ============================================================

data "aws_iam_policy_document" "ecs_task_assume_role" {

  statement {
    effect = "Allow"

    principals {
      type = "Service"

      identifiers = [
        "ecs-tasks.amazonaws.com"
      ]
    }

    actions = [
      "sts:AssumeRole"
    ]
  }
}

resource "aws_iam_role" "ecs_task" {

  name = "${var.project_name}-${var.environment}-ecs-task-role"

  assume_role_policy = data.aws_iam_policy_document.ecs_task_assume_role.json

  tags = {
    Name        = "${var.project_name}-${var.environment}-ecs-task-role"
    Project     = var.project_name
    Environment = var.environment
  }
}

# ------------------------------------------------------------
# ECS Task Policy
# ------------------------------------------------------------

data "aws_iam_policy_document" "ecs_task_policy" {

  statement {
    sid    = "ECRReadOnly"
    effect = "Allow"

    actions = [
      "ecr:GetAuthorizationToken",
      "ecr:BatchCheckLayerAvailability",
      "ecr:GetDownloadUrlForLayer",
      "ecr:BatchGetImage"
    ]

    resources = ["*"]
  }

  statement {
    sid    = "CloudWatchLogs"
    effect = "Allow"

    actions = [
      "logs:CreateLogStream",
      "logs:PutLogEvents"
    ]

    resources = ["*"]
  }

  statement {
    sid    = "S3Access"
    effect = "Allow"

    actions = [
      "s3:GetObject",
      "s3:PutObject",
      "s3:DeleteObject",
      "s3:ListBucket"
    ]

    resources = ["*"]
  }

  statement {
    sid    = "SecretsManagerRead"
    effect = "Allow"

    actions = [
      "secretsmanager:GetSecretValue",
      "secretsmanager:DescribeSecret"
    ]

    resources = ["*"]
  }
}

resource "aws_iam_policy" "ecs_task" {

  name = "${var.project_name}-${var.environment}-ecs-task-policy"

  description = "Runtime permissions for Hospital ECS application"

  policy = data.aws_iam_policy_document.ecs_task_policy.json

  tags = {
    Name        = "${var.project_name}-${var.environment}-ecs-task-policy"
    Project     = var.project_name
    Environment = var.environment
  }
}

resource "aws_iam_role_policy_attachment" "ecs_task" {

  role = aws_iam_role.ecs_task.name

  policy_arn = aws_iam_policy.ecs_task.arn
}

# ============================================================
# EC2 IAM ROLE
# ============================================================

data "aws_iam_policy_document" "ec2_assume_role" {

  statement {
    effect = "Allow"

    principals {
      type = "Service"

      identifiers = [
        "ec2.amazonaws.com"
      ]
    }

    actions = [
      "sts:AssumeRole"
    ]
  }
}

resource "aws_iam_role" "ec2" {

  name = "${var.project_name}-${var.environment}-ec2-role"

  assume_role_policy = data.aws_iam_policy_document.ec2_assume_role.json

  tags = {
    Name        = "${var.project_name}-${var.environment}-ec2-role"
    Project     = var.project_name
    Environment = var.environment
  }
}

# ------------------------------------------------------------
# EC2 SSM Policy
# ------------------------------------------------------------

resource "aws_iam_role_policy_attachment" "ec2_ssm" {

  role = aws_iam_role.ec2.name

  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

# ------------------------------------------------------------
# EC2 ECR Read Only
# ------------------------------------------------------------

resource "aws_iam_role_policy_attachment" "ec2_ecr" {

  role = aws_iam_role.ec2.name

  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
}

# ------------------------------------------------------------
# EC2 CloudWatch Agent
# ------------------------------------------------------------

resource "aws_iam_role_policy_attachment" "ec2_cloudwatch" {

  role = aws_iam_role.ec2.name

  policy_arn = "arn:aws:iam::aws:policy/CloudWatchAgentServerPolicy"
}

# ------------------------------------------------------------
# EC2 Instance Profile
# ------------------------------------------------------------

resource "aws_iam_instance_profile" "ec2" {

  name = "${var.project_name}-${var.environment}-ec2-instance-profile"

  role = aws_iam_role.ec2.name

  tags = {
    Name        = "${var.project_name}-${var.environment}-ec2-instance-profile"
    Project     = var.project_name
    Environment = var.environment
  }
}
