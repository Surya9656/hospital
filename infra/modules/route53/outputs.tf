output "domain_name" {
  value = var.domain_name
}

output "application_url" {
  value = "https://${var.domain_name}"
}
