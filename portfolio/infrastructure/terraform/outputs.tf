output "load_balancer_ip" {
  description = "Load balancer IP address"
  value       = google_compute_global_address.portfolio_ip.address
}

output "frontend_bucket_name" {
  description = "Frontend storage bucket name"
  value       = google_storage_bucket.frontend.name
}

output "url_map_name" {
  description = "URL map name for CDN invalidation"
  value       = google_compute_url_map.portfolio_router.name
}

output "ssl_certificate_status" {
  description = "SSL certificate status (if domain is configured)"
  value       = var.domain_name != "" ? "SSL certificate created for ${var.domain_name}" : "No domain configured"
}

output "access_urls" {
  description = "URLs to access the site"
  value = {
    ip_address = "http://${google_compute_global_address.portfolio_ip.address}"
    domain_http = var.domain_name != "" ? "http://${var.domain_name}" : "Not configured"
    domain_https = var.domain_name != "" ? "https://${var.domain_name}" : "Not configured"
  }
}