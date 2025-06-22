######## Bootstrap Configuration ########
variable "project_id" {
	description = "GCP Project ID"
	type        = string
}

variable "region" {
	description = "GCP Region"
	type        = string
}

variable "terraform_state_bucket" {
	description = "GCS bucket name for Terraform state"
	type        = string
}

######## Application resources ########
variable "resource_names" {
	description = "Names for all application resources"
	type = object({
		frontend_bucket         = string
		storage_backend         = string
		url_map                 = string
		ip_address              = string
		http_proxy              = string
		forwarding_rule         = string
		ssl_certificate         = string
		https_proxy             = string
		https_forwarding_rule   = string
	})
}

######## Domain configuration ########
variable "domain_name" {
	description = "Domain name (empty for IP-only access)"
	type        = string
	default     = ""
}

variable "dns_zone_name" {
	description = "DNS managed zone name (without domain suffix)"
	type        = string
	default     = ""
}

######## Computed values to avoid repetition ########
locals {
	# Only create domain resources if domain_name is provided
	is_domain_enabled = var.domain_name != ""
	
	# Computed DNS values
	dns_name = var.domain_name != "" ? "${var.domain_name}." : ""
	www_domain = var.domain_name != "" ? "www.${var.domain_name}." : ""
	
	# SSL certificate domains
	ssl_domains = var.domain_name != "" ? [
		var.domain_name,
		"www.${var.domain_name}"
	] : []
}